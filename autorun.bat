@echo off
title Scriptly-Template/UI
echo [Scriptly-Template/UI] Auto-run is starting ..
:main
npm start
timeout /t 30
echo [Scriptly-Template/UI] Crashed! Restarting ..
goto main
