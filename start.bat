@echo off
echo Starting HoneyChain Preview Server at http://localhost:3000/ ...
start http://localhost:3000/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
