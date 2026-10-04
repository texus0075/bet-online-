@echo off
echo ===================================================
echo   CricStrike VIP - 3-Way Auto Sync (AI Studio ^<--^> GitHub ^<--^> Antigravity)
echo ===================================================

echo [1/3] Fetching and pulling latest changes from GitHub (Google AI Studio updates)...
git pull origin main --rebase

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Pull conflict detected. Please resolve conflicts or contact assistant.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Checking local changes...
git status -s

echo [3/3] Pushing local changes to GitHub (so AI Studio receives updates)...
git push origin main

echo ===================================================
echo   Sync Completed Successfully! All 3 nodes are in sync.
echo ===================================================
pause
