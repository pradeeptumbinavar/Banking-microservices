# Copy JWT keys from auth-service to other services for development
Write-Host "Copying JWT public key to all services..." -ForegroundColor Green

$authKeysDir = "services\auth-service\src\main\resources\keys"
$publicKey = "$authKeysDir\public_key.pem"

# Check if auth-service keys exist
if (-not (Test-Path $publicKey)) {
    Write-Host "Public key not found. Please start auth-service at least once to generate keys." -ForegroundColor Red
    exit 1
}

# List of services that need the public key
$services = @(
    "services\customer-service",
    "services\account-service",
    "services\credit-service",
    "services\payment-service",
    "services\notification-service",
    "services\admin-service"
)

# Copy public key to each service
foreach ($service in $services) {
    $keysDir = "$service\src\main\resources\keys"
    New-Item -ItemType Directory -Force -Path $keysDir | Out-Null
    Copy-Item $publicKey -Destination $keysDir -Force
    Write-Host "  ✓ Copied to $service" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "All keys copied successfully!" -ForegroundColor Green

