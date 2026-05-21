Write-Host "Checking backend on port 8001..."
try {
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/docs' -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend: OK (HTTP $($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Backend: FAIL ($($_.Exception.Message))" -ForegroundColor Red
}

Write-Host "Checking frontend on port 3001..."
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3001' -UseBasicParsing -TimeoutSec 5
    Write-Host "Frontend: OK (HTTP $($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Frontend: FAIL ($($_.Exception.Message))" -ForegroundColor Red
}