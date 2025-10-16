# Banking Microservices Development Stop Script (PowerShell)
Write-Host "Stopping Banking Microservices Development Environment..." -ForegroundColor Red

# Stop Spring Boot processes
Write-Host "Stopping Spring Boot applications..." -ForegroundColor Yellow

# Get all Java processes related to our services
$springBootProcesses = Get-Process | Where-Object { 
    $_.ProcessName -eq "java" -and 
    ($_.CommandLine -like "*spring-boot:run*" -or 
     $_.CommandLine -like "*eureka-server*" -or 
     $_.CommandLine -like "*gateway*" -or 
     $_.CommandLine -like "*auth-service*" -or 
     $_.CommandLine -like "*admin-service*" -or 
     $_.CommandLine -like "*customer-service*" -or 
     $_.CommandLine -like "*account-service*" -or 
     $_.CommandLine -like "*credit-service*" -or 
     $_.CommandLine -like "*payment-service*" -or 
     $_.CommandLine -like "*notification-service*")
}

if ($springBootProcesses) {
    Write-Host "Found $($springBootProcesses.Count) Spring Boot processes to stop" -ForegroundColor Yellow
    
    foreach ($process in $springBootProcesses) {
        try {
            Write-Host "Stopping process $($process.Id) - $($process.ProcessName)" -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
        }
        catch {
            Write-Host "Could not stop process $($process.Id): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No Spring Boot processes found" -ForegroundColor Yellow
}

# Alternative: Kill by port (if processes are still running)
Write-Host "Checking for processes on common ports..." -ForegroundColor Yellow

$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087)
foreach ($port in $ports) {
    $processOnPort = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($processOnPort) {
        $processId = $processOnPort.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping process $processId on port $port" -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
        }
    }
}

Write-Host "All services stopped!" -ForegroundColor Green
