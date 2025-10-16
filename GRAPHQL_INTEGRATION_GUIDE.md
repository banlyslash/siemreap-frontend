# GraphQL Integration Guide

This comprehensive guide explains how to integrate the Siem Reap Frontend application with the GraphQL server running at http://localhost:4000/graphql.

## Table of Contents

1. [Introduction](#introduction)
2. [Server Schema Analysis](#server-schema-analysis)
3. [Integration Architecture](#integration-architecture)
4. [Setup Instructions](#setup-instructions)
5. [Testing the Integration](#testing-the-integration)
6. [Component Updates](#component-updates)
7. [Advanced Topics](#advanced-topics)
8. [Troubleshooting](#troubleshooting)

## Introduction

This integration connects the Siem Reap Frontend application to a GraphQL API server. GraphQL provides several advantages over traditional REST APIs:

- Fetching exactly the data you need in a single request
- Strong typing for better developer experience
- Introspection for automatic documentation
- Efficient data loading with fewer network requests

## Server Schema Analysis

Based on our introspection of the GraphQL server at http://localhost:4000/graphql, we've identified the following key components:

### Authentication

- **Login**: `login(email: String!, password: String!): AuthPayload`
- **AuthPayload**: Contains a JWT token and user object

### User Management

- **User Queries**:
  - `me: User`: Get the current authenticated user
  - `users: [User]`: Get all users
  - `user(id: ID!): User`: Get a specific user by ID

- **User Mutations**:
  - `createUser(input: CreateUserInput!): User`: Create a new user
  - `updateUser(id: ID!, input: UpdateUserInput!): User`: Update an existing user

### Leave Management

- **Leave Queries**:
  - `leaveRequests: [LeaveRequest]`: Get all leave requests
  - `leaveRequest(id: ID!): LeaveRequest`: Get a specific leave request
  - `leaveTypes: [LeaveType]`: Get all leave types
  - `leaveBalances: [LeaveBalance]`: Get all leave balances
  - `holidays: [Holiday]`: Get all holidays

- **Leave Mutations**:
  - `createLeaveRequest(input: CreateLeaveRequestInput!): LeaveRequest`
  - `updateLeaveRequest(id: ID!, input: UpdateLeaveRequestInput!): LeaveRequest`
  - `approveLeaveRequest(id: ID!, comment: String): LeaveRequest`
  - `rejectLeaveRequest(id: ID!, comment: String!): LeaveRequest`
  - `cancelLeaveRequest(id: ID!): LeaveRequest`

## Integration Architecture

Our GraphQL integration follows this architecture:

1. **Apollo Client**: Core library for GraphQL data fetching
2. **Schema Types**: TypeScript interfaces matching the GraphQL schema
3. **Queries & Mutations**: GraphQL operations defined using the gql tag
4. **Service Layer**: TypeScript functions that wrap GraphQL operations
5. **React Components**: UI components that use the service layer
6. **Authentication**: JWT-based auth with token storage

### File Structure

```
src/
├── lib/
│   ├── graphql/
│   │   ├── apollo-client.ts      # Apollo Client configuration
│   │   ├── ApolloProvider.tsx    # Apollo Provider component
│   │   ├── queries/              # GraphQL queries
│   │   ├── mutations/            # GraphQL mutations
│   │   └── types/                # TypeScript types
│   ├── auth/
│   │   └── AuthContext.tsx       # Authentication context
│   └── leave/
│       └── leaveService.ts       # Leave management service
└── app/
    └── layout.tsx                # Root layout with Apollo Provider
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
```

### 2. Apply Integration Changes

Run the provided script to apply all integration changes:

```bash
./apply-graphql-integration.sh
```

This script will:
- Update your environment configuration
- Replace schema types with server-compatible versions
- Update GraphQL queries and mutations
- Update the Apollo Client configuration
- Update the Auth Context
- Update the Leave Service

### 3. Manual Integration

If you prefer to integrate manually, follow these steps:

1. Install dependencies:
   ```bash
   npm install @apollo/client graphql @apollo/client-integration-nextjs
   ```

2. Copy the updated files:
   ```bash
   cp src/lib/graphql/types/schema.updated.ts src/lib/graphql/types/schema.ts
   cp src/lib/graphql/queries/user.updated.ts src/lib/graphql/queries/user.ts
   cp src/lib/graphql/queries/leave.updated.ts src/lib/graphql/queries/leave.ts
   cp src/lib/graphql/mutations/auth.updated.ts src/lib/graphql/mutations/auth.ts
   cp src/lib/graphql/mutations/leave.updated.ts src/lib/graphql/mutations/leave.ts
   cp src/lib/graphql/apollo-client.updated.ts src/lib/graphql/apollo-client.ts
   cp src/lib/auth/AuthContextServer.tsx src/lib/auth/AuthContext.tsx
   cp src/lib/leave/leaveService.updated.ts src/lib/leave/leaveService.ts
   cp src/app/layout.with-apollo.tsx src/app/layout.tsx
   ```

## Testing the Integration

### 1. Test Server Connection

Run the provided script to test the connection to the GraphQL server:

```bash
./test-server-connection.sh
```

### 2. GraphQL Test Page

Navigate to the GraphQL test page to verify the integration:

```
http://localhost:3000/graphql-test
```

This page allows you to:
- Test authentication with the server
- Fetch and display user data
- Fetch and display leave types
- Test error handling

### 3. Apollo Client DevTools

Install the Apollo Client DevTools browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/)

This extension allows you to:
- Inspect the Apollo Client cache
- View active queries and their results
- Manually execute queries and mutations
- Monitor GraphQL network operations

## Component Updates

The following components need to be updated to work with the GraphQL server:

### 1. Login Form

Update the login form to use the GraphQL login mutation:

```tsx
const [login, { loading }] = useMutation(LOGIN_MUTATION);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { data } = await login({
      variables: { email, password }
    });
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

### 2. User Display

Update user display components to use firstName and lastName:

```tsx
// Before
<span>{user.name}</span>

// After
<span>{user.firstName} {user.lastName}</span>
```

### 3. Leave Request Form

Update leave request form to use the server schema:

```tsx
// Before
const [createLeaveRequest] = useMutation(CREATE_LEAVE_REQUEST_MUTATION);

// After
const [createLeaveRequest] = useMutation(CREATE_LEAVE_REQUEST_MUTATION);
const handleSubmit = async (values) => {
  await createLeaveRequest({
    variables: {
      input: {
        userId: currentUser.id,
        leaveTypeId: values.leaveTypeId,
        startDate: values.startDate,
        endDate: values.endDate,
        halfDay: values.halfDay,
        reason: values.reason
      }
    }
  });
};
```

## Advanced Topics

### 1. Caching Strategy

The Apollo Client cache is configured with type policies to correctly normalize and cache entities:

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
    },
    LeaveRequest: {
      keyFields: ['id'],
    },
    // Other type policies...
  },
});
```

### 2. Error Handling

GraphQL errors are handled at multiple levels:

1. **Apollo Link Level**: The errorLink logs all GraphQL and network errors
2. **Mutation Level**: onError callbacks handle mutation-specific errors
3. **Component Level**: Error states are managed in React components

### 3. Authentication Flow

1. User logs in with email and password
2. Server returns JWT token and user data
3. Token is stored in localStorage
4. Token is attached to all subsequent requests
5. ME query is used to validate token and fetch current user

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check that your credentials are correct
   - Verify that the token is being stored correctly
   - Check that the token is being sent in the Authorization header

2. **Schema Mismatch**:
   - Use introspection to verify the server schema
   - Update your queries and mutations to match the schema
   - Check for typos in field names

3. **CORS Issues**:
   - Check that the server allows requests from your frontend domain
   - Verify that preflight OPTIONS requests are handled correctly

4. **Cache Issues**:
   - Use Apollo DevTools to inspect the cache
   - Clear the cache with `client.resetStore()`
   - Check that entities are being normalized correctly

### Debugging Tips

1. Enable Apollo Client logging:
   ```typescript
   const client = new ApolloClient({
     // other options...
     connectToDevTools: true,
   });
   ```

2. Use the network tab in browser dev tools to inspect GraphQL requests

3. Add console.log statements to track the flow of data

4. Use Apollo Client's fetchPolicy options to bypass the cache during debugging:
   ```typescript
   useQuery(MY_QUERY, { fetchPolicy: 'network-only' });
   ```
