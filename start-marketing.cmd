@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-marketing.ps1"
exit /b %errorlevel%
