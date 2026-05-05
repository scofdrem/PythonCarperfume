# Import all models so they register with Base.metadata before create_all() runs
from models.app_configs import App_configs
from models.auth import OIDCState, User
from models.brands import Brands
from models.categories import Categories
from models.inquiries import Inquiries
from models.products import Products
from models.site_content import Site_content

__all__ = [
    "App_configs",
    "Brands",
    "Categories",
    "Inquiries",
    "OIDCState",
    "Products",
    "Site_content",
    "User",
]