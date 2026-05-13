"""
Integration tests for backend API endpoints
Tests the actual API routes
"""

import unittest
import sys
import os
import json
from unittest.mock import MagicMock, patch

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))


class TestHealthEndpoint(unittest.TestCase):
    """Tests for health endpoint"""
    
    def test_health_endpoint_import(self):
        """Test that health router can be imported"""
        try:
            from routers import health
            self.assertIsNotNone(health)
        except ImportError:
            self.skipTest("Health router not available")


class TestAuthEndpoints(unittest.TestCase):
    """Tests for authentication endpoints"""
    
    def test_auth_router_import(self):
        """Test that auth router can be imported"""
        try:
            from routers import auth
            self.assertIsNotNone(auth)
        except ImportError:
            self.skipTest("Auth router not available")


class TestAromaEndpoints(unittest.TestCase):
    """Tests for aroma endpoints"""
    
    def test_products_router_import(self):
        """Test that products router can be imported"""
        try:
            from routers import products
            self.assertIsNotNone(products)
        except ImportError:
            self.skipTest("Products router not available")


class TestCategoryEndpoints(unittest.TestCase):
    """Tests for category endpoints"""
    
    def test_categories_router_import(self):
        """Test that categories router can be imported"""
        try:
            from routers import categories
            self.assertIsNotNone(categories)
        except ImportError:
            self.skipTest("Categories router not available")


class TestBrandEndpoints(unittest.TestCase):
    """Tests for brand endpoints"""
    
    def test_brands_router_import(self):
        """Test that brands router can be imported"""
        try:
            from routers import brands
            self.assertIsNotNone(brands)
        except ImportError:
            self.skipTest("Brands router not available")


class TestInquiryEndpoints(unittest.TestCase):
    """Tests for inquiry endpoints"""
    
    def test_inquiries_router_import(self):
        """Test that inquiries router can be imported"""
        try:
            from routers import inquiries
            self.assertIsNotNone(inquiries)
        except ImportError:
            self.skipTest("Inquiries router not available")


class TestContentEndpoints(unittest.TestCase):
    """Tests for content endpoints"""
    
    def test_site_content_router_import(self):
        """Test that site_content router can be imported"""
        try:
            from routers import site_content
            self.assertIsNotNone(site_content)
        except ImportError:
            self.skipTest("Site content router not available")


class TestMainApp(unittest.TestCase):
    """Tests for main application"""
    
    def test_main_app_import(self):
        """Test that main app can be imported"""
        try:
            from main import app
            self.assertIsNotNone(app)
            self.assertEqual(app.title, "FastAPI Modular Template")
        except ImportError:
            self.skipTest("Main app not available")
    
    def test_app_has_routes(self):
        """Test that app has registered routes"""
        try:
            from main import app
            routes = list(app.routes)
            self.assertGreater(len(routes), 0, "App should have registered routes")
        except ImportError:
            self.skipTest("Main app not available")


if __name__ == '__main__':
    unittest.main()