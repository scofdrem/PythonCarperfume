# Import all models so they register with Base.metadata before create_all() runs
from models.app_configs import App_configs
from models.auth import OIDCState, User
from models.brands import Brands
from models.categories import Categories
from models.inquiries import Inquiries
from models.products import Products
from models.site_content import Site_content
from models.landing_page import LandingPage
from models.landing_catalogue import LandingCatalogue
from models.landing_product import LandingProduct

__all__ = [
    "App_configs",
    "Brands",
    "Categories",
    "Inquiries",
    "LandingCatalogue",
    "LandingPage",
    "LandingProduct",
    "OIDCState",
    "Products",
    "Site_content",
    "User",
]
