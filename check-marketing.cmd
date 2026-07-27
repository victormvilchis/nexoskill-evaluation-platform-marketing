@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0check-marketing.ps1"
exit /b %errorlevel%
