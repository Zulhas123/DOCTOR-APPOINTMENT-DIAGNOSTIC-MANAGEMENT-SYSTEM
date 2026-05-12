Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Starting static server on http://localhost:5173 ..."
python -m http.server 5173

