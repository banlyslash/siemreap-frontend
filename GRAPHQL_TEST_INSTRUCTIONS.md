# GraphQL Integration Testing Instructions

This document provides instructions for testing the GraphQL integration with the server at http://localhost:4000/graphql.

## Prerequisites

1. Ensure the GraphQL server is running at http://localhost:4000/graphql
2. Make sure you have valid login credentials for the server

## Testing Steps

### 1. Run the Test Page

Start the Next.js development server:

```bash
npm run dev
```

Then navigate to: http://localhost:3000/graphql-test

### 2. Test Authentication

1. Enter your email and password in the login form
2. Click "Login"
3. If successful, you'll see your authentication token and user ID
4. You can click "Logout" to clear the token and test again

### 3. Test Data Fetching

After logging in, you can test various GraphQL queries:

1. **Current User**: Click the "Current User" tab to fetch your user data using the ME query
2. **All Users**: Click the "All Users" tab to fetch all users from the server
3. **Leave Types**: Click the "Leave Types" tab to fetch all leave types

Each tab has a "Refresh" button to re-fetch the data.

### 4. Inspect Network Requests

1. Open your browser's developer tools (F12 or right-click > Inspect)
2. Go to the Network tab
3. Filter by "Fetch/XHR" requests
4. Look for requests to the GraphQL endpoint
5. Inspect the request headers to verify the authentication token is being sent
6. Inspect the request payload to see the GraphQL queries
7. Inspect the response to see the data returned from the server

### 5. Apply Full Integration

If all tests pass, you can apply the full integration by running:

```bash
./apply-graphql-integration.sh
```

This script will:
1. Update your .env file with the GraphQL server URL
2. Replace the schema types with the server-compatible versions
3. Replace the GraphQL queries and mutations
4. Replace the Apollo Client configuration
5. Replace the Auth Context
6. Replace the Leave Service

After running the script, restart your development server and test the full application.

## Troubleshooting

If you encounter issues:

1. **Authentication Errors**: Check that your credentials are correct and that the server is running
2. **Schema Mismatch**: Compare the GraphQL queries in the Network tab with the server schema
3. **CORS Issues**: Check that the server allows requests from your frontend domain
4. **Token Issues**: Verify that the token is being stored in localStorage and sent in the Authorization header
