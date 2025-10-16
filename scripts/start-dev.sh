#!/bin/bash

# Banking Microservices Development Startup Script
echo "Starting Banking Microservices Development Environment..."

# Start Eureka Server
echo "Starting Eureka Server..."
cd infra/eureka-server
mvn spring-boot:run &
EUREKA_PID=$!

# Wait for Eureka to start
echo "Waiting for Eureka Server to start..."
sleep 30

# Start Gateway
echo "Starting API Gateway..."
cd ../gateway
mvn spring-boot:run &
GATEWAY_PID=$!

# Wait for Gateway to start
echo "Waiting for API Gateway to start..."
sleep 20

# Start Services
echo "Starting Microservices..."

# Auth Service
cd ../../services/auth-service
mvn spring-boot:run &
AUTH_PID=$!

# Admin Service
cd ../admin-service
mvn spring-boot:run &
ADMIN_PID=$!

# Customer Service
cd ../customer-service
mvn spring-boot:run &
CUSTOMER_PID=$!

# Account Service
cd ../account-service
mvn spring-boot:run &
ACCOUNT_PID=$!

# Credit Service
cd ../credit-service
mvn spring-boot:run &
CREDIT_PID=$!

# Payment Service
cd ../payment-service
mvn spring-boot:run &
PAYMENT_PID=$!

# Notification Service
cd ../notification-service
mvn spring-boot:run &
NOTIFICATION_PID=$!

echo "All services started!"
echo "Eureka Server PID: $EUREKA_PID"
echo "Gateway PID: $GATEWAY_PID"
echo "Auth Service PID: $AUTH_PID"
echo "Admin Service PID: $ADMIN_PID"
echo "Customer Service PID: $CUSTOMER_PID"
echo "Account Service PID: $ACCOUNT_PID"
echo "Credit Service PID: $CREDIT_PID"
echo "Payment Service PID: $PAYMENT_PID"
echo "Notification Service PID: $NOTIFICATION_PID"

# Save PIDs to file for stop script
echo "$EUREKA_PID $GATEWAY_PID $AUTH_PID $ADMIN_PID $CUSTOMER_PID $ACCOUNT_PID $CREDIT_PID $PAYMENT_PID $NOTIFICATION_PID" > ../pids.txt

echo "Development environment started successfully!"
echo "Eureka Dashboard: http://localhost:8761"
echo "API Gateway: http://localhost:8080"
