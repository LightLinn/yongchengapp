from django.shortcuts import render
from rest_framework.serializers import ValidationError

# Create your views here.

# 創建Course ViewSets
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from notifications.models import Notification
from authentication.models import CustomUser
from .models import Course, CourseType, AssignedCourse, EnrollmentNumbers, EnrollmentList
from attendance.models import Attendance
from humanresources.models import Coach
from .serializers import CourseSerializer, CourseTypeSerializer, AssignedCourseSerializer, EnrollmentNumbersSerializer, EnrollmentListSerializer
from authentication.permissions import *
from datetime import datetime, timedelta
from django.utils import timezone

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all()
        enrollment_list_id = self.request.query_params.get('enrollment_list_id', None)
        enrollment_number = self.request.query_params.get('enrollment_number', None)
        coach_id = self.request.query_params.get('coach_id', None)
        if enrollment_list_id is not None:
            queryset = queryset.filter(enrollment_list__id=enrollment_list_id)
        if enrollment_number is not None:
            queryset = queryset.filter(enrollment_list__enrollment_number__name=enrollment_number)
        if coach_id is not None:
            queryset = queryset.filter(enrollment_list__coach_id=coach_id)
        return queryset
    
    @action(detail=True, methods=['put'], url_path='transfer')
    def transfer(self, request, pk=None):
        try:
            course = self.get_object()
            action_type = request.query_params.get('action', None)  # 通過 query_params 獲取 URL 中的參數
            date = request.data.get('date', None)
            print(date)

            # 取得 enrollment_number
            enrollment_number = course.enrollment_number

            # 查找相同 enrollment_number 的所有課程
            related_courses = Course.objects.filter(enrollment_number=enrollment_number).order_by('course_date')
            
            # 獲取最後一筆課程的日期
            last_course_date = related_courses.last().course_date

            #related_courses篩選出course_date=ccourse.course_date
            related_courses = related_courses.filter(course_date=course.course_date)

            if action_type == 'pass':
                for related_course in related_courses:
                    related_course.course_date = last_course_date + timedelta(weeks=1)
                    last_course_date = related_course.course_date
                    related_course.save()
                    Attendance.objects.filter(course=course).delete()
            
            elif action_type == 'adjust':
                for related_course in related_courses:
                    related_course.course_date = date
                    related_course.save()
                    Attendance.objects.filter(course=course).delete()
            else:
                return Response({'error': '無效的操作'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'status': f'{action_type}成功'}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': '課程不存在'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class CourseTypeViewSet(viewsets.ModelViewSet):
    queryset = CourseType.objects.all()
    serializer_class = CourseTypeSerializer


class AssignedCourseViewSet(viewsets.ModelViewSet):
    queryset = AssignedCourse.objects.all()
    serializer_class = AssignedCourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        coach_id = self.request.query_params.get('coach', None)
        enrollment_number_id = self.request.query_params.get('enrollment_number', None)
        if coach_id is not None:
            try:
                coach = Coach.objects.get(user_id=coach_id)
                queryset = queryset.filter(coach=coach)
                # 篩選當前時間在assigned_time and deadline之間的資料
                queryset = queryset.filter(assigned_time__lte=datetime.now(), deadline__gte=datetime.now())
            except Coach.DoesNotExist:
                return queryset.none()

        if enrollment_number_id is not None:
            queryset = queryset.filter(enrollment_number__id=enrollment_number_id)
        
        return queryset

    @action(detail=True, methods=['patch'], url_path='update_status')
    def update_status(self, request, pk=None):
        assignment = self.get_object()
        assignment_status = request.data.get('status')
        if assignment_status not in ['已接受', '已拒絕']:
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        assignment.assigned_status = assignment_status
        assignment.save()

        if assignment_status == '已拒絕':
            self.update_following_assignments(assignment)

        elif assignment_status == '已接受':
            self.handle_accept_assignment(assignment)

        return Response(self.get_serializer(assignment).data)

    def update_following_assignments(self, rejected_assignment):
        enrollment_number = rejected_assignment.enrollment_number
        following_assignments = AssignedCourse.objects.filter(
            enrollment_number=enrollment_number,
            rank__gt=rejected_assignment.rank
        ).order_by('rank')

        current_time = timezone.now()
        for assignment in following_assignments:
            assignment.assigned_time = current_time
            assignment.deadline = current_time + timedelta(hours=assignment.consider_hours)
            assignment.save()
            current_time = assignment.deadline

    def handle_accept_assignment(self, accepted_assignment):
        print(accepted_assignment)
        enrollment_number = accepted_assignment.enrollment_number
        enrollment_lists = EnrollmentList.objects.filter(enrollment_number=enrollment_number)

        enrollment_lists.update(enrollment_status='進行中')
        enrollment_lists.update(coach=accepted_assignment.coach)

        course = Course.objects.filter(enrollment_list__enrollment_number=enrollment_number)
        course.update(course_status='進行中')
        

        # for enrollment in enrollment_lists:
        #     course_type = enrollment.coursetype
        #     if course_type:
        #         start_date = enrollment.start_date
        #         course_time = enrollment.start_time
        #         number_of_sessions = course_type.number_of_sessions

        #         for i in range(number_of_sessions):
        #             course_date = start_date + timedelta(days=i*7)
        #             Course.objects.create(
        #                 course_date=course_date,
        #                 course_time=course_time,
        #                 course_status='未開課',
        #                 enrollment_list=enrollment, 
        #                 enrollment_number=enrollment_number
                    # )

    @action(detail=False, methods=['post'], url_path='create_assigned')
    def create_assigned(self, request):
        try:
            assigned_courses_data = request.data if isinstance(request.data, list) else [request.data]
            for course_data in assigned_courses_data:
                rank = course_data.get('rank')
                decide_hours = course_data.get('considerHours')
                coach_id = course_data.get('coach', None)
                enrollment_number_id = course_data.get('enrollment_number')
                assigned_status = course_data.get('assigned_status')
                assigned_time = course_data.get('assigned_time')
                deadline = course_data.get('deadline')

                try:
                    coach = Coach.objects.get(id=coach_id)
                except Coach.DoesNotExist:
                    return Response({'detail': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)

                enrollment_number = EnrollmentNumbers.objects.get(id=enrollment_number_id)

                new_assigned_course = AssignedCourse(
                    rank=rank,
                    decide_hours=decide_hours,
                    coach=coach,
                    enrollment_number=enrollment_number,
                    assigned_status=assigned_status,
                    assigned_time=datetime.fromisoformat(assigned_time.replace('Z', '+00:00')),
                    deadline=datetime.fromisoformat(deadline.replace('Z', '+00:00')),
                )
                new_assigned_course.save()

            return Response({'detail': 'Assigned courses created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'], url_path='get_assigned')
    def get_assigned(self, request):
        return Response({'detail': 'Get assigned courses'})
        
class EnrollmentNumbersViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentNumbers.objects.all().order_by('-id')
    serializer_class = EnrollmentNumbersSerializer
    

class EnrollmentListViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentList.objects.all()
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user', None)
        coach_id = self.request.query_params.get('coach', None)
        if user_id is not None:
            return queryset.filter(user_id=user_id)
        if coach_id is not None:
            return queryset.filter(coach__user__id=coach_id)
        return queryset
    
    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)
        enrollment = serializer.save(user=self.request.user)
        
        
        # 假设需要通知的群组是 "管理人員"
        group_name = "內部_管理人員"  # 这里填写实际的群组名称
        try:
            group = Group.objects.get(name=group_name)
            users_in_group = group.user_set.all()  # 获取该群组中的所有用户
            ycappsystem = CustomUser.objects.get(username='ycappsystem')

            notifications = [
                Notification(
                    title=f"學生{enrollment.student}進行報名",
                    content=f"學生 {enrollment.student} 剛剛報名了一門新課程。",
                    type="全體公告",
                    notify_status="待傳送",
                    method="APP",
                    created_by=ycappsystem,
                    users=user,
                ) for user in users_in_group
            ]

            Notification.objects.bulk_create(notifications)
            
        except Group.DoesNotExist:
            return Response({"error": f"群組 '{group_name}' 不存在"}, status=status.HTTP_400_BAD_REQUEST)
        print(enrollment.student)
        return Response({"status": "報名已成功", "notification": "通知已發送至管理人員"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='latest')
    def latest_enrollment(self, request):
        user_id = request.query_params.get('user', None)
        if not user_id:
            return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            latest_enrollment = EnrollmentList.objects.filter(user_id=user_id).latest('created_at')
            serializer = EnrollmentListSerializer(latest_enrollment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EnrollmentList.DoesNotExist:
            return Response({"detail": "No enrollment records found for this user."}, status=status.HTTP_404_NOT_FOUND)

    # 2024/08/17合併update_status和update_enrollment
    # @action(detail=True, methods=['patch'])
    # def update_status(self, request, pk=None):
    #     enrollment = self.get_object()
    #     enrollment_status = request.data.get('enrollment_status', None)
    #     payment_amount = request.data.get('payment_amount', None)
    #     payment_method = request.data.get('payment_method', None)
    #     payment_date = request.data.get('payment_date', None)
    #     remark = request.data.get('remark', None)
    #     coach = request.data.get('coach', None)

    #     if enrollment_status:
    #         enrollment.enrollment_status = enrollment_status
    #     if payment_amount is not None:
    #         enrollment.payment_amount = payment_amount
    #     if payment_method:
    #         enrollment.payment_method = payment_method
    #     if payment_date:  
    #         enrollment.payment_date = payment_date
    #     if coach:
    #         coach = Coach.objects.get(user__username=coach)
    #         enrollment.coach = coach
    #     if remark:
    #         enrollment.remark = remark

    #     enrollment.save()
    #     serializer = self.get_serializer(enrollment)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    # @action(detail=True, methods=['patch'])
    # def update_enrollment(self, request, pk=None):
    #     enrollment = self.get_object()
    #     serializer = EnrollmentListSerializer(enrollment, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_enrollment(self, request, pk=None):
        enrollment = self.get_object()

        # 更新直接的字段
        enrollment_status = request.data.get('enrollment_status', None)
        payment_amount = request.data.get('payment_amount', None)
        payment_method = request.data.get('payment_method', None)
        payment_date = request.data.get('payment_date', None)
        remark = request.data.get('remark', None)
        coach = request.data.get('coach', None)

        if enrollment_status:
            enrollment.enrollment_status = enrollment_status
        if payment_amount is not None:
            enrollment.payment_amount = payment_amount
        if payment_method:
            enrollment.payment_method = payment_method
        if payment_date:  
            enrollment.payment_date = payment_date
        if remark:
            enrollment.remark = remark
        if coach:
            try:
                coach_instance = Coach.objects.get(user__username=coach)
                enrollment.coach = coach_instance
            except Coach.DoesNotExist:
                return Response({"error": "Coach not found"}, status=status.HTTP_400_BAD_REQUEST)

        # 使用序列化器處理其他字段的更新
        serializer = EnrollmentListSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['patch'], url_path='update_status_by_number')
    def update_status_by_number(self, request):
        enrollment_number_name = request.data.get('enrollment_number')
        selected_dates = request.data.get('selectedDates', [])
        
        if not enrollment_number_name or not selected_dates:
            return Response({'detail': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        enrollments = EnrollmentList.objects.filter(enrollment_number__name=enrollment_number_name)
        enrollments.update(enrollment_status='派課中')

        for enrollment in enrollments:
            for date in selected_dates:
                Course.objects.create(
                    enrollment_list=enrollment,
                    enrollment_number=enrollment.enrollment_number,
                    course_date=date,
                    course_time=enrollment.start_time,
                    course_status='未開課'
                )
        
        return Response({'detail': 'Status updated successfully'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], url_path='direct_assign')
    def direct_assign(self, request, pk=None):
        enrollment = self.get_object()
        enrollment_status = request.data.get('enrollment_status', None)
        selected_dates = request.data.get('selectedDates', [])
        coach_id = request.data.get('coach', None)

        if not enrollment_status or not coach_id or not selected_dates:
            return Response({'detail': 'enrollment_status, selected_dates, and coach are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the coach instance
        try:
            coach = Coach.objects.get(id=coach_id)
        except Coach.DoesNotExist:
            return Response({'detail': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch all enrollments with the same enrollment_number
        enrollments = EnrollmentList.objects.filter(enrollment_number=enrollment.enrollment_number)

        # Update enrollment status and coach for all fetched enrollments
        for enrollment in enrollments:
            enrollment.enrollment_status = enrollment_status
            enrollment.coach = coach
            enrollment.save()

            # Create Course instances for each selected date
            for date in selected_dates:
                Course.objects.create(
                    enrollment_list=enrollment,
                    enrollment_number=enrollment.enrollment_number,
                    course_date=date,
                    course_time=enrollment.start_time,
                    course_status='進行中'
                )

        return Response({'detail': 'Enrollments and courses updated successfully'}, status=status.HTTP_200_OK)