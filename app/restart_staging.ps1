# Kill processes on staging ports - kill all PIDs per port
$ports = @(3001, 8001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $procId = $conn.OwningProcess
            if ($procId -gt 0) {
                Write-Host "Killing process $procId on port $port"
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Wait for ports to fully release - loop with retries
$maxRetries = 5
for ($i = 0; $i -lt $maxRetries; $i++) {
    Start-Sleep -Seconds 2
    $stillInUse = $false
    foreach ($port in $ports) {
        $check = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($check) {
            $stillInUse = $true
            # Kill any remaining processes
            foreach ($conn in $check) {
                $procId = $conn.OwningProcess
                if ($procId -gt 0) {
                    Write-Host "Retrying kill process $procId on port $port"
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                }
            }
        }
    }
    if (-not $stillInUse) { break }
    Write-Host "Port still in use, retrying... ($($i+1)/$maxRetries)"
}

Start-Sleep -Seconds 3

# Start staging server
& "$PSScriptRoot\start_staging.ps1"
