$filesToRemove = @(
    "server.js",
    "server.ts", 
    "Dockerfile",
    "docker-compose.yml",
    "ecosystem.config.js",
    "railway.json",
    "RAILWAY_DEPLOY.md",
    "tsconfig.json",
    ".dockerignore"
)

foreach ($file in $filesToRemove) {
    $path = "D:\-\GitHub\azuretia.net\$file"
    if (Test-Path $path) {
        Remove-Item $path -Force
        Write-Host "Removed: $file"
    }
}

Write-Host "`nRemaining files:"
Get-ChildItem "D:\-\GitHub\azuretia.net" -File | Select-Object -ExpandProperty Name
