from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer


# Trang HTML danh sach sach
def index(request):
    books = Book.objects.all()
    return render(request, 'book/index.html', {'books': books})


# CRUD API dung ModelViewSet
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]  # Chi nguoi dung da dang nhap moi duoc truy cap
