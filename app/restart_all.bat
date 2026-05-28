@echo off
echo Stopping all backend/frontend processes...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo Starting Backend Staging (8001)...
start "Backend-8001" cmd /k "cd /d c:\Users\Bobrobizon\LocalRepo\PythonCarperfume\app\backend && python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo Starting Backend Instance2 (8002)...
start "Backend-8002" cmd /k "cd /d c:\Users\Bobrobizon\LocalRepo\PythonCarperfume\app\backend && set DATABASE_URL=sqlite+aiosqlite:///./app_dev2.db && python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload"

echo Starting Frontend Staging (3001)...
start "Frontend-3001" cmd /k "cd /d c:\Users\Bobrobizon\LocalRepo\PythonCarperfume\app\frontend && set VITE_BACKEND_URL=http://127.0.0.1:8001 && set VITE_PORT=3001 && npm run dev"

echo Starting Frontend Instance2 (3002)...
start "Frontend-3002" cmd /k "cd /d c:\Users\Bobrobizon\LocalRepo\PythonCarperfume\app\frontend && set VITE_BACKEND_URL=http://127.0.0.1:8002 && set VITE_PORT=3002 && npm run dev"

echo Waiting 15 seconds for services to start...
timeout /t 15 /nobreak >nul

echo Health check:
python check_health.py
pause