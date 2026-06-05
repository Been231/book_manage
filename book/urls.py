from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router tu dong tao cac endpoint CRUD
router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')

urlpatterns = [
    path('', views.index, name='index'),
    path('api/', include(router.urls)),
]
