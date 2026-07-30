param(
    [switch]$Silent,
    [switch]$ForcePorts
)

$projectRoot = (Resolve-Path $PSScriptRoot).Path
$runtimeRoot = Join-Path $projectRoot '.runtime'
$ports = @(5174, 8081)
$stopped = @()
$skipped = @()
$stale = @()

function Get-ProcessInfo([int]$ProcessId) {
    if (-not $ProcessId) { return $null }
    return Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
}

function Test-ProcessBelongsToProject([int]$ProcessId) {
    $currentId = $ProcessId
    $visited = @{}

    for ($depth = 0; $depth -lt 8 -and $currentId; $depth++) {
        if ($visited.ContainsKey($currentId)) { break }
        $visited[$currentId] = $true

        $process = Get-ProcessInfo -ProcessId $currentId
        if (-not $process) { return $false }

        if ($process.CommandLine -and (
            $process.CommandLine.IndexOf($projectRoot, [StringComparison]::OrdinalIgnoreCase) -ge 0
        )) {
            return $true
        }

        $currentId = [int]$process.ParentProcessId
    }

    return $false
}

function Stop-ProjectProcess([int]$ProcessId, [string]$Source) {
    if (-not $ProcessId -or $ProcessId -eq $PID) { return }

    $process = Get-ProcessInfo -ProcessId $ProcessId
    if (-not $process) {
        $script:stale += "$Source/PID $ProcessId"
        return
    }

    $belongsToProject = Test-ProcessBelongsToProject -ProcessId $ProcessId
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
        $content = (Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue).Trim()

        if ([int]::TryParse($content, [ref]$savedPid)) {
            Stop-ProjectProcess -ProcessId $savedPid -Source $_.BaseName
        } else {
            $script:stale += "$($_.BaseName)/PID inválido"
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
    if ($stopped.Count) {
        Write-Host "Procesos detenidos: $($stopped -join ', ')" -ForegroundColor Green
    } else {
        Write-Host 'No había procesos propios de marketing activos.'
    }

    if ($stale.Count) {
        Write-Host "Registros PID obsoletos eliminados: $($stale -join ', ')" -ForegroundColor DarkGray
    }

    if ($skipped.Count) {
        Write-Host "No se detuvieron procesos ajenos: $($skipped -join ', ')" -ForegroundColor Yellow
        Write-Host 'Usa -ForcePorts únicamente si confirmas que esos procesos pueden finalizarse.' -ForegroundColor Yellow
    }
}
