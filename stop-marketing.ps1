param(
    [switch]$Silent,
    [switch]$ForcePorts
)

$projectRoot = (Resolve-Path $PSScriptRoot).Path
$runtimeRoot = Join-Path $projectRoot '.runtime'
$ports = @(5174, 8081)
$stopped = @()
$skipped = @()

function Stop-ProjectProcess([int]$ProcessId, [string]$Source) {
    if (-not $ProcessId -or $ProcessId -eq $PID) { return }
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    if (-not $process) { return }

    $belongsToProject = $process.CommandLine -and $process.CommandLine.Contains($projectRoot, [StringComparison]::OrdinalIgnoreCase)
    if ($ForcePorts -or $belongsToProject) {
        taskkill /PID $ProcessId /T /F | Out-Null
        $script:stopped += "$Source/PID $ProcessId"
    } else {
        $script:skipped += "$Source/PID $ProcessId ($($process.Name))"
    }
}

if (Test-Path $runtimeRoot) {
    Get-ChildItem $runtimeRoot -Filter '*.pid' -ErrorAction SilentlyContinue | ForEach-Object {
        $savedPid = 0
        if ([int]::TryParse((Get-Content $_.FullName -Raw).Trim(), [ref]$savedPid)) {
            Stop-ProjectProcess -ProcessId $savedPid -Source $_.BaseName
        }
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

foreach ($port in $ports) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-ProjectProcess -ProcessId $_.OwningProcess -Source "port-$port"
    }
}

if (-not $Silent) {
    if ($stopped.Count) { Write-Host "Procesos detenidos: $($stopped -join ', ')" -ForegroundColor Green }
    else { Write-Host 'No había procesos propios de marketing activos.' }
    if ($skipped.Count) {
        Write-Host "No se detuvieron procesos ajenos: $($skipped -join ', ')" -ForegroundColor Yellow
        Write-Host 'Usa -ForcePorts únicamente si confirmas que esos procesos pueden finalizarse.' -ForegroundColor Yellow
    }
}
