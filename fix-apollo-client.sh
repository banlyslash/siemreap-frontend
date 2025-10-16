#!/bin/bash

# Script to fix Apollo Client

echo "Fixing Apollo Client..."

# Replace apollo-client.ts with the new version
cp src/lib/graphql/apollo-client.new.ts src/lib/graphql/apollo-client.ts

# Remove the temporary file
rm src/lib/graphql/apollo-client.new.ts

echo "Apollo Client has been fixed."
echo "Please restart your development server to apply the changes."
