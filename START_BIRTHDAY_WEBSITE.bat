@echo off
title Chhim Putheara - 24 Years Birthday Celebration
color 06
cls
echo =======================================================================
echo          CHHIM PUTHEARA - 24 YEARS OF MY STORY (13.11.2002)
echo =======================================================================
echo.
echo   [+] Launching website with Instant Startup Sound & Fireworks Hype...
echo.

set TARGET_URL="%~dp0index.html"

:: Check if Microsoft Edge exists
where msedge.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start msedge.exe --autoplay-policy=no-user-gesture-required --start-maximized "file:///%TARGET_URL:\=/%"
    goto END
)

:: Check Program Files Microsoft Edge
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --autoplay-policy=no-user-gesture-required --start-maximized "file:///%TARGET_URL:\=/%"
    goto END
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --autoplay-policy=no-user-gesture-required --start-maximized "file:///%TARGET_URL:\=/%"
    goto END
)

:: Check Google Chrome
where chrome.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start chrome.exe --autoplay-policy=no-user-gesture-required --start-maximized "file:///%TARGET_URL:\=/%"
    goto END
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required --start-maximized "file:///%TARGET_URL:\=/%"
    goto END
)

:: Fallback default browser
start "" "%TARGET_URL%"

:END
echo   [OK] Enjoy the celebration!
timeout /t 2 >nul
exit
