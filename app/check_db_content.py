import requests

r = requests.get('http://localhost:8002/api/v1/entities/site_content?limit=100', timeout=5)
data = r.json()
items = data.get('items', [])
print('Total:', data.get('total'))

from collections import Counter
keys = [i['content_key'] for i in items]
dupes = {k: v for k, v in Counter(keys).items() if v > 1}
print('Duplicates:', dupes)

for i in items:
    val = i.get('content_value', '') or ''
    print(f'  id={i["id"]} key={i["content_key"]} val_len={len(val)}')