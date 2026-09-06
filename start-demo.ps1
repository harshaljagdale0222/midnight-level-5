Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd backend && npm run dev" -NoNewWindow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev" -NoNewWindow
Write-Host "Starting PrivacyGuard Insurance..."
Write-Host "Backend running on http://localhost:3001"
Write-Host "Frontend running on http://localhost:3000"
