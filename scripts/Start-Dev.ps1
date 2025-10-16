# Banking Microservices Development Startup Script (PowerShell)
Write-Host "Starting Banking Microservices Development Environment..." -ForegroundColor Green

# Build all services first
Write-Host "Building all services..." -ForegroundColor Yellow
Set-Location $PSScriptRoot\..
mvn -T1C clean package -DskipTests

# Start Eureka Server
Write-Host "Starting Eureka Server..." -ForegroundColor Yellow
Set-Location infra/eureka-server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Wait for Eureka to start
Write-Host "Waiting for Eureka Server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Start Auth Service
Write-Host "Starting Auth Service..." -ForegroundColor Yellow
Set-Location ..\..\services\auth-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"
Start-Sleep -Seconds 20

# Start API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Yellow
Set-Location ..\..\infra\api-gateway
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"
Start-Sleep -Seconds 15

# Start Services
Write-Host "Starting Microservices..." -ForegroundColor Yellow

# Customer Service
Set-Location ..\..\services\customer-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Account Service
Set-Location ..\account-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Credit Service
Set-Location ..\credit-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Payment Service
Set-Location ..\payment-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Notification Service
Set-Location ..\notification-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Admin Service
Set-Location ..\admin-service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Auth Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Customer Service: http://localhost:8082" -ForegroundColor Cyan
Write-Host "Account Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "Credit Service: http://localhost:8084" -ForegroundColor Cyan
Write-Host "Payment Service: http://localhost:8085" -ForegroundColor Cyan
Write-Host "Notification Service: http://localhost:8086" -ForegroundColor Cyan
Write-Host "Admin Service: http://localhost:8087" -ForegroundColor Cyan
Write-Host ""
Write-Host "Development environment started successfully!" -ForegroundColor Green
Write-Host "To stop all services, run Stop-Dev.ps1" -ForegroundColor Yellow
