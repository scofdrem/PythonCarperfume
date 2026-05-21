$r = Invoke-WebRequest -Uri 'http://localhost:3001' -UseBasicParsing
Write-Output $r.Content