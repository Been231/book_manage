from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .filters import apply_book_filters


def index(request):
    books = Book.objects.all()
    return render(request, 'book/index.html', {'books': books})


class BookPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = Book.objects.all().order_by('id')
        queryset = apply_book_filters(queryset, self.request.query_params)
        return queryset

    def list(self, request, *args, **kwargs):
        """GET /api/books/ - Lay danh sach sach co filter + pagination"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """GET /api/books/<id>/ - Xem chi tiet 1 sach"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """POST /api/books/ - Them sach moi"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """PUT /api/books/<id>/ - Cap nhat toan bo sach"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/books/<id>/ - Cap nhat mot phan sach"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """DELETE /api/books/<id>/ - Xoa sach"""
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Xoa sach thanh cong'}, status=status.HTTP_204_NO_CONTENT)
