from rest_framework.test import APITestCase
from authentication.models import User

class TestModel(APITestCase):
    
    def test_creates_user(self):
        user = User.objects.create_user('potate','malekmursyid@gmail.com', 'rightp@55word')
        self.assertIsInstance(user, User)
        self.assertFalse(user.is_staff)
        self.assertEqual(user.email, 'malekmursyid@gmail.com')

    def test_creates_super_user(self):
        user = User.objects.create_superuser('potate','malekmursyid@gmail.com', 'rightp@55word')
        self.assertIsInstance(user, User)
        self.assertTrue(user.is_staff)
        self.assertEqual(user.email, 'malekmursyid@gmail.com')

    # add for messages
    def test_raises_error_when_no_userna(self):
        self.assertRaises(ValueError,User.objects.create_user, username="", email='malekmursyid@gmail.com', password='rightp@55word')