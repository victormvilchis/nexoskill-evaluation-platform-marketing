$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$logsRoot = Join-Path $PSScriptRoot 'logs'
New-Item -ItemType Directory -Force -Path $logsRoot | Out-Null

Write-Host ''
Write-Host 'Valtieris Marketing Frontend: http://localhost:5174' -ForegroundColor Green
Write-Host "Log: $logsRoot\frontend.log"
Write-Host ''

npm run dev -- --host 127.0.0.1 2>&1 |
    Tee-Object -FilePath (Join-Path $logsRoot 'frontend.log')
exit $LASTEXITCODE
