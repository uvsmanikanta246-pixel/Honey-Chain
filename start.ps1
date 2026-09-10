Write-Host "Starting HoneyChain Preview Server at http://localhost:3000/ ..." -ForegroundColor DarkYellow
Start-Process "http://localhost:3000/"
& "$PSScriptRoot\server.ps1"
