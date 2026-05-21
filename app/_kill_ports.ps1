$ports = @(8001, 3001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $procId = $conn.OwningProcess
        Write-Host "Killing process $procId on port $port"
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "Done killing processes"