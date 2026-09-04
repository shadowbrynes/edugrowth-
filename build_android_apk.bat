@echo off
title ExcelMind Android APK / AAB Build Generator
echo ==============================================================================
echo   ExcelMind Academic Companion - Android APK & Bundle Builder
echo ==============================================================================
echo.

echo [Step 1/3] Compiling web application production assets...
call npm.cmd run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Web build failed. Aborting.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [Step 2/3] Checking Capacitor / Android tools...
where npx >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npx is not found on PATH.
    pause
    exit /b 1
)

echo Syncing web build to Android native project...
call npx.cmd cap sync android 2>nul
if %ERRORLEVEL% neq 0 (
    echo Initializing Capacitor Android project...
    call npx.cmd cap add android
    call npx.cmd cap sync android
)

echo.
echo [Step 3/3] Building Release APK and App Bundle (.aab)...
echo To build your signed APK / AAB using Android Studio:
echo   1. Run: npx cap open android
echo   2. In Android Studio: Build -> Generate Signed Bundle / APK
echo   3. Select Android App Bundle (.aab) for Google Play Store upload.
echo.
echo [SUCCESS] Android assets prepared successfully in 'android/' directory!
pause
