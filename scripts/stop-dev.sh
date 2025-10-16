#!/bin/bash

# Banking Microservices Development Stop Script
echo "Stopping Banking Microservices Development Environment..."

# Read PIDs from file
if [ -f "../pids.txt" ]; then
    PIDS=$(cat ../pids.txt)
    echo "Stopping services with PIDs: $PIDS"
    
    for PID in $PIDS; do
        if kill -0 $PID 2>/dev/null; then
            echo "Stopping process $PID..."
            kill $PID
        else
            echo "Process $PID is not running"
        fi
    done
    
    # Clean up PID file
    rm ../pids.txt
    echo "PID file cleaned up"
else
    echo "No PID file found. Attempting to stop common Spring Boot processes..."
    
    # Kill Spring Boot processes
    pkill -f "spring-boot:run"
    pkill -f "eureka-server"
    pkill -f "gateway"
    pkill -f "auth-service"
    pkill -f "admin-service"
    pkill -f "customer-service"
    pkill -f "account-service"
    pkill -f "credit-service"
    pkill -f "payment-service"
    pkill -f "notification-service"
fi

echo "All services stopped!"
