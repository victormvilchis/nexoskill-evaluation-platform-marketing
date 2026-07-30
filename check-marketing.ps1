param(
    [switch]$Quiet,
    [switch]$AllowOccupiedPorts
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

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

Import-DotEnv (Join-Path $PSScriptRoot '.env')
Import-DotEnv (Join-Path $PSScriptRoot '.env.local')

foreach ($command in @('node', 'npm', 'java', 'mvn')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        $errors.Add("$command no está instalado o no está disponible en PATH.")
    }
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = (& node --version).TrimStart('v').Split('.')[0]
    if ([int]$nodeVersion -lt 22) { $errors.Add('Node.js 22 o superior es obligatorio.') }
}

if (Get-Command java -ErrorAction SilentlyContinue) {
    # java -version escribe en stderr. Ejecutarlo mediante cmd evita que
    # PowerShell lo convierta en NativeCommandError cuando ErrorActionPreference=Stop.
    $javaOutput = (
        & cmd.exe /d /s /c "java -version 2>&1" |
        Select-Object -First 1
    ) -join ''
    if ($javaOutput -notmatch 'version "21\.') { $errors.Add("Java 21 es obligatorio. Detectado: $javaOutput") }
}

if (-not $env:DB_URL) { $warnings.Add('DB_URL aún no está configurada; el script de inicio la solicitará.') }
elseif ($env:DB_URL -notmatch '^jdbc:oracle:thin:@//(?<host>[^:/]+):(?<port>\d+)/(?<service>[^\s]+)$') {
    $errors.Add('DB_URL debe usar el formato jdbc:oracle:thin:@//host:puerto/servicio.')
} else {
    $oracleHost = $Matches.host
    $oraclePort = [int]$Matches.port
    try {
        $connection = Test-NetConnection -ComputerName $oracleHost -Port $oraclePort -WarningAction SilentlyContinue
        if (-not $connection.TcpTestSucceeded) { $errors.Add("Oracle no responde en ${oracleHost}:${oraclePort}.") }
    } catch {
        $warnings.Add("No fue posible comprobar Oracle: $($_.Exception.Message)")
    }
}

if ($env:DB_USERNAME -and $env:DB_USERNAME.ToUpperInvariant() -in @('SYSTEM', 'SYS')) {
    $warnings.Add('Se está usando SYSTEM/SYS. Utiliza EVALUATION_APP u otro usuario aplicativo.')
}

foreach ($required in @('VITE_SITE_URL', 'VITE_API_URL')) {
    if (-not [Environment]::GetEnvironmentVariable($required, 'Process')) {
        $errors.Add("Falta $required en .env.")
    }
}

foreach ($port in @(5174, 8081)) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
        $process = Get-CimInstance Win32_Process -Filter "ProcessId = $($connection.OwningProcess)" -ErrorAction SilentlyContinue
        $description = if ($process) { "$($process.Name) PID $($process.ProcessId)" } else { "PID $($connection.OwningProcess)" }
        if (-not $AllowOccupiedPorts) { $warnings.Add("El puerto $port está ocupado por $description.") }
    }
}

if (-not $Quiet) {
    Write-Host ''
    Write-Host 'Diagnóstico Valtieris Marketing' -ForegroundColor Cyan
    foreach ($warning in $warnings) { Write-Host "WARN: $warning" -ForegroundColor Yellow }
    foreach ($error in $errors) { Write-Host "ERROR: $error" -ForegroundColor Red }
    if ($errors.Count -eq 0) { Write-Host 'Diagnóstico completado sin errores bloqueantes.' -ForegroundColor Green }
    Write-Host ''
}

if ($errors.Count -gt 0) { exit 1 }
exit 0
