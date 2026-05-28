$BACKEND_DIR = Join-Path $PSScriptRoot "backend"
$FRONTEND_DIR = Join-Path $PSScriptRoot "frontend"

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Err { Write-Host "[ERROR] $args" -ForegroundColor Red }

function Kill-Port($port) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Info "Killed processes on port $port"
}

Kill-Port 8001; Kill-Port 8002; Kill-Port 3001; Kill-Port 3002
Start-Sleep -Seconds 2

Write-Info "Starting staging backend (port 8001)..."
$envStaging = @{
    DATABASE_URL = "sqlite+aiosqlite:///./app.db"
    ENVIRONMENT = "staging"
    DEBUG = "true"
    JWT_SECRET_KEY = ""
    JWT_EXPIRE_MINUTES = "30"
    ALLOWED_ORIGINS = "http://localhost:3001"
}
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$BACKEND_DIR'; `$env:DATABASE_URL='$($envStaging.DATABASE_URL)'; `$env:ENVIRONMENT='$($envStaging.ENVIRONMENT)'; `$env:JWT_SECRET_KEY='$($envStaging.JWT_SECRET_KEY)'; `$env:JWT_EXPIRE_MINUTES='$($envStaging.JWT_EXPIRE_MINUTES)'; `$env:ALLOWED_ORIGINS='$($envStaging.ALLOWED_ORIGINS)'; python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

Write-Info "Starting instance2 backend (port 8002)..."
$envInstance2 = @{
    DATABASE_URL = "sqlite+aiosqlite:///./app_dev2.db"
    ENVIRONMENT = "instance2"
    DEBUG = "true"
    JWT_SECRET_KEY = ""
    JWT_EXPIRE_MINUTES = "30"
    ALLOWED_ORIGINS = "http://localhost:3002"
}
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$BACKEND_DIR'; `$env:DATABASE_URL='$($envInstance2.DATABASE_URL)'; `$env:ENVIRONMENT='$($envInstance2.ENVIRONMENT)'; `$env:JWT_SECRET_KEY='$($envInstance2.JWT_SECRET_KEY)'; `$env:JWT_EXPIRE_MINUTES='$($envInstance2.JWT_EXPIRE_MINUTES)'; `$env:ALLOWED_ORIGINS='$($envInstance2.ALLOWED_ORIGINS)'; python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload"

Write-Info "Starting staging frontend (port 3001)..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$FRONTEND_DIR'; `$env:VITE_BACKEND_URL='http://127.0.0.1:8001'; `$env:VITE_PORT='3001'; npm run dev"

Write-Info "Starting instance2 frontend (port 3002)..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$FRONTEND_DIR'; `$env:VITE_BACKEND_URL='http://127.0.0.1:8002'; `$env:VITE_PORT='3002'; npm run dev"

Write-Success "All services started. Waiting for health check..."
Start-Sleep -Seconds 10

for ($i = 1; $i -le 5; $i++) {
    $ok = 0
    foreach ($port in @(8001, 8002)) {
        try {
            $r = Invoke-WebRequest -Uri "http://127.0.0.1:$port/docs" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($r.StatusCode -eq 200) { $ok++ }
        } catch {}
    }
    if ($ok -eq 2) { Write-Success "Both backends ready"; break }
    Write-Info "Waiting for backends... ($i/5)"
    Start-Sleep -Seconds 3
}

Write-Success "Restart complete."