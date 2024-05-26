from django.db import models
from reviews.models import Auditable

# Create your models here.

class EnrollmentNumbers(Auditable):
    name = models.CharField(max_length=255, verbose_name='報名單編號')
    description = models.TextField(verbose_name='組別描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    number_of_sessions = models.IntegerField(verbose_name='課堂數量', default=10, blank=True, null=True)
    venue = models.ForeignKey('venues.Venue', on_delete=models.CASCADE, related_name='enrollments', verbose_name='場地', null=True, blank=True)
    coach = models.ForeignKey('humanresources.Coach', on_delete=models.CASCADE, related_name='enrollments', verbose_name='教練', null=True, blank=True)

    class Meta:
        db_table = 'enrollment_number'
        verbose_name = '報名單編號'
        verbose_name_plural = '報名單編號'

    def __str__(self):
        return self.name

class EnrollmentList(Auditable):
    ENROLLMENT_STATUS_CHOICES = [
        ('pending_payment', '待付款'),
        ('in_progress', '審核中'),
        ('in_assigned', '派課中'),
        ('assigned', '已派課'),
        ('not_assigned', '未派課'),
        ('not_accepted', '未接受'),
        ('completed', '已完成'),
        ('cancelled', '已取消'),
        ('refunded', '已退款'),
    ]
    PAYMENT_CHOICES = [
        ('cash', '現金'),
        # ('credit_card', '信用卡'),
        # ('transfer', '轉帳'),
        # ('other', '其他'),
    ]

    enrollment_status = models.CharField(max_length=20, choices=ENROLLMENT_STATUS_CHOICES, verbose_name='報名狀態', blank=True, null=True)
    coursetype = models.ForeignKey('courses.CourseType', on_delete=models.CASCADE, related_name='enrollments', verbose_name='課程類型', null=True, blank=True)
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='enrollments', null=True, blank=True)
    student = models.CharField(max_length=255, verbose_name='學生姓名')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    start_date = models.DateField(verbose_name='開始日期', blank=True, null=True)
    start_time = models.DateTimeField(verbose_name='開始時間', blank=True, null=True)
    payment_date = models.DateField(verbose_name='付款日期', blank=True, null=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, verbose_name='付款方式', blank=True, null=True, default='cash')
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='付款金額', blank=True, null=True)
    remark = models.TextField(verbose_name='備註', null=True, blank=True)
    degree = models.CharField(max_length=255, verbose_name='程度描述', blank=True, null=True)
    enrollment_number = models.ForeignKey('EnrollmentNumbers', on_delete=models.SET_NULL, related_name='enrollments', verbose_name='報名單編號', null=True, blank=True)

    class Meta:
        db_table = 'enrollment'
        verbose_name = '報名'
        verbose_name_plural = '報名'

    def __str__(self):
        return f'{self.course.name} - {self.student.username}'
    
class AssignedCourse(Auditable):
    ASSIGNED_STATUS_CHOICES = [
        ('pending', '待決定'),
        ('accepted', '已接受'),
        ('rejected', '已拒絕'),
    ]
    coach = models.ForeignKey('humanresources.Coach', on_delete=models.CASCADE, related_name='assigned_courses', verbose_name='教練', null=True, blank=True)
    assigned_status = models.CharField(max_length=20, choices=ASSIGNED_STATUS_CHOICES, verbose_name='狀態', default='pending')
    assigned_time = models.DateTimeField(verbose_name='指派時間', blank=True, null=True)
    deadline = models.DateTimeField(verbose_name='截止時間', blank=True, null=True)
    decide_hours = models.IntegerField(verbose_name='決定時間(小時)', blank=True, null=True, default=24)
    rank = models.IntegerField(verbose_name='順位', blank=True, null=True)
    remark = models.TextField(verbose_name='備註', null=True, blank=True)
    enrollment_number = models.ForeignKey('EnrollmentNumbers', on_delete=models.SET_NULL, related_name='assigned_courses', verbose_name='報名單編號', null=True, blank=True)

    class Meta:
        db_table = 'assigned_course'
        verbose_name = '指派課程'
        verbose_name_plural = '指派課程'

    def __str__(self):
        return f'{self.enrollment.student.username} - {self.coach.user.username}'

class CourseType(Auditable):
    name = models.CharField(max_length=255, verbose_name='課程類型名稱')
    description = models.TextField(verbose_name='課程類型描述')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='價格', blank=True, null=True)
    capacity = models.IntegerField(verbose_name='容量', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    number_of_sessions = models.IntegerField(verbose_name='每期堂數', blank=True, null=True)

    class Meta:
        db_table = 'course_type'
        verbose_name = '課程類型'
        verbose_name_plural = '課程類型'

    def __str__(self):
        return self.name

class Course(Auditable):
    COURSE_STATUS_CHOICES = [
        ('not_started', '未開課'),
        ('in_progress', '進行中'),
        ('cancelled', '已取消'),
        ('completed', '已完成'),
        ('suspended', '已停課'),
    ]

    course_date = models.DateField(verbose_name='課程日期', blank=True, null=True)
    course_time = models.DateTimeField(verbose_name='課程時間', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')
    course_status = models.CharField(max_length=20, choices=COURSE_STATUS_CHOICES, verbose_name='課程狀態', blank=True, null=True)
    enrollment_number = models.ForeignKey('EnrollmentNumbers', on_delete=models.CASCADE, related_name='courses', verbose_name='報名表單號', blank=True, null=True)

    class Meta:
        db_table = 'course'
        verbose_name = '課程'
        verbose_name_plural = '課程'

    def __str__(self):
        return self.name
    
    
# Path: server/courses/serializers.py