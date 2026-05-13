"""
Unit tests for backend models
Tests the actual models in the models/ directory
"""

import unittest
import sys
import os

# Add parent directory to path so we can import models
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))


class TestUserModel(unittest.TestCase):
    """Test cases for User model from models.auth"""
    
    def test_user_model_import(self):
        """Test that User model can be imported"""
        from models.auth import User
        self.assertIsNotNone(User)
    
    def test_user_model_has_expected_fields(self):
        """Test User model has expected column fields"""
        from models.auth import User
        from sqlalchemy import inspect
        
        mapper = inspect(User)
        columns = [c.key for c in mapper.column_attrs]
        
        # Check for expected fields
        self.assertIn('id', columns)
        self.assertIn('email', columns)
        self.assertIn('name', columns)


class TestProductModel(unittest.TestCase):
    """Test cases for Products model"""
    
    def test_product_model_import(self):
        """Test that Products model can be imported"""
        from models.products import Products
        self.assertIsNotNone(Products)
    
    def test_product_model_has_expected_fields(self):
        """Test Products model has expected column fields"""
        from models.products import Products
        from sqlalchemy import inspect
        
        mapper = inspect(Products)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestBrandModel(unittest.TestCase):
    """Test cases for Brands model"""
    
    def test_brand_model_import(self):
        """Test that Brands model can be imported"""
        from models.brands import Brands
        self.assertIsNotNone(Brands)
    
    def test_brand_model_has_expected_fields(self):
        """Test Brands model has expected column fields"""
        from models.brands import Brands
        from sqlalchemy import inspect
        
        mapper = inspect(Brands)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestCategoryModel(unittest.TestCase):
    """Test cases for Categories model"""
    
    def test_category_model_import(self):
        """Test that Categories model can be imported"""
        from models.categories import Categories
        self.assertIsNotNone(Categories)
    
    def test_category_model_has_expected_fields(self):
        """Test Categories model has expected column fields"""
        from models.categories import Categories
        from sqlalchemy import inspect
        
        mapper = inspect(Categories)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestInquiryModel(unittest.TestCase):
    """Test cases for Inquiries model"""
    
    def test_inquiry_model_import(self):
        """Test that Inquiries model can be imported"""
        from models.inquiries import Inquiries
        self.assertIsNotNone(Inquiries)
    
    def test_inquiry_model_has_expected_fields(self):
        """Test Inquiries model has expected column fields"""
        from models.inquiries import Inquiries
        from sqlalchemy import inspect
        
        mapper = inspect(Inquiries)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestSiteContentModel(unittest.TestCase):
    """Test cases for Site_content model"""
    
    def test_site_content_model_import(self):
        """Test that Site_content model can be imported"""
        from models.site_content import Site_content
        self.assertIsNotNone(Site_content)
    
    def test_site_content_model_has_expected_fields(self):
        """Test Site_content model has expected column fields"""
        from models.site_content import Site_content
        from sqlalchemy import inspect
        
        mapper = inspect(Site_content)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestAppConfigModel(unittest.TestCase):
    """Test cases for App_configs model"""
    
    def test_app_config_model_import(self):
        """Test that App_configs model can be imported"""
        from models.app_configs import App_configs
        self.assertIsNotNone(App_configs)
    
    def test_app_config_model_has_expected_fields(self):
        """Test App_configs model has expected column fields"""
        from models.app_configs import App_configs
        from sqlalchemy import inspect
        
        mapper = inspect(App_configs)
        columns = [c.key for c in mapper.column_attrs]
        
        self.assertIn('id', columns)


class TestOIDCStateModel(unittest.TestCase):
    """Test cases for OIDCState model"""
    
    def test_oidc_state_model_import(self):
        """Test that OIDCState model can be imported"""
        from models.auth import OIDCState
        self.assertIsNotNone(OIDCState)


if __name__ == '__main__':
    unittest.main()