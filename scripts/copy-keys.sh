#!/bin/bash

# Copy JWT keys from auth-service to other services for development
echo "Copying JWT public key to all services..."

AUTH_KEYS_DIR="services/auth-service/src/main/resources/keys"
PUBLIC_KEY="$AUTH_KEYS_DIR/public_key.pem"

# Check if auth-service keys exist
if [ ! -f "$PUBLIC_KEY" ]; then
    echo "Public key not found. Please start auth-service at least once to generate keys."
    exit 1
fi

# List of services that need the public key
SERVICES=(
    "services/customer-service"
    "services/account-service"
    "services/credit-service"
    "services/payment-service"
    "services/notification-service"
    "services/admin-service"
)

# Copy public key to each service
for SERVICE in "${SERVICES[@]}"; do
    KEYS_DIR="$SERVICE/src/main/resources/keys"
    mkdir -p "$KEYS_DIR"
    cp "$PUBLIC_KEY" "$KEYS_DIR/"
    echo "  ✓ Copied to $SERVICE"
done

echo ""
echo "All keys copied successfully!"

