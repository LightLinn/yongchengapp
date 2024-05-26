from django.db import models
from reviews.models import Auditable

# Create your models here.

# 創建教练、救生员及管理者总表、救生员班表、教练课表
# 創建学生列表、教练列表、救生员列表、员工列表
# 創建員工績效表、員工薪資表、工作日誌紀錄表、薪資級距表

class Employee(Auditable):
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='employees', verbose_name='使用者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'employee'
        verbose_name = '员工清單'
        verbose_name_plural = '员工清單'

    def __str__(self):
        return self.user.username

class Coach(Auditable):
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='coaches', verbose_name='使用者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'coach'
        verbose_name = '教练清單'
        verbose_name_plural = '教练清單'

    def __str__(self):
        return self.user.username
    
class Lifeguard(Auditable):
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='lifeguards', verbose_name='使用者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'lifeguard'
        verbose_name = '救生员清單'
        verbose_name_plural = '救生员清單'

    def __str__(self):
        return self.user.username
    
class VenueManager(Auditable):
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='venue_managers', verbose_name='使用者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'venue_manager'
        verbose_name = '场地管理人员清單'
        verbose_name_plural = '场地管理人员清單'

    def __str__(self):
        return self.user.username
    
class Salary(Auditable):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='salaries', verbose_name='员工')
    date = models.DateField(verbose_name='日期')
    salary = models.ForeignKey('SalaryRange', on_delete=models.CASCADE, verbose_name='薪资级距')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'salary'
        verbose_name = '员工薪资'
        verbose_name_plural = '员工薪资'

    def __str__(self):
        return self.employee.user.username
    
class SalaryRange(Auditable):
    name = models.CharField(max_length=255, verbose_name='薪资级距名')
    description = models.TextField(verbose_name='薪资级距描述')
    monthly_salary = models.IntegerField(verbose_name='月薪', default=0)
    hourly_salary = models.IntegerField(verbose_name='时薪', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'salary_range'
        verbose_name = '薪资级距'
        verbose_name_plural = '薪资级距'

    def __str__(self):
        return self.name
    
class Performance(Auditable):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='performances', verbose_name='员工')
    date = models.DateField(verbose_name='日期')
    performance = models.CharField(max_length=100, verbose_name='绩效')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='建立时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'performance'
        verbose_name = '员工绩效'
        verbose_name_plural = '员工绩效'

    def __str__(self):
        return self.employee.user.username
