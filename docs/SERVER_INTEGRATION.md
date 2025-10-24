# GraphQL Server Integration Guide

This document provides instructions for integrating the Siem Reap Frontend application with the GraphQL server running at http://localhost:4000/graphql.

## Server Schema Analysis

Based on the introspection of the GraphQL server, we've identified the following:

### Authentication

- Login mutation: `login(email: String!, password: String!): AuthPayload`
- AuthPayload returns a token and user object

### User Management

- User queries: `me`, `users`, `user(id: ID!)`
- User mutations: `createUser(input: CreateUserInput!)`, `updateUser(id: ID!, input: UpdateUserInput!)`

### Leave Management

- Leave queries: `leaveRequests`, `leaveRequest(id: ID!)`, `leaveTypes`, `leaveBalances`, `holidays`
- Leave mutations:
  - `createLeaveRequest(input: CreateLeaveRequestInput!)`
  - `updateLeaveRequest(id: ID!, input: UpdateLeaveRequestInput!)`
  - `approveLeaveRequest(id: ID!, comment: String)`
  - `rejectLeaveRequest(id: ID!, comment: String!)`
  - `cancelLeaveRequest(id: ID!)`

## Schema Differences

The server schema differs from our initial implementation in the following ways:

1. **User Structure**: Uses `firstName` and `lastName` instead of a single `name` field
2. **Leave Request Status**: Uses uppercase enum values (`PENDING`, `MANAGER_APPROVED`, etc.)
3. **Leave Request Structure**: Uses `halfDay` boolean instead of separate `halfDayStart` and `halfDayEnd`
4. **Leave Approval**: Has separate mutations for approving and rejecting requests

## Integration Steps

1. Update the environment file to point to the GraphQL server:

```
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
```

2. Replace the schema types with the updated versions:

```bash
cp src/lib/graphql/types/schema.updated.ts src/lib/graphql/types/schema.ts
```

3. Replace the GraphQL queries and mutations:

```bash
cp src/lib/graphql/queries/user.updated.ts src/lib/graphql/queries/user.ts
cp src/lib/graphql/queries/leave.updated.ts src/lib/graphql/queries/leave.ts
cp src/lib/graphql/mutations/auth.updated.ts src/lib/graphql/mutations/auth.ts
cp src/lib/graphql/mutations/leave.updated.ts src/lib/graphql/mutations/leave.ts
```

4. Replace the Apollo Client configuration:

```bash
cp src/lib/graphql/apollo-client.updated.ts src/lib/graphql/apollo-client.ts
```

5. Replace the Auth Context:

```bash
cp src/lib/auth/AuthContextServer.tsx src/lib/auth/AuthContext.tsx
```

6. Replace the Leave Service:

```bash
cp src/lib/leave/leaveService.updated.ts src/lib/leave/leaveService.ts
```

7. Update the root layout to use the Apollo Provider:

```bash
# Already done in previous steps
```

## UI Component Updates

The following UI components need to be updated to match the server schema:

1. **Login Form**: Update to use `email` and `password` directly in the login mutation
2. **User Display**: Update to use `firstName` and `lastName` instead of `name`
3. **Leave Request Form**: Update to use `halfDay` instead of `halfDayStart` and `halfDayEnd`
4. **Leave Status Display**: Update to use uppercase status values

## Testing the Integration

1. Start your GraphQL server at http://localhost:4000/graphql
2. Start the Next.js development server:

```bash
npm run dev
```

3. Navigate to http://localhost:3000/login and attempt to log in with credentials from the server.

## Troubleshooting

- **Authentication Issues**: Check that the token is being stored correctly and sent in the Authorization header
- **Schema Mismatch**: If you encounter GraphQL errors, verify that your queries and mutations match the server schema
- **Type Errors**: Check that the TypeScript types match the server schema

## Development Workflow

When developing new features:

1. Use the Apollo Client DevTools to test queries and mutations against the server
2. Update the TypeScript types if the server schema changes
3. Use the GraphQL playground at http://localhost:4000/graphql to explore the schema
