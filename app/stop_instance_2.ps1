# Stop instance 2 services
# Kills processes on ports 8002 (backend) and 3002 (frontend)

$BACKEND_PORT = 8002
$FRONTEND_PORT = 3002

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Err { Write-Host "[ERROR] $args" -ForegroundColor Red }

function Stop-PortProcess {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if (-not $connections) {
        Write-Info "Port $Port is already free"
        return $true
    }

    $pids = $connections | ForEach-Object { $_.OwningProcess } | Sort-Object -Unique
    foreach ($procId in $pids) {
        if ($procId -gt 0) {
            Write-Info "Killing process $procId on port $Port"
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }

    # Wait for port to be released with retries
    $maxRetries = 5
    for ($i = 1; $i -le $maxRetries; $i++) {
        Start-Sleep -Seconds 2
        $check = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if (-not $check) {
            Write-Success "Port $Port is now free"
            return $true
        }
        foreach ($conn in $check) {
            $procId = $conn.OwningProcess
            if ($procId -gt 0) {
                Write-Warning "Retrying kill process $procId on port $Port ($i/$maxRetries)"
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
    }

    # Final check
    $finalCheck = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($finalCheck) {
        Write-Err "Failed to free port $Port after $maxRetries retries"
        return $false
    }

    Write-Success "Port $Port is now free"
    return $true
}

Write-Info "========================================="
Write-Info "  Stopping Instance 2"
Write-Info "========================================="

$backendOk = Stop-PortProcess -Port $BACKEND_PORT
$frontendOk = Stop-PortProcess -Port $FRONTEND_PORT

Start-Sleep -Seconds 1

Write-Host ""
if ($backendOk -and $frontendOk) {
    Write-Success "All instance 2 services stopped successfully"
} else {
    Write-Err "Some services could not be stopped cleanly"
    if (-not $backendOk) { Write-Err "  Backend port $BACKEND_PORT still in use" }
    if (-not $frontendOk) { Write-Err "  Frontend port $FRONTEND_PORT still in use" }
}
Write-Info "========================================="