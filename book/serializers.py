
from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    """Serializer cho Book model"""
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'price', 'quantity']
        read_only_fields = ['id']
