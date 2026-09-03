@echo off
title ExcelMind Academic Companion - MySQL API Server
echo ==============================================================================
echo   ExcelMind Academic Companion Platform - MySQL Backend API Launcher
echo ==============================================================================
echo.

echo [1/2] Checking MySQL Windows Service (MySQL80)...
net start MySQL80 >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [MySQL]: OK - MySQL80 service is active on port 3306.
) else (
    echo [MySQL]: Service already running or accessible.
)

echo.
echo [2/2] Launching Backend API Server on http://localhost:5000...
cd /d "%~dp0backend"
node server.js
pause
