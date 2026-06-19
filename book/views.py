from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .filters import apply_book_filters


# ========================================
# CUSTOM PAGINATION
# ========================================
class BookPagination(PageNumberPagination):
    """Pagination tuỳ chỉnh cho Book List API"""
    page_size = 20
    page_size_query_param = 'page_size'
    page_size_query_description = 'Số items trên mỗi trang'
    max_page_size = 100


# ========================================
# VIEWS
# ========================================
def index(request):
    """Trang index của frontend"""
    books = Book.objects.all()
    return render(request, 'book/index.html', {'books': books})


class BookViewSet(viewsets.ModelViewSet):
    """
    API ViewSet cho Book CRUD operations
    - GET /api/books/ - Danh sách sách (có pagination & filter)
    - GET /api/books/<id>/ - Chi tiết sách
    - POST /api/books/ - Tạo sách mới
    - PUT /api/books/<id>/ - Cập nhật toàn bộ sách
    - PATCH /api/books/<id>/ - Cập nhật riêng phần sách
    - DELETE /api/books/<id>/ - Xóa sách
    """
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookPagination

    def get_queryset(self):
        """Lấy queryset với filters và sorting"""
        queryset = Book.objects.all().order_by('id')
        queryset = apply_book_filters(queryset, self.request.query_params)
        return queryset

    def list(self, request, *args, **kwargs):
        """GET /api/books/ - Lấy danh sách sách có filter + pagination"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """GET /api/books/<id>/ - Xem chi tiết một sách"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """POST /api/books/ - Tạo sách mới"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Tạo sách thành công', 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """PUT /api/books/<id>/ - Cập nhật toàn bộ sách"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Cập nhật sách thành công',
            'data': serializer.data
        })

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/books/<id>/ - Cập nhật một phần sách"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Cập nhật sách thành công',
            'data': serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        """DELETE /api/books/<id>/ - Xóa sách"""
        instance = self.get_object()
        instance.delete()
        return Response(
            {'message': 'Xóa sách thành công'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """POST /api/logout/ - Đăng xuất (xóa token phía client)"""
    return Response(
        {'message': 'Đăng xuất thành công'},
        status=status.HTTP_200_OK
    )
