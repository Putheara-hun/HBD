@echo off
title 13 November - Birthday Website
echo ============================================================
echo   13 November - Another Chapter of My Life
echo   Starting local server at http://localhost:8080 ...
echo ============================================================
start "" http://localhost:8080
python -m http.server 8080
pause
