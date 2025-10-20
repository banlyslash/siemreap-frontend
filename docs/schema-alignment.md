# GraphQL Schema Alignment

This document outlines the necessary changes to align our frontend implementation with the actual GraphQL schema.

## Major Differences

### 1. Entity Structure

#### LeaveRequest
- **Schema**: Uses `user: User!` instead of `employee`
- **Schema**: Uses `leaveType: LeaveType!` as an object reference instead of a string enum
- **Schema**: Has a single `halfDay: Boolean!` instead of separate `halfDayStart` and `halfDayEnd`
- **Schema**: Different approach to approvals with `manager/hr` objects instead of `managerApproval/hrApproval`
- **Schema**: Different status enum values:
  - `pending`
  - `manager_approved`
  - `manager_rejected`
  - `hr_approved`
  - `hr_rejected`
  - `cancelled`

#### LeaveBalance
- **Schema**: Individual balance entries per leave type, not a nested object
- **Schema**: Has `allocated`, `used`, and `remaining` fields directly
- **Schema**: Each balance is tied to a specific leave type via `leaveType: LeaveType!`

### 2. Query/Mutation Differences

#### Queries
- **Schema**: `leaveBalances(userId: ID, year: Int): [LeaveBalance!]!` returns an array of balances
- **Schema**: Uses `pendingApprovals` instead of separate HR/manager approval queries
- **Schema**: Uses filters on `leaveRequests` query instead of separate employee-specific query

#### Mutations
- **Schema**: Uses specific approval actions:
  - `approveLeaveRequest(id: ID!, comment: String): LeaveRequest!`
  - `rejectLeaveRequest(id: ID!, comment: String!): LeaveRequest!`
  - `cancelLeaveRequest(id: ID!): LeaveRequest!`

## Implementation Changes Required

### 1. Update Type Definitions

- Create new type definitions that match the schema structure
- Update enums to match the schema values
- Adjust interfaces for all entities

### 2. Update GraphQL Queries

- Rewrite queries to match the schema structure
- Replace separate approval queries with `pendingApprovals`
- Update mutation calls to use the correct mutation names and parameters

### 3. Component Updates

- Update components to handle the new data structure
- Adjust leave balance display to handle multiple balance entries
- Update approval workflows to use the new mutation names

## Migration Plan

1. Create schema-aligned versions of all files
2. Update components to work with the new structure
3. Test with the actual API
4. Replace the old implementation with the new one

## Files Created

- `/src/lib/leave/schema-aligned/types.ts`
- `/src/lib/leave/schema-aligned/graphqlTypes.ts`
- `/src/lib/leave/schema-aligned/leaveQueries.ts`
- `/src/lib/auth/types-updated.ts`
