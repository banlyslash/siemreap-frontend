#!/bin/bash

# Script to fix uppercase roles

echo "Fixing uppercase roles..."

# Copy the fixed files
echo "Updating AuthContext.tsx..."
cp src/lib/auth/AuthContext.fixed.tsx src/lib/auth/AuthContext.tsx

echo "Updating dashboard layout..."
cp src/app/dashboard/layout.fixed.tsx src/app/dashboard/layout.tsx

# Remove the fixed files
rm src/lib/auth/AuthContext.fixed.tsx
rm src/app/dashboard/layout.fixed.tsx

echo "All role-related fixes have been applied."
echo "Please restart your development server to apply the changes."
