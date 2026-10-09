@echo off
setlocal
cd /d "%~dp0"
echo ================================================
echo       TASKFLOW - TASK MANAGEMENT APP
echo ================================================
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven is not installed or not in PATH.
  echo Install Maven 3.9+ and make sure 'mvn -v' works.
  pause
  exit /b 1
)
echo Starting TaskFlow...
mvn spring-boot:run
pause
