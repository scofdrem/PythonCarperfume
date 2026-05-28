import subprocess
import os
import sys
import time
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.join(BASE, "backend")
FRONTEND = os.path.join(BASE, "frontend")

def kill_port(port):
    try:
        result = subprocess.check_output(
            ["powershell", "-Command",
             f"Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue | ForEach-Object {{ Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }}"]
        )
        print(f"Killed processes on port {port}")
    except Exception as e:
        pass

def health(port, timeout=3):
    try:
        r = urllib.request.urlopen(f"http://127.0.0.1:{port}/docs", timeout=timeout)
        return r.status == 200
    except:
        return False

def start_backend(port, db_file, env_name):
    env = os.environ.copy()
    env["DATABASE_URL"] = f"sqlite+aiosqlite:///./{db_file}"
    env["ENVIRONMENT"] = env_name
    env["DEBUG"] = "true"
    env["JWT_SECRET_KEY"] = ""
    env["JWT_EXPIRE_MINUTES"] = "30"
    env["ALLOWED_ORIGINS"] = f"http://localhost:{3000 + port - 8000}"
    cmd = f'cd "{BACKEND}"; python -m uvicorn main:app --host 0.0.0.0 --port {port} --reload'
    subprocess.Popen(["powershell", "-NoExit", "-Command", cmd], env=env, creationflags=subprocess.CREATE_NEW_CONSOLE)
    print(f"Started backend on port {port}")

def start_frontend(port, backend_url):
    env = os.environ.copy()
    env["VITE_BACKEND_URL"] = backend_url
    env["VITE_PORT"] = str(port)
    cmd = f'cd "{FRONTEND}"; npm run dev'
    subprocess.Popen(["powershell", "-NoExit", "-Command", cmd], env=env, creationflags=subprocess.CREATE_NEW_CONSOLE)
    print(f"Started frontend on port {port}")

print("Killing old processes...")
for p in [8001, 8002, 3001, 3002]:
    kill_port(p)

time.sleep(3)

print("Starting backends...")
start_backend(8001, "app.db", "staging")
time.sleep(1)
start_backend(8002, "app_dev2.db", "instance2")

time.sleep(2)

print("Starting frontends...")
start_frontend(3001, "http://127.0.0.1:8001")
time.sleep(1)
start_frontend(3002, "http://127.0.0.1:8002")

print("Waiting for services to start...")
time.sleep(8)

for i in range(1, 11):
    ok = 0
    for port in [8001, 8002]:
        if health(port):
            ok += 1
            print(f"  Port {port}: OK")
        else:
            print(f"  Port {port}: not ready")
    if ok == 2:
        print("Both backends ready!")
        break
    print(f"Waiting... ({i}/10)")
    time.sleep(3)
else:
    print("Backends did not become ready in time")
    sys.exit(1)

print("Restart complete.")