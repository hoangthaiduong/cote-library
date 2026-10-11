@echo off
setlocal
cd /d "%~dp0"
echo COTE LIBRARY local server
where py >nul 2>nul
if not errorlevel 1 (
  echo Open http://localhost:8000/ in your browser. Press Ctrl+C to stop.
  py -m http.server 8000
  goto end
)
where python >nul 2>nul
if not errorlevel 1 (
  echo Open http://localhost:8000/ in your browser. Press Ctrl+C to stop.
  python -m http.server 8000
  goto end
)
echo Python 3 was not found. Install Python or use the VS Code Live Server extension.
pause
:end
endlocal
