# Leave Request Management API Integration

This document outlines the steps to implement the GraphQL API integration for the leave request management feature in the Siemreap Frontend application.

## Overview

The leave request management system has been integrated with the GraphQL API available at `http://localhost:4000/graphql`. The integration includes:

1. Leave request submission
2. Leave history viewing
3. Leave balance display
4. HR approval workflow

## Implementation Files

The following files have been created with API integration:

### GraphQL Queries and Mutations

- `/src/lib/leave/leaveQueries.ts` - Contains all GraphQL queries and mutations for leave management

### API-Integrated Components

- `/src/components/leave/LeaveRequestFormWithAPI.tsx` - Form for submitting leave requests
- `/src/components/leave/LeaveHistoryTableWithAPI.tsx` - Table for displaying leave history
- `/src/components/leave/LeaveBalanceCardWithAPI.tsx` - Card for displaying leave balances

### API-Integrated Pages

- `/src/app/dashboard/request-leave/page-with-api.tsx` - Request leave page
- `/src/app/dashboard/leave-history/page-with-api.tsx` - Leave history page
- `/src/app/dashboard/hr/page-with-api.tsx` - HR dashboard with approval functionality

## How to Implement

To implement the API integration, follow these steps:

1. Ensure the Apollo client is properly configured in `/src/lib/graphql/apollo-client.ts`
2. Replace the mock data implementations with the API-integrated versions:

```bash
# Replace the leave request form
mv /src/components/leave/LeaveRequestFormWithAPI.tsx /src/components/leave/LeaveRequestForm.tsx

# Replace the leave history table
mv /src/components/leave/LeaveHistoryTableWithAPI.tsx /src/components/leave/LeaveHistoryTable.tsx

# Replace the leave balance card
mv /src/components/leave/LeaveBalanceCardWithAPI.tsx /src/components/leave/LeaveBalanceCard.tsx

# Replace the request leave page
mv /src/app/dashboard/request-leave/page-with-api.tsx /src/app/dashboard/request-leave/page.tsx

# Replace the leave history page
mv /src/app/dashboard/leave-history/page-with-api.tsx /src/app/dashboard/leave-history/page.tsx

# Replace the HR dashboard page
mv /src/app/dashboard/hr/page-with-api.tsx /src/app/dashboard/hr/page.tsx
```

## GraphQL Schema

The GraphQL API expects the following input types:

### LeaveRequestInput

```graphql
input LeaveRequestInput {
  employeeId: ID!
  startDate: String!
  endDate: String!
  halfDayStart: Boolean
  halfDayEnd: Boolean
  leaveType: String!
  reason: String!
}
```

### LeaveApprovalInput

```graphql
input LeaveApprovalInput {
  requestId: ID!
  approverId: ID!
  approved: Boolean!
  comments: String
}
```

## Testing

To test the API integration:

1. Ensure the GraphQL server is running at `http://localhost:4000`
2. Log in as an employee to test leave request submission and history viewing
3. Log in as an HR user to test the approval workflow

## Error Handling

All API calls include error handling to display appropriate error messages to the user. The components will:

1. Show loading states during API calls
2. Display error messages if API calls fail
3. Update the UI appropriately after successful API calls

## Future Enhancements

Future enhancements to the API integration could include:

1. Real-time updates using GraphQL subscriptions
2. Offline support with Apollo cache persistence
3. Optimistic UI updates for better user experience
4. File upload support for leave attachments
