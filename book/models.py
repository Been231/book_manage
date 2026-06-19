from django.db import models


class Book(models.Model):
    """Model cho Sách"""
    title = models.CharField(max_length=200, verbose_name='Tiêu đề')
    author = models.CharField(max_length=100, verbose_name='Tác giả')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Giá')
    quantity = models.IntegerField(verbose_name='Số lượng')

    class Meta:
        ordering = ['-id']
        verbose_name = 'Sách'
        verbose_name_plural = 'Sách'

    def __str__(self):
        return f"{self.title} - {self.author}"
