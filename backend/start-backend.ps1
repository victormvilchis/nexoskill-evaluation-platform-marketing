$ErrorActionPreference = 'Stop'
$backendRoot = $PSScriptRoot
$projectRoot = Split-Path $backendRoot -Parent
$logsRoot = Join-Path $projectRoot 'logs'
New-Item -ItemType Directory -Force -Path $logsRoot | Out-Null

function Import-DotEnv([string]$Path) {
    if (-not (Test-Path $Path)) { return }
    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith('#') -or -not $line.Contains('=')) { return }
        $parts = $line.Split('=', 2)
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

Import-DotEnv (Join-Path $projectRoot '.env')
Import-DotEnv (Join-Path $projectRoot '.env.local')
if (-not $env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE = 'local' }

Set-Location $backendRoot
Write-Host ''
Write-Host "Valtieris Marketing API ($($env:SPRING_PROFILES_ACTIVE)): http://localhost:8081" -ForegroundColor Green
Write-Host 'Health: http://localhost:8081/actuator/health'
Write-Host "Log: $logsRoot\backend.log"
Write-Host ''

mvn spring-boot:run 2>&1 | Tee-Object -FilePath (Join-Path $logsRoot 'backend.log')
exit $LASTEXITCODE
