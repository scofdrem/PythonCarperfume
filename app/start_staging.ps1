# 1000Aromas Staging Environment Startup Script
# This script starts both frontend and backend services for local staging testing

# Configuration
$BACKEND_PORT = 8001
$FRONTEND_PORT = 3001
$PYTHON_BACKEND_URL = "http://127.0.0.1:$BACKEND_PORT"

# Colors for output
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Info "========================================="
Write-Info "  1000Aromas - Staging Environment"
Write-Info "========================================="

# Check if ports are available
function Test-Port($port) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connections -eq $null
}

if (-not (Test-Port $BACKEND_PORT)) {
    Write-Error "Port $BACKEND_PORT is already in use. Please stop the process using this port."
    exit 1
}

if (-not (Test-Port $FRONTEND_PORT)) {
    Write-Error "Port $FRONTEND_PORT is already in use. Please stop the process using this port."
    exit 1
}

# Start Backend
Write-Info "Starting Backend service on port $BACKEND_PORT..."
$env:BACKEND_PORT = $BACKEND_PORT
$env:FRONTEND_PORT = $FRONTEND_PORT
$env:PYTHON_BACKEND_URL = $PYTHON_BACKEND_URL
$env:ENVIRONMENT = "staging"
$env:IS_LAMBDA = "false"
$env:DEBUG = "true"

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload"

Write-Success "Backend started at $PYTHON_BACKEND_URL"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Info "Starting Frontend service on port $FRONTEND_PORT..."
$env:VITE_PORT = $FRONTEND_PORT
$env:PYTHON_BACKEND_URL = $PYTHON_BACKEND_URL

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Success "Frontend started at http://localhost:$FRONTEND_PORT"

Write-Host ""
Write-Info "========================================="
Write-Info "  Staging Environment Ready!"
Write-Info "========================================="
Write-Info ""
Write-Info "Frontend: http://localhost:$FRONTEND_PORT"
Write-Info "Backend:  $PYTHON_BACKEND_URL"
Write-Info ""
Write-Info "Press Ctrl+C to stop all services"
Write-Info "========================================="