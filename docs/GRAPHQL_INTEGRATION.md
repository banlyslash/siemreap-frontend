# GraphQL API Integration Guide

This document provides instructions for integrating the Siem Reap Frontend application with a GraphQL API.

## Setup Overview

The application has been prepared for GraphQL integration using Apollo Client. The following components have been set up:

1. Apollo Client configuration
2. GraphQL schema types
3. GraphQL queries and mutations
4. Authentication context using GraphQL
5. Leave management service using GraphQL

## Environment Configuration

1. Create a `.env.local` file in the root directory based on the `env.sample` file:

```
NEXT_PUBLIC_GRAPHQL_API_URL=http://your-graphql-api-endpoint/graphql
```

2. Replace `http://your-graphql-api-endpoint/graphql` with your actual GraphQL API endpoint.

## Activating GraphQL Integration

To activate the GraphQL integration, follow these steps:

1. Rename `layout.with-apollo.tsx` to `layout.tsx` to replace the current layout:

```bash
mv src/app/layout.with-apollo.tsx src/app/layout.tsx
```

2. Rename `AuthContextWithGraphQL.tsx` to `AuthContext.tsx` to replace the current auth context:

```bash
mv src/lib/auth/AuthContextWithGraphQL.tsx src/lib/auth/AuthContext.tsx
```

## GraphQL API Requirements

Your GraphQL API should implement the following:

### Authentication

- `login(input: LoginInput!): AuthResponse`
- `signup(input: SignupInput!): AuthResponse`
- `logout: Boolean`
- `currentUser: User`

### User Management

- `user(id: ID!): User`
- `users(role: UserRole, departmentId: ID): [User]`

### Department Management

- `departments: [Department]`
- `department(id: ID!): Department`
- `createDepartment(input: DepartmentInput!): Department`
- `updateDepartment(id: ID!, input: DepartmentInput!): Department`
- `deleteDepartment(id: ID!): Boolean`

### Leave Management

- `employeeLeaveRequests(employeeId: ID!): [LeaveRequest]`
- `managerPendingApprovals(managerId: ID!): [LeaveRequest]`
- `hrPendingApprovals: [LeaveRequest]`
- `employeeLeaveBalance(employeeId: ID!, year: Int): LeaveBalance`
- `holidays(year: Int): [Holiday]`
- `createLeaveRequest(input: LeaveRequestInput!): LeaveRequest`
- `processManagerApproval(input: LeaveApprovalInput!): LeaveRequest`
- `processHRApproval(input: LeaveApprovalInput!): LeaveRequest`
- `cancelLeaveRequest(id: ID!): LeaveRequest`

## Testing the Integration

1. Start your GraphQL API server.
2. Start the Next.js development server:

```bash
npm run dev
```

3. Navigate to http://localhost:3000/login and attempt to log in.
4. Check the browser console for any GraphQL-related errors.

## Troubleshooting

- **Authentication Issues**: Ensure your GraphQL API is correctly handling JWT tokens and that the `authorization` header is being sent with requests.
- **CORS Issues**: Make sure your GraphQL API allows requests from your frontend domain.
- **Schema Mismatch**: Verify that your GraphQL API schema matches the types defined in `src/lib/graphql/types/schema.ts`.

## Development Workflow

When developing new features:

1. Define the GraphQL types in `src/lib/graphql/types/schema.ts`.
2. Create queries in the appropriate file under `src/lib/graphql/queries/`.
3. Create mutations in the appropriate file under `src/lib/graphql/mutations/`.
4. Create service functions to use these queries and mutations.
5. Use the service functions in your React components.

## Apollo Client Dev Tools

For debugging GraphQL operations, install the Apollo Client DevTools extension for your browser:

- [Chrome](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/)
