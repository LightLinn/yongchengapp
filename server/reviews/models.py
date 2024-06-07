from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

# Create your models here.

class ReviewStage(models.Model):
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    reviewer = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE)
    next_stage = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['order']
        db_table = 'review_stages'
        verbose_name = '審核階段'
        verbose_name_plural = '審核階段'

class Auditable(models.Model):
    STATUS_CHOICES = [
        ('pending', '待審核'),
        ('reviewing', '審核中'),
        ('approved', '已批准'),
        ('rejected', '已拒絕'),
        ('requires_more_info', '需要更多信息'),
        ('cancelled', '已取消'),
        ('on_hold', '暫停'),
        ('re_review', '重新審核'),
        ('auto_approved', '自動批准'),
        ('expired', '已過期')
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='審核狀態')

    class Meta:
        abstract = True

    def approve(self):
        self.status = 'approved'
        self.save()

    def reject(self):
        self.status = 'rejected'
        self.save()

class Review(Auditable):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    current_stage = models.ForeignKey(ReviewStage, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'reviews'
        verbose_name = '審核'
        verbose_name_plural = '審核'

    def __str__(self):
        return f'{self.application.user.username} - {self.user.username}'
    
    def advance_next_stage(self):
        if self.current_stage and self.current_stage.next_stage:
            self.current_stage = self.current_stage.next_stage
            self.save()
    

'''
如果你想要將來自多個需要審核的資料模型彙整到一個單一的資料模型，你可以創建一個新的資料模型，例如 Review，並使用 Django 的 GenericForeignKey 來參照任何需要審核的物件。以下是一個範例：
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

class Review(models.Model):
    STATUS_CHOICES = [
        ('pending', '待審核'),
        ('approved', '已批准'),
        ('rejected', '已拒絕'),
    ]

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

在這個模型中，content_type 欄位存儲了需要審核的物件的模型，object_id 欄位存儲了需要審核的物件的 ID，content_object 是一個 GenericForeignKey，它可以用來直接獲取需要審核的物件。
當你需要創建一個新的審核時，你可以創建一個新的 Review 物件，並將 content_object 設定為需要審核的物件。例如：
review = Review(content_object=my_object)
review.save()

然後，你可以在 Django admin 中創建一個 Review 物件的列表，以便管理者可以看到所有需要審核的物件。你也可以在 Review 模型中添加一個方法來更改物件的狀態，例如：
class Review(models.Model):
    # ...

    def approve(self):
        self.status = 'approved'
        self.save()

        # 修改需要審核的資料模型的狀態
        content_object = self.content_object
        if hasattr(content_object, 'status'):
            content_object.status = 'approved'
            content_object.save()

    def reject(self):
        self.status = 'rejected'
        self.save()

這樣，管理者就可以從 Django admin 中審核或拒絕任何需要審核的物件。
在這個範例中，我們首先獲取到需要審核的物件（content_object），然後檢查它是否有一個 status 欄位。如果有，我們就將這個欄位設定為 'approved'，並保存物件。
請注意，這個範例假設所有需要審核的資料模型都有一個名為 status 的欄位，並且可以被設定為 'approved'。如果你的模型有不同的欄位名稱或狀態值，你需要相應地修改這個方法。   
'''