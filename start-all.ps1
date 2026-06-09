Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Banerjee Electronics Consultancy Services (BECS) Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Cloud Database Connection
Write-Host "Connecting to MongoDB Atlas Cluster (Cloud Database)..." -ForegroundColor Green
Write-Host ""

# Ask to seed
$seedInput = Read-Host "Do you want to seed the database? (y/N)"
if ($seedInput -eq "y" -or $seedInput -eq "Y") {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\server"
    node seed.js
    Set-Location -Path "$PSScriptRoot"
}
Write-Host ""

# Launch processes
Write-Host "Launching services in separate terminals..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'BECS Backend'; cd server; npm run dev"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'BECS Frontend'; cd client/main-website; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'BECS Ecommerce'; cd client/becs-store; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'BECS Admin Panel'; cd client/admin; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'BECS Training Institute'; cd client/training-institute; npm run dev"

Write-Host "BECS Services Launched!" -ForegroundColor Green
Write-Host "  - Backend: http://localhost:5000"
Write-Host "  - Main Website: http://localhost:5173"
Write-Host "  - E-commerce Store: http://localhost:5174"
Write-Host "  - Admin Panel: http://localhost:5175"
Write-Host "  - Training Institute: http://localhost:5176"
Write-Host ""
Read-Host "Press Enter to exit launcher"
