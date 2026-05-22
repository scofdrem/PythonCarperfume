# Start second app instance on ports 8002 (backend) and 3002 (frontend)

$BACKEND_PORT = 8002
$FRONTEND_PORT = 3002
$PYTHON_BACKEND_URL = "http://127.0.0.1:$BACKEND_PORT"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PROJECT_ROOT = $SCRIPT_DIR

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }

Write-Info "========================================="
Write-Info "  1000Aromas - Instance 2"
Write-Info "========================================="

Write-Info "Starting Backend on port $BACKEND_PORT..."

$backendCmd = "cd '$PROJECT_ROOT\backend'; `$env:PORT='$BACKEND_PORT'; `$env:PYTHON_BACKEND_URL='$PYTHON_BACKEND_URL'; `$env:ENVIRONMENT='dev'; `$env:DEBUG='true'; `$env:DATABASE_URL='sqlite+aiosqlite:///./app_dev2.db'; python -m uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Success "Backend started at $PYTHON_BACKEND_URL"

Start-Sleep -Seconds 5

Write-Info "Starting Frontend on port $FRONTEND_PORT..."
$frontendCmd = "cd '$PROJECT_ROOT\frontend'; `$env:VITE_PORT='$FRONTEND_PORT'; `$env:PYTHON_BACKEND_URL='$PYTHON_BACKEND_URL'; `$env:ENVIRONMENT='dev'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Success "Frontend started at http://localhost:$FRONTEND_PORT"

Write-Host ""
Write-Info "========================================="
Write-Info "  Instance 2 Ready!"
Write-Info "========================================="
Write-Info ""
Write-Info "Frontend: http://localhost:$FRONTEND_PORT"
Write-Info "Backend:  $PYTHON_BACKEND_URL"
Write-Info ""
Write-Info "Launching Chrome..."
Write-Info "========================================="

Start-Process "chrome.exe" -ArgumentList "http://localhost:$FRONTEND_PORT"