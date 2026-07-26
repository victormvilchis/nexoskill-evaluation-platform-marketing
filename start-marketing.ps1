$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'ERROR: Node.js no está instalado o no está disponible en PATH.' -ForegroundColor Red
    Write-Host 'Instala Node.js 22.12 o superior y vuelve a ejecutar este archivo.'
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host 'ERROR: npm no está instalado o no está disponible en PATH.' -ForegroundColor Red
    exit 1
}

if (-not (Test-Path '.env')) {
    Copy-Item '.env.example' '.env'
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Instalando dependencias del sitio de marketing...'
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (Test-Path 'node_modules/.vite') {
    Remove-Item 'node_modules/.vite' -Recurse -Force
}

Write-Host ''
Write-Host 'NexoSkill Marketing: http://localhost:5174/' -ForegroundColor Green
Write-Host 'Plataforma administrativa: http://localhost:5173/evaluaciones/admin/students'
Write-Host ''
Write-Host 'El sitio de marketing utiliza el puerto 5174; la plataforma puede permanecer en 5173.' -ForegroundColor Yellow
Write-Host 'Para detenerlo, presiona Ctrl+C.'
Write-Host ''

npm run dev
exit $LASTEXITCODE
