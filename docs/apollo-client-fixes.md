# Apollo Client Integration Fixes

This document explains the fixes applied to the Apollo Client integration in the Siemreap Frontend application.

## Issues Fixed

1. **Apollo Client Import Path**
   - The Apollo Client hooks (`useQuery`, `useMutation`) were being imported from the wrong path.
   - **Fixed by**: Importing from `@apollo/client/react` instead of `@apollo/client`.

2. **TypeScript Type Errors**
   - TypeScript was reporting errors for implicit `any` types in the request parameters.
   - **Fixed by**: Adding explicit type annotations for the request parameters.

## Files Modified

The following files were updated with the fixes:

1. **HR Dashboard Page**
   - `/src/app/dashboard/hr/page.tsx`
   - `/src/app/dashboard/hr/page-with-api.tsx`

2. **Leave Request Components**
   - `/src/components/leave/LeaveHistoryTableWithAPI.tsx`
   - `/src/components/leave/LeaveRequestFormWithAPI.tsx`
   - `/src/components/leave/LeaveBalanceCardWithAPI.tsx`

## Implementation Details

### 1. Apollo Client Import Path

In Next.js applications using Apollo Client, the hooks need to be imported from the correct path to avoid runtime errors:

```typescript
// Incorrect
import { useQuery, useMutation } from "@apollo/client";

// Correct
import { useQuery, useMutation } from "@apollo/client/react";
```

### 2. TypeScript Type Annotations

Added explicit type annotations for request parameters to avoid TypeScript errors:

```typescript
// Before
pendingApprovals.slice(0, 3).map((request) => {
  // ...
});

// After
pendingApprovals.slice(0, 3).map((request: any) => {
  // ...
});
```

## Future Improvements

For a more robust solution, consider:

1. **Creating proper TypeScript interfaces** for the GraphQL response data instead of using `any`.

2. **Using GraphQL code generation tools** like `@graphql-codegen/typescript` to automatically generate TypeScript types from your GraphQL schema.

3. **Setting up proper ESLint rules** to catch these issues during development.

## How to Apply the Fixes

The fixes have been applied using the script:

```bash
./scripts/fix-apollo-imports-all.sh
```

This script replaces the problematic files with fixed versions.
