# 1000Aromas Staging Environment Startup Script
# This script starts both frontend and backend services for local staging testing

# Configuration
$BACKEND_PORT = 8001
$FRONTEND_PORT = 3001
$PYTHON_BACKEND_URL = "http://127.0.0.1:$BACKEND_PORT"

# Colors for output
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Err { Write-Host "[ERROR] $args" -ForegroundColor Red }

function Test-PortAvailable {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return ($connections -eq $null)
}

Write-Info "========================================="
Write-Info "  1000Aromas - Staging Environment"
Write-Info "========================================="

# Pre-flight check: verify ports are available
Write-Info "Running pre-flight checks..."
if (-not (Test-PortAvailable -Port $BACKEND_PORT)) {
    Write-Err "Backend port $BACKEND_PORT is already in use. Run stop_staging.ps1 first or use restart_staging.ps1."
    exit 1
}
if (-not (Test-PortAvailable -Port $FRONTEND_PORT)) {
    Write-Err "Frontend port $FRONTEND_PORT is already in use. Run stop_staging.ps1 first or use restart_staging.ps1."
    exit 1
}
Write-Success "All ports available"

# Load environment variables from .env.staging
$envFile = Join-Path $PSScriptRoot ".env.staging"
if (Test-Path $envFile) {
    Write-Info "Loading environment from .env.staging..."
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line -split '=', 2
            if ($parts.Count -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                Set-Item -Path "env:$key" -Value $value
                Write-Info "  Set $key"
            }
        }
    }
} else {
    Write-Err "Could not find .env.staging at $envFile"
    exit 1
}

# Set additional environment variables
$env:BACKEND_PORT = $BACKEND_PORT
$env:FRONTEND_PORT = $FRONTEND_PORT
$env:PYTHON_BACKEND_URL = $PYTHON_BACKEND_URL
$env:ENVIRONMENT = "staging"
$env:IS_LAMBDA = "false"
$env:DEBUG = "true"

Write-Info "Starting Backend service on port $BACKEND_PORT..."
Write-Info "Database URL: $($env:DATABASE_URL)"

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload"

Write-Success "Backend started at $PYTHON_BACKEND_URL"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Info "Starting Frontend service on port $FRONTEND_PORT..."

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Success "Frontend started at http://localhost:$FRONTEND_PORT"

# Health check
Write-Info "Running health checks..."
$backendReady = $false
$frontendReady = $false
$maxAttempts = 10

# Check backend
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "$PYTHON_BACKEND_URL/docs" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) {
            Write-Success "Backend is ready (attempt $i/$maxAttempts)"
            $backendReady = $true
            break
        }
    } catch { }
    if ($i -lt $maxAttempts) {
        Write-Info "Waiting for backend... ($i/$maxAttempts)"
        Start-Sleep -Seconds 2
    }
}

# Check frontend
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$FRONTEND_PORT" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) {
            Write-Success "Frontend is ready (attempt $i/$maxAttempts)"
            $frontendReady = $true
            break
        }
    } catch { }
    if ($i -lt $maxAttempts) {
        Write-Info "Waiting for frontend... ($i/$maxAttempts)"
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Info "========================================="
Write-Info "  Staging Environment Status"
Write-Info "========================================="
if ($backendReady) {
    Write-Success "Backend:  $PYTHON_BACKEND_URL/docs"
} else {
    Write-Warning "Backend:  Not responding (may need more time)"
}
if ($frontendReady) {
    Write-Success "Frontend: http://localhost:$FRONTEND_PORT"
} else {
    Write-Warning "Frontend: Not responding (may need more time)"
}
Write-Info "========================================="
