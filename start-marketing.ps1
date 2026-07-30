$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$runtimeRoot = Join-Path $PSScriptRoot '.runtime'
$logsRoot = Join-Path $PSScriptRoot 'logs'
New-Item -ItemType Directory -Force -Path $runtimeRoot, $logsRoot | Out-Null

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
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
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

    foreach ($entry in $Values.GetEnumerator()) {
        $current[$entry.Key] = $entry.Value
    }

    $lines = @('# Configuración local. Este archivo está excluido de Git.')
    foreach ($entry in $current.GetEnumerator()) {
        $lines += "$($entry.Key)=$($entry.Value)"
    }

    Set-Content -Path $path -Value $lines -Encoding UTF8
}

function Wait-ForBackend([System.Diagnostics.Process]$Process, [int]$TimeoutSeconds = 240) {
    for ($attempt = 1; $attempt -le $TimeoutSeconds; $attempt++) {
        Start-Sleep -Seconds 1
        try {
            $health = Invoke-RestMethod -Uri 'http://localhost:8081/actuator/health' -TimeoutSec 2
            if ($health.status -eq 'UP') { return $true }
        } catch { }

        if ($Process.HasExited) { return $false }
    }

    return $false
}

function Wait-ForFrontend([System.Diagnostics.Process]$Process, [int]$TimeoutSeconds = 120) {
    for ($attempt = 1; $attempt -le $TimeoutSeconds; $attempt++) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri 'http://localhost:5174/' -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { return $true }
        } catch { }

        if ($Process.HasExited) { return $false }
    }

    return $false
}

if (-not (Test-Path '.env')) {
    Copy-Item '.env.example' '.env'
}

Import-DotEnv (Join-Path $PSScriptRoot '.env')
Import-DotEnv (Join-Path $PSScriptRoot '.env.local')

foreach ($command in @('node', 'npm', 'java', 'mvn')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: $command no está instalado o no está disponible en PATH." -ForegroundColor Red
        exit 1
    }
}

if (-not $env:DB_URL) {
    $dbUrl = Read-Host 'URL JDBC de Oracle [jdbc:oracle:thin:@//localhost:1521/XEPDB1]'
    if (-not $dbUrl) { $dbUrl = 'jdbc:oracle:thin:@//localhost:1521/XEPDB1' }
} else {
    $dbUrl = $env:DB_URL
}

if (-not $dbUrl.StartsWith('jdbc:oracle:thin:')) {
    Write-Host 'ERROR: DB_URL debe ser una URL JDBC de Oracle que comience con jdbc:oracle:thin:' -ForegroundColor Red
    exit 1
}

if (-not $env:DB_USERNAME) {
    $dbUsername = Read-Host 'Usuario/esquema Oracle para marketing'
} else {
    $dbUsername = $env:DB_USERNAME
}

if (-not $dbUsername) {
    Write-Host 'ERROR: Debes indicar un usuario Oracle.' -ForegroundColor Red
    exit 1
}

if ($dbUsername.ToUpperInvariant() -in @('SYSTEM', 'SYS')) {
    Write-Host 'WARN: No se recomienda utilizar SYSTEM/SYS. Usa EVALUATION_APP u otro usuario aplicativo.' -ForegroundColor Yellow
}

if (-not $env:DB_PASSWORD) {
    $dbPassword = Read-PlainSecureString 'Contraseña Oracle'
} else {
    $dbPassword = $env:DB_PASSWORD
}

if (-not $dbPassword) {
    Write-Host 'ERROR: Debes indicar la contraseña Oracle.' -ForegroundColor Red
    exit 1
}

$ipSalt = if ($env:IP_HASH_SALT) {
    $env:IP_HASH_SALT
} else {
    [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
}

Write-LocalEnvironment @{
    DB_URL = $dbUrl
    DB_USERNAME = $dbUsername
    DB_PASSWORD = $dbPassword
    IP_HASH_SALT = $ipSalt
    SPRING_PROFILES_ACTIVE = 'local'
}
Import-DotEnv (Join-Path $PSScriptRoot '.env.local')

& (Join-Path $PSScriptRoot 'check-marketing.ps1') -Quiet -AllowOccupiedPorts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Detiene únicamente procesos previamente registrados por este proyecto.
& (Join-Path $PSScriptRoot 'stop-marketing.ps1') -Silent

$occupied = @(5174, 8081) | Where-Object {
    Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue
}
if ($occupied.Count) {
    Write-Host "ERROR: Los puertos $($occupied -join ', ') siguen ocupados por procesos ajenos al proyecto." -ForegroundColor Red
    Write-Host 'Ejecuta .\check-marketing.ps1 para consultar el diagnóstico.' -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del frontend...'
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (Test-Path 'node_modules/.vite') {
    Remove-Item 'node_modules/.vite' -Recurse -Force
}

$backendScript = Join-Path $PSScriptRoot 'backend\start-backend.ps1'
$frontendScript = Join-Path $PSScriptRoot 'start-frontend.ps1'
$backendPidFile = Join-Path $runtimeRoot 'marketing-backend.pid'
$frontendPidFile = Join-Path $runtimeRoot 'marketing-frontend.pid'

$backendProcess = Start-Process -FilePath 'powershell.exe' -ArgumentList @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', "`"$backendScript`""
) -PassThru -WindowStyle Hidden
Set-Content -Path $backendPidFile -Value $backendProcess.Id -Encoding ASCII

Write-Host 'Iniciando API de marketing...' -ForegroundColor Yellow
if (-not (Wait-ForBackend -Process $backendProcess)) {
    Write-Host 'ERROR: La API no pudo iniciar. Revisa logs\backend.log.' -ForegroundColor Red
    if (Test-Path (Join-Path $logsRoot 'backend.log')) {
        Write-Host 'Últimas líneas del backend:' -ForegroundColor Yellow
        Get-Content (Join-Path $logsRoot 'backend.log') -Tail 25
    }
    & (Join-Path $PSScriptRoot 'stop-marketing.ps1') -Silent
    exit 1
}

$frontendProcess = Start-Process -FilePath 'powershell.exe' -ArgumentList @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', "`"$frontendScript`""
) -PassThru -WindowStyle Hidden
Set-Content -Path $frontendPidFile -Value $frontendProcess.Id -Encoding ASCII

Write-Host 'Iniciando sitio de marketing...' -ForegroundColor Yellow
if (-not (Wait-ForFrontend -Process $frontendProcess)) {
    Write-Host 'ERROR: El frontend no pudo iniciar. Revisa logs\frontend.log.' -ForegroundColor Red
    if (Test-Path (Join-Path $logsRoot 'frontend.log')) {
        Write-Host 'Últimas líneas del frontend:' -ForegroundColor Yellow
        Get-Content (Join-Path $logsRoot 'frontend.log') -Tail 25
    }
    & (Join-Path $PSScriptRoot 'stop-marketing.ps1') -Silent
    exit 1
}

Write-Host ''
Write-Host 'Valtieris Marketing iniciado correctamente.' -ForegroundColor Green
Write-Host 'Sitio: http://localhost:5174/' -ForegroundColor Green
Write-Host 'API: http://localhost:8081/actuator/health' -ForegroundColor Green
Write-Host "PID backend: $($backendProcess.Id)" -ForegroundColor DarkGray
Write-Host "PID frontend: $($frontendProcess.Id)" -ForegroundColor DarkGray
Write-Host 'Logs: logs\backend.log y logs\frontend.log' -ForegroundColor DarkGray
Write-Host ''
Write-Host 'Para detener ambos servicios ejecuta .\stop-marketing.ps1' -ForegroundColor Yellow
