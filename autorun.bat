@echo off
title Vercengen Testbed
echo [Vercengen Testbed] Auto-run is starting ..
:main
npm start
timeout /t 30
echo [Vercengen Testbed] Crashed! Restarting ..
goto main
