#!/bin/bash

# Script to update GraphQL schema and types to match the API

echo "Updating GraphQL schema and types..."

# Replace the GraphQL queries
echo "Replacing GraphQL queries with corrected version..."
cp -f src/lib/leave/leaveQueries-corrected.ts src/lib/leave/leaveQueries.ts

# Replace the GraphQL types
echo "Replacing GraphQL types with corrected version..."
cp -f src/lib/leave/graphqlTypes-corrected.ts src/lib/leave/graphqlTypes.ts

# Replace the leave types
echo "Replacing leave types with corrected version..."
cp -f src/lib/leave/types-corrected.ts src/lib/leave/types.ts

echo "GraphQL schema and types updated successfully!"
