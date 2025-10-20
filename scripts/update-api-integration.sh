#!/bin/bash

# Script to update API integration to match the GraphQL schema

echo "Updating API integration to match GraphQL schema..."

# Create directories if they don't exist
mkdir -p src/lib/leave/updated

# Copy updated files to their destinations
echo "Copying updated files..."
cp -f src/lib/leave/updated/types.ts src/lib/leave/types.ts
cp -f src/lib/leave/updated/graphqlTypes.ts src/lib/leave/graphqlTypes.ts
cp -f src/lib/leave/updated/leaveQueries.ts src/lib/leave/leaveQueries.ts

echo "API integration update complete!"
echo "Note: You will need to update components to work with the new structure."
echo "Please review docs/api-integration-gaps.md for potential backend changes needed."
