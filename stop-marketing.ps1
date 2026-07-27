param([switch]$Silent)
$ports = @(5174, 8081)
$stopped = @()
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($connection in $connections) {
            if ($connection.OwningProcess -and $connection.OwningProcess -ne $PID) {
                taskkill /PID $connection.OwningProcess /T /F | Out-Null
                $stopped += "$port/$($connection.OwningProcess)"
            }
        }
    } catch { }
}
if (-not $Silent) {
    if ($stopped.Count) { Write-Host "Procesos detenidos: $($stopped -join ', ')" -ForegroundColor Green }
    else { Write-Host 'No había procesos de marketing escuchando en 5174 o 8081.' }
}
