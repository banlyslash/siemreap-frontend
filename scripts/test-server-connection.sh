#!/bin/bash

# Test connection to the GraphQL server
echo "Testing connection to GraphQL server at http://localhost:4000/graphql..."

# Send a simple introspection query
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "{ __schema { queryType { name } } }"}' \
  http://localhost:4000/graphql)

# Check if the response contains the expected data
if echo "$response" | grep -q "queryType"; then
  echo "✅ Connection successful!"
  echo "Server response:"
  echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
  echo "❌ Connection failed!"
  echo "Server response:"
  echo "$response"
  echo ""
  echo "Please check that:"
  echo "1. The GraphQL server is running at http://localhost:4000/graphql"
  echo "2. There are no network issues or firewall blocking the connection"
  echo "3. The server is configured to accept requests from your client"
fi
