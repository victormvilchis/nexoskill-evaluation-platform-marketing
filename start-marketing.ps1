$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

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

function Read-PlainSecureString([string]$Prompt) {
    $secure = Read-Host $Prompt -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
}

function Write-LocalEnvironment([hashtable]$Values) {
    $path = Join-Path $PSScriptRoot '.env.local'
    $current = [ordered]@{}
    if (Test-Path $path) {
        Get-Content $path | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
                $parts = $line.Split('=', 2)
                $current[$parts[0].Trim()] = $parts[1]
            }
        }
    }
    foreach ($entry in $Values.GetEnumerator()) { $current[$entry.Key] = $entry.Value }
    $lines = @('# Configuración local. Este archivo está excluido de Git.')
    foreach ($entry in $current.GetEnumerator()) { $lines += "$($entry.Key)=$($entry.Value)" }
    Set-Content -Path $path -Value $lines -Encoding UTF8
}

if (-not (Test-Path '.env')) {
    Copy-Item '.env.example' '.env'
}

Import-DotEnv (Join-Path $PSScriptRoot '.env')
Import-DotEnv (Join-Path $PSScriptRoot '.env.local')

if (-not $env:DB_URL) {
    $dbUrl = Read-Host 'URL JDBC de Oracle [jdbc:oracle:thin:@//localhost:1521/XEPDB1]'
    if (-not $dbUrl) { $dbUrl = 'jdbc:oracle:thin:@//localhost:1521/XEPDB1' }
} else { $dbUrl = $env:DB_URL }

if (-not $env:DB_USERNAME) { $dbUsername = Read-Host 'Usuario/esquema Oracle para marketing' }
else { $dbUsername = $env:DB_USERNAME }

if (-not $dbUsername) {
    Write-Host 'ERROR: Debes indicar un usuario Oracle.' -ForegroundColor Red
    exit 1
}

if (-not $env:DB_PASSWORD) { $dbPassword = Read-PlainSecureString 'Contraseña Oracle' }
else { $dbPassword = $env:DB_PASSWORD }

if (-not $dbPassword) {
    Write-Host 'ERROR: Debes indicar la contraseña Oracle.' -ForegroundColor Red
    exit 1
}

$ipSalt = if ($env:IP_HASH_SALT) { $env:IP_HASH_SALT } else { [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N') }
Write-LocalEnvironment @{
    DB_URL = $dbUrl
    DB_USERNAME = $dbUsername
    DB_PASSWORD = $dbPassword
    IP_HASH_SALT = $ipSalt
}
Import-DotEnv (Join-Path $PSScriptRoot '.env.local')

foreach ($command in @('node', 'npm', 'java', 'mvn')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: $command no está instalado o no está disponible en PATH." -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del frontend...'
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (Test-Path 'node_modules/.vite') {
    Remove-Item 'node_modules/.vite' -Recurse -Force
}

& (Join-Path $PSScriptRoot 'stop-marketing.ps1') -Silent

$backendScript = Join-Path $PSScriptRoot 'backend\start-backend.ps1'
$backendArguments = "-NoProfile -ExecutionPolicy Bypass -File `"$backendScript`""
$backendProcess = Start-Process powershell -ArgumentList $backendArguments -PassThru

Write-Host 'Iniciando API de marketing...' -ForegroundColor Yellow
$backendReady = $false
for ($attempt = 1; $attempt -le 240; $attempt++) {
    Start-Sleep -Seconds 1
    try {
        $health = Invoke-RestMethod -Uri 'http://localhost:8081/actuator/health' -TimeoutSec 2
        if ($health.status -eq 'UP') { $backendReady = $true; break }
    } catch { }
    if ($backendProcess.HasExited) { break }
}

if (-not $backendReady) {
    Write-Host 'ERROR: La API no pudo iniciar. Revisa la ventana del backend para consultar el error de Oracle o Maven.' -ForegroundColor Red
    if (-not $backendProcess.HasExited) { taskkill /PID $backendProcess.Id /T /F | Out-Null }
    exit 1
}

Write-Host ''
Write-Host 'NexoSkill Marketing: http://localhost:5174/' -ForegroundColor Green
Write-Host 'API de solicitudes: http://localhost:8081/actuator/health' -ForegroundColor Green
Write-Host 'Plataforma administrativa: http://localhost:5173/evaluaciones/admin/students'
Write-Host ''
Write-Host 'Para detener frontend y backend, presiona Ctrl+C.' -ForegroundColor Yellow
Write-Host ''

try {
    npm run dev
    exit $LASTEXITCODE
} finally {
    if ($backendProcess -and -not $backendProcess.HasExited) {
        taskkill /PID $backendProcess.Id /T /F | Out-Null
    }
}
