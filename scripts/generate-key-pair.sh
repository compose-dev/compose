#!/bin/bash

# Function to format key for .env file
format_key() {
    awk 'NR==1{printf "%s\\n", $0; next} {printf "%s\\n", $0}' | tr -d '\n'
}

# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Format keys for .env file
private_key=$(cat private_key.pem | format_key)
public_key=$(cat public_key.pem | format_key)

# Output formatted keys
echo "Copy the following into your .env file:"
echo
echo "JWT_PRIVATE_KEY=\"$private_key\""
echo
echo "JWT_PUBLIC_KEY=\"$public_key\""

# Clean up key files
rm private_key.pem public_key.pem

echo
echo "Key files have been removed for security. Make sure to save the keys in your .env file."