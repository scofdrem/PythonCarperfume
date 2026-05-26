# Start second app instance on ports 8002 (backend) and 3002 (frontend)

$BACKEND_PORT = 8002
$FRONTEND_PORT = 3002
$PYTHON_BACKEND_URL = "http://127.0.0.1:$BACKEND_PORT"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PROJECT_ROOT = $SCRIPT_DIR

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
Write-Info "  1000Aromas - Instance 2"
Write-Info "========================================="

# Pre-flight check: verify ports are available
Write-Info "Running pre-flight checks..."
if (-not (Test-PortAvailable -Port $BACKEND_PORT)) {
    Write-Err "Backend port $BACKEND_PORT is already in use. Run stop_instance_2.ps1 first."
    exit 1
}
if (-not (Test-PortAvailable -Port $FRONTEND_PORT)) {
    Write-Err "Frontend port $FRONTEND_PORT is already in use. Run stop_instance_2.ps1 first."
    exit 1
}
Write-Success "All ports available"

Write-Info "Starting Backend on port $BACKEND_PORT..."

$backendCmd = "cd '$PROJECT_ROOT\backend'; `$env:PORT='$BACKEND_PORT'; `$env:PYTHON_BACKEND_URL='$PYTHON_BACKEND_URL'; `$env:ENVIRONMENT='dev'; `$env:DEBUG='true'; `$env:DATABASE_URL='sqlite+aiosqlite:///./app_dev2.db'; python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Success "Backend started at $PYTHON_BACKEND_URL"

Start-Sleep -Seconds 5

Write-Info "Starting Frontend on port $FRONTEND_PORT..."
$frontendCmd = "cd '$PROJECT_ROOT\frontend'; `$env:VITE_PORT='$FRONTEND_PORT'; `$env:PYTHON_BACKEND_URL='$PYTHON_BACKEND_URL'; `$env:ENVIRONMENT='dev'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Success "Frontend started at http://localhost:$FRONTEND_PORT"

# Health check
Write-Info "Running health checks..."
$backendReady = $false
$frontendReady = $false
$maxAttempts = 10

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
Write-Info "  Instance 2 Ready!"
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

Write-Info "Launching Chrome..."
Start-Process "chrome.exe" -ArgumentList "http://localhost:$FRONTEND_PORT"