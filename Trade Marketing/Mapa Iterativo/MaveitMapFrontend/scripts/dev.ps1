# scripts/dev.ps1
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -and $_.Path -like '*next*' } | ForEach-Object { Stop-Process $_.Id -Force }
cd "$PSScriptRoot/.."
$token = (Get-Content .env.local -Raw).Trim()
Write-Host "[InteractiveMap] TOKEN >" $token
npx pnpm dev