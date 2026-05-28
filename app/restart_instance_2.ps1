# Restart second app instance
# Delegates to separate stop and start scripts

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Err { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Info "========================================="
Write-Info "  Restarting Instance 2"
Write-Info "========================================="

$SCRIPT_DIR = $PSScriptRoot
$stopScript = Join-Path $SCRIPT_DIR "stop_instance_2.ps1"
$startScript = Join-Path $SCRIPT_DIR "start_instance_2.ps1"

if (-not (Test-Path $stopScript)) {
    Write-Err "Missing stop script: $stopScript"
    exit 1
}
if (-not (Test-Path $startScript)) {
    Write-Err "Missing start script: $startScript"
    exit 1
}

Write-Host ""
Write-Info "Step 1: Stopping services..."
& $stopScript
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
    Write-Err "Stop script failed (exit code: $LASTEXITCODE)"
    exit 1
}

Write-Host ""
Write-Info "Step 2: Starting services..."
& $startScript

Write-Host ""
Write-Success "Restart complete."
Write-Info "========================================="