import urllib.request
for port, name in [(8001,'staging'),(8002,'instance2')]:
    try:
        r = urllib.request.urlopen('http://127.0.0.1:{}/docs'.format(port), timeout=5)
        print('{}: OK ({})'.format(name, r.status))
    except Exception as e:
        print('{}: FAIL ({})'.format(name, e))