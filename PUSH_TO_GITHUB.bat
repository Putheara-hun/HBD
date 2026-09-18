@echo off
title Push HBD Website to GitHub
color 0b
cls
echo =======================================================================
echo         PUSHING ALL ASSETS, STYLES, JS, & HTML TO GITHUB
echo =======================================================================
echo.
echo   Repository: https://github.com/Putheara-hun/HBD.git
echo   Branch:     main
echo.
echo   [+] Initializing Git environment...
set PATH=C:\Users\teara\.mingit\cmd;%PATH%
cd /d "%~dp0"

echo   [+] Checking commit status...
git status

echo.
echo   [+] Pushing 112 files (including all images, videos, audio, css, js)...
echo   [Note] If GitHub asks for a password, use your GitHub Personal Access Token (PAT).
echo.
git push -u origin main --force

echo.
echo =======================================================================
if %ERRORLEVEL% EQU 0 (
    echo   [SUCCESS] All assets and code successfully deployed to GitHub!
) else (
    echo   [INFO] Push finished with status %ERRORLEVEL%.
)
echo =======================================================================
echo.
pause
