from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Book


class BookModelTest(TestCase):
    """Tests for Book model"""
    
    def setUp(self):
        self.book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            price=29.99,
            quantity=10
        )
    
    def test_book_creation(self):
        """Test book creation"""
        self.assertEqual(self.book.title, 'Test Book')
        self.assertEqual(self.book.author, 'Test Author')
        self.assertEqual(float(self.book.price), 29.99)
        self.assertEqual(self.book.quantity, 10)
    
    def test_book_str(self):
        """Test book string representation"""
        self.assertEqual(str(self.book), 'Test Book - Test Author')


class BookAPITest(TestCase):
    """Tests for Book API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.book = Book.objects.create(
            title='Python Book',
            author='Guido',
            price=39.99,
            quantity=5
        )
    
    def test_login_successful(self):
        """Test successful login"""
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_failed(self):
        """Test failed login"""
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'wrongpass'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_book_list_requires_auth(self):
        """Test book list requires authentication"""
        response = self.client.get('/api/books/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_book_list_with_auth(self):
        """Test book list with authentication"""
        # Get token
        login_resp = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        token = login_resp.data['access']
        
        # Get books list
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/books/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_create_book_with_auth(self):
        """Test creating a book with authentication"""
        login_resp = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        token = login_resp.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/books/', {
            'title': 'Django Book',
            'author': 'Author Name',
            'price': 49.99,
            'quantity': 20
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Response might have 'data' key with the book object
        if 'data' in response.data:
            self.assertEqual(response.data['data']['title'], 'Django Book')
        else:
            self.assertEqual(response.data['title'], 'Django Book')
    
    def test_logout_requires_auth(self):
        """Test logout requires authentication"""
        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_logout_with_auth(self):
        """Test logout with authentication"""
        login_resp = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        token = login_resp.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/logout/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
