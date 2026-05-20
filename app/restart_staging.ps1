# Kill processes on staging ports
$ports = @(3001, 8001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $procId = $connections[0].OwningProcess
        Write-Host "Killing process $procId on port $port"
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 3

# Start staging server
& "$PSScriptRoot\start_staging.ps1"