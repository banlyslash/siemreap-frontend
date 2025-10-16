#!/bin/bash

# Script to apply all GraphQL integration changes

echo "Applying GraphQL integration changes..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql" > .env
  echo ".env file created."
else
  echo "Updating .env file..."
  grep -q "NEXT_PUBLIC_GRAPHQL_API_URL" .env || echo "NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql" >> .env
  echo ".env file updated."
fi

# Replace schema types
echo "Replacing schema types..."
cp src/lib/graphql/types/schema.updated.ts src/lib/graphql/types/schema.ts

# Replace GraphQL queries and mutations
echo "Replacing GraphQL queries and mutations..."
cp src/lib/graphql/queries/user.updated.ts src/lib/graphql/queries/user.ts
cp src/lib/graphql/queries/leave.updated.ts src/lib/graphql/queries/leave.ts
cp src/lib/graphql/mutations/auth.updated.ts src/lib/graphql/mutations/auth.ts
cp src/lib/graphql/mutations/leave.updated.ts src/lib/graphql/mutations/leave.ts

# Replace Apollo Client configuration
echo "Replacing Apollo Client configuration..."
cp src/lib/graphql/apollo-client.updated.ts src/lib/graphql/apollo-client.ts

# Replace Auth Context
echo "Replacing Auth Context..."
cp src/lib/auth/AuthContextServer.tsx src/lib/auth/AuthContext.tsx

# Replace Leave Service
echo "Replacing Leave Service..."
cp src/lib/leave/leaveService.updated.ts src/lib/leave/leaveService.ts

# Replace root layout
echo "Replacing root layout..."
cp src/app/layout.with-apollo.tsx src/app/layout.tsx

echo "All GraphQL integration changes have been applied."
echo "Please restart your development server to apply the changes."
