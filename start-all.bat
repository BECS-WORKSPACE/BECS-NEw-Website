@echo off
echo ========================================================
echo   Banerjee Electronics Consultancy Services (BECS) Launcher
echo ========================================================
echo.
echo Starting BECS Services...
echo.

:: 1. Start MongoDB (if not running)
echo Checking MongoDB status...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB is running.
) else (
    echo MongoDB service not started. Attempting to start MongoDB...
    net start MongoDB
)
echo.

:: 2. Seed Database (optional choice)
set /p SEED="Do you want to run the database seed script? (y/n): "
if /i "%SEED%"=="y" (
    echo Seeding database...
    cd server
    node seed.js
    cd ..
)
echo.

:: 3. Start Backend
echo Starting Backend Server on port 5000...
start "BECS Backend" cmd /k "cd server && npm run dev"
timeout /t 2 /nobreak >nul

:: 4. Start Frontend
echo Starting Main Frontend on port 5173...
start "BECS Main Frontend" cmd /k "cd client\main-website && npm run dev"

:: 5. Start Ecommerce Store
echo Starting Ecommerce Store on port 5174...
start "BECS Ecommerce Store" cmd /k "cd client\becs-store && npm run dev"

:: 6. Start Admin Panel
echo Starting Admin Control Panel on port 5175...
start "BECS Admin Panel" cmd /k "cd client\admin && npm run dev"

:: 7. Start Training Institute
echo Starting Training Institute on port 5176...
start "BECS Training Institute" cmd /k "cd client\training-institute && npm run dev"

echo.
echo ========================================================
echo   All BECS services launched in separate windows!
echo   - Backend: http://localhost:5000
echo   - Main Website: http://localhost:5173
echo   - E-commerce Store: http://localhost:5174
echo   - Admin Panel: http://localhost:5175
echo   - Training Institute: http://localhost:5176
echo ========================================================
pause
