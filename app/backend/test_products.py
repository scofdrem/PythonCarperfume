import requests
import json

BASE_URL = 'http://localhost:8000'

# Test 1: Get existing products
print("=== Test 1: Get existing products ===")
r = requests.get(f'{BASE_URL}/api/v1/entities/products?limit=5', timeout=5)
print(f"Status: {r.status_code}")
data = r.json()
print(f"Total products: {data.get('total')}")
for item in data.get('items', []):
    print(f"  id={item['id']} name={item['name']} brand={item['brand']}")

# Test 2: Create a new product
print("\n=== Test 2: Create a new product ===")
new_product = {
    "name": "Test Product",
    "brand": "Test Brand",
    "price": 99.99,
    "category": "Test Category",
    "volumes": "10,20,30",
    "image": "https://example.com/image.jpg",
    "description": "Test description",
    "is_new": True,
    "is_featured": False
}
r = requests.post(f'{BASE_URL}/api/v1/entities/products', json=new_product, timeout=5)
print(f"Status: {r.status_code}")
print(f"Response: {r.text}")
if r.status_code == 201:
    created = r.json()
    print(f"Created product id={created['id']}")

# Test 3: Verify product was persisted
print("\n=== Test 3: Verify product persisted ===")
r = requests.get(f'{BASE_URL}/api/v1/entities/products?limit=5', timeout=5)
data = r.json()
print(f"Total products after create: {data.get('total')}")