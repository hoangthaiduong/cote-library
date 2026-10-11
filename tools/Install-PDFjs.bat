@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-PDFjs.ps1"
if errorlevel 1 (
  echo.
  echo PDF.js setup failed. Review the error above and check your internet connection.
  pause
  exit /b 1
)
echo.
echo PDF.js setup complete. You may now close this window.
pause
