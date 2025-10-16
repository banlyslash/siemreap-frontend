# TypeScript Fixes for GraphQL Integration

This document explains the TypeScript errors that were fixed in the GraphQL integration.

## Issues and Fixes

### 1. Apollo Client Import Issues

**Problem**: Incorrect imports from `@apollo/client`
```typescript
import { ApolloProvider } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
```

**Fix**: Use the correct import paths
```typescript
import { ApolloProvider } from '@apollo/client/react';
import { useMutation, useQuery } from '@apollo/client/react';
```

### 2. Implicit Any Types

**Problem**: TypeScript errors for implicit `any` types in callbacks
```typescript
onCompleted: (data) => { /* ... */ }
onError: (error) => { /* ... */ }
```

**Fix**: Add proper type definitions
```typescript
interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION, {
  onCompleted: (data) => { /* ... */ }
});
```

### 3. Accessing Properties on Unknown Types

**Problem**: TypeScript errors when accessing properties on data objects
```typescript
return data.leaveRequests;
```

**Fix**: Add proper type definitions for query responses
```typescript
interface LeaveRequestsResponse {
  leaveRequests: Array<{
    id: string;
    [key: string]: any;
  }>;
}

const { data } = await client.query<LeaveRequestsResponse>({
  query: GET_LEAVE_REQUESTS_QUERY
});
return data.leaveRequests;
```

### 4. Incorrect FetchPolicy Types

**Problem**: TypeScript errors with fetch policy values
```typescript
fetchPolicy: 'cache-and-network'
```

**Fix**: Use correct fetch policy values from Apollo Client
```typescript
fetchPolicy: 'network-only'
// or
fetchPolicy: 'cache-first'
```

### 5. Optional Chaining for Nullable Data

**Problem**: TypeScript errors when accessing properties that might be undefined
```typescript
{meData && (
  <div>{meData.me.name}</div>
)}
```

**Fix**: Use optional chaining to safely access properties
```typescript
{meData?.me && (
  <div>{meData.me.name}</div>
)}
```

### 6. Apollo Client Configuration Options

**Problem**: Incorrect option name in Apollo Client configuration
```typescript
connectToDevTools: process.env.NODE_ENV === 'development'
```

**Fix**: Use the correct option name
```typescript
devTools: process.env.NODE_ENV === 'development'
```

### 7. GraphQL Error Types

**Problem**: Incorrect access to GraphQL error properties
```typescript
onError(({ graphQLErrors, networkError }) => {
  // ...
});
```

**Fix**: Use the correct error handler structure
```typescript
onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
      );
    });
  }
  // ...
});
```

## Applied Fixes

The following files have been fixed:

1. **src/app/graphql-test/layout.tsx**
   - Fixed ApolloProvider import

2. **src/components/GraphQLTest.tsx**
   - Added proper type definitions for GraphQL responses
   - Fixed useMutation and useQuery imports
   - Added optional chaining for nullable data
   - Added type annotations for map functions

3. **src/lib/auth/AuthContextServer.tsx**
   - Added proper type definitions for GraphQL responses
   - Fixed useMutation and useQuery imports
   - Added type annotations for callbacks

4. **src/lib/graphql/apollo-client.updated.ts**
   - Fixed error handling structure
   - Changed connectToDevTools to devTools
   - Added proper type annotations

5. **src/lib/leave/leaveService.updated.ts**
   - Added proper type definitions for GraphQL responses
   - Fixed fetch policy types
   - Added optional chaining for nullable data

## How to Apply the Fixes

Run the provided script to apply all fixes:

```bash
./apply-fixes.sh
```

This script will copy all the fixed files to their respective locations.

## Additional Notes

1. **Type Safety**: The fixes add proper TypeScript type definitions, making the code more robust and helping catch errors at compile time.

2. **Apollo Client Version**: These fixes are compatible with Apollo Client 3.x. If you're using a different version, you may need to adjust the imports accordingly.

3. **Next.js Integration**: The fixes ensure compatibility with Next.js App Router by using the correct Apollo Client integration.

4. **Development Experience**: With these fixes, you'll get proper TypeScript IntelliSense and error checking when working with GraphQL operations.
