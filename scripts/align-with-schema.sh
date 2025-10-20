#!/bin/bash

# Script to update GraphQL schema and types to align with the actual API schema

echo "Aligning with actual GraphQL schema..."

# Create directories if they don't exist
mkdir -p src/lib/leave/schema-aligned

# Copy schema-aligned files to their destinations
echo "Copying schema-aligned files..."
cp -f src/lib/leave/schema-aligned/types.ts src/lib/leave/types.ts
cp -f src/lib/leave/schema-aligned/graphqlTypes.ts src/lib/leave/graphqlTypes.ts
cp -f src/lib/leave/schema-aligned/leaveQueries.ts src/lib/leave/leaveQueries.ts
cp -f src/lib/auth/types-updated.ts src/lib/auth/types.ts

echo "Schema alignment complete!"
echo "Note: You will need to update components to work with the new structure."
