## Dev keys

For local development, services expect a JWT public key at `dev-keys/jwt_public_key.pem`. The non-auth services read it via the `jwt.public-key-path` property, which defaults to a Windows absolute path but can be overridden using `JWT_PUBLIC_KEY_PATH`.

Create the folder and add a placeholder file:

```bash
mkdir -p dev-keys && echo "" > dev-keys/.gitkeep
```


# Banking Microservices

A comprehensive banking microservices architecture built with Spring Boot 3.2.7 and Spring Cloud 2023.0.3.

## Architecture Overview

### Infrastructure Services
- **Eureka Server** (`:8761`) - Service discovery and registration
- **API Gateway** (`:8080`) - Spring Cloud Gateway MVC for request routing

### Business Services
- **Auth Service** (`:8081`) - JWT-based authentication with RS256
- **Customer Service** (`:8082`) - Customer management and KYC
- **Account Service** (`:8083`) - Bank account management
- **Credit Service** (`:8084`) - Loans and credit cards
- **Payment Service** (`:8085`) - Payments and transfers
- **Notification Service** (`:8086`) - Notification delivery
- **Admin Service** (`:8087`) - Approval aggregation with Feign clients

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.7**
- **Spring Cloud 2023.0.3**
- **Spring Security** with OAuth2 Resource Server
- **MySQL** for persistence
- **Eureka** for service discovery
- **OpenFeign** for inter-service communication
- **Resilience4j** for circuit breaking
- **Lombok** for boilerplate reduction
- **SpringDoc OpenAPI** for API documentation

## Prerequisites

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- (Optional) RabbitMQ for notification service

## Database Setup

Each service uses its own MySQL database. Databases are auto-created on first run:
- `banking_auth_db`
- `banking_customer_db`
- `banking_account_db`
- `banking_credit_db`
- `banking_payment_db`
- `banking_notification_db`
- `banking_admin_db`

Default credentials (configured in application.properties):
- Username: `root`
- Password: `root`

## Quick Start

### 1. Build All Services

```bash
mvn -T1C clean package -DskipTests
```

### 2. Start Development Environment

**On Windows (PowerShell):**
```powershell
.\scripts\Start-Dev.ps1
```

**On Linux/Mac:**
```bash
chmod +x scripts/*.sh
./scripts/start-dev.sh
```

### 3. Copy JWT Keys (After First Auth Service Start)

After the auth-service starts for the first time, it generates RSA keys. Copy them to other services:

**Windows:**
```powershell
.\scripts\copy-keys.ps1
```

**Linux/Mac:**
```bash
./scripts/copy-keys.sh
```

### 4. Access Services

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Auth Service Swagger**: http://localhost:8081/swagger-ui.html
- **Customer Service Swagger**: http://localhost:8082/swagger-ui.html
- **Account Service Swagger**: http://localhost:8083/swagger-ui.html
- **Credit Service Swagger**: http://localhost:8084/swagger-ui.html
- **Payment Service Swagger**: http://localhost:8085/swagger-ui.html
- **Notification Service Swagger**: http://localhost:8086/swagger-ui.html
- **Admin Service Swagger**: http://localhost:8087/swagger-ui.html

## API Endpoints

### Auth Service (`/auth`)

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login and get JWT
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate refresh token)
- `GET /auth/public-key` - Get RSA public key
- `GET /auth/me` - Get current user info
- `POST /auth/validate` - Validate JWT token

### Customer Service (`/customers`)

- `POST /customers` - Create customer profile
- `GET /customers/{id}` - Get customer by ID
- `PUT /customers/{id}` - Update customer
- `POST /customers/{id}/kyc` - Submit KYC documents
- `GET /customers/approvals` - Get pending KYC approvals
- `POST /customers/approvals/bulk` - Bulk approve/reject KYC

### Account Service (`/accounts`)

- `POST /accounts` - Create new account
- `GET /accounts/{id}` - Get account by ID
- `GET /accounts/{id}/balance` - Get account balance
- `GET /accounts/approvals` - Get pending account approvals
- `POST /accounts/approvals/bulk` - Bulk approve/reject accounts

### Credit Service (`/credits`)

- `POST /credits/loans` - Apply for loan
- `POST /credits/cards` - Apply for credit card
- `GET /credits/approvals` - Get pending credit approvals
- `POST /credits/approvals/bulk` - Bulk approve/reject applications

### Payment Service (`/payments`)

- `POST /payments/transfer` - Create fund transfer
- `GET /payments/{id}` - Get payment by ID
- `GET /payments/approvals` - Get pending payment approvals
- `POST /payments/approvals/bulk` - Bulk approve/reject payments

### Notification Service (`/notifications`)

- `POST /notifications/send` - Send notification
- `GET /notifications/{id}` - Get notification by ID

### Admin Service (`/admin`)

- `GET /admin/approvals/pending` - Get all pending approvals (aggregated)
- `POST /admin/approvals/execute` - Execute bulk approvals across services

## Security

### JWT Authentication

The system uses RS256 (RSA) JWT tokens:
1. Auth service generates and signs JWTs with a private key
2. Other services validate JWTs using the public key
3. Keys are auto-generated on first auth-service startup

### Access Control

- Public endpoints: Swagger UI, health checks, auth endpoints
- Protected endpoints: All business endpoints require valid JWT
- Role-based access: CUSTOMER and ADMIN roles supported

## Development Guidelines

### POM Conventions

✅ **DO:**
- Inherit from parent `banking-microservices:1.0.0`
- Use `relativePath>../../pom.xml</relativePath>`
- Rely on parent BOMs for version management
- Use Lombok for entities and DTOs

❌ **DON'T:**
- Use `spring-boot-starter-parent` as parent
- Specify versions for Spring Boot/Cloud dependencies
- Re-import `spring-cloud-dependencies` in children
- Write manual getters/setters

### Code Style

- **Constructor Injection**: Use `@RequiredArgsConstructor` with `final` fields
- **Lombok**: Use `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Layers**: Controller → Service → Repository
- **DTOs**: Separate request/response objects
- **Security**: OAuth2 Resource Server for JWT validation

## Testing

Run all tests:
```bash
mvn test
```

Run specific service tests:
```bash
cd services/auth-service
mvn test
```

## Stopping Services

**Windows:**
```powershell
.\scripts\Stop-Dev.ps1
```

**Linux/Mac:**
```bash
./scripts/stop-dev.sh
```

## Troubleshooting

### Service won't start
- Check if port is already in use
- Verify MySQL is running and accessible
- Check logs in the service terminal window

### JWT validation fails
- Ensure public key is copied to all services
- Restart services after copying keys
- Verify JWT is not expired (15 min default)

### Eureka registration fails
- Wait 30 seconds for Eureka to fully start
- Check `eureka.client.service-url.defaultZone` property
- Verify network connectivity to Eureka

### Database connection errors
- Verify MySQL is running
- Check database credentials in application.properties
- Ensure MySQL user has CREATE DATABASE privilege

## Project Structure

```
banking-microservices/
├── pom.xml                 # Parent POM with BOMs
├── infra/
│   ├── eureka-server/      # Service discovery
│   └── api-gateway/        # Gateway with MVC
├── services/
│   ├── auth-service/       # Authentication
│   ├── customer-service/   # Customer management
│   ├── account-service/    # Account management
│   ├── credit-service/     # Loans & credit cards
│   ├── payment-service/    # Payments & transfers
│   ├── notification-service/# Notifications
│   └── admin-service/      # Admin aggregation
└── scripts/
    ├── Start-Dev.ps1       # Windows startup
    ├── start-dev.sh        # Linux/Mac startup
    ├── Stop-Dev.ps1        # Windows shutdown
    ├── stop-dev.sh         # Linux/Mac shutdown
    ├── copy-keys.ps1       # Copy JWT keys (Windows)
    └── copy-keys.sh        # Copy JWT keys (Linux/Mac)
```

## Contributing

1. Follow the existing code conventions
2. Use Lombok consistently
3. Write tests for new features
4. Update Swagger documentation
5. Keep security best practices

## License

This is a demonstration project for educational purposes.
