# API Integration Gaps Analysis

This document identifies potential gaps between our frontend implementation and the GraphQL schema, highlighting areas that might need attention on the backend.

## Schema Differences

### 1. Leave Request Structure

#### Current Frontend Implementation
- Uses `employee` and `employeeId` fields
- Has separate `halfDayStart` and `halfDayEnd` fields
- Uses different status enum values

#### Actual Schema
- Uses `user: User!` instead of employee
- Has a single `halfDay: Boolean!` field
- Uses different status enum values:
  ```
  enum LeaveRequestStatus {
    pending
    manager_approved
    manager_rejected
    hr_approved
    hr_rejected
    cancelled
  }
  ```

### 2. Leave Balance Structure

#### Current Frontend Implementation
- Nested object with balances per leave type in a single record
- Fields like `entitled`, `used`, `pending`, `remaining`

#### Actual Schema
- Individual balance entries per leave type
- Fields are `allocated`, `used`, `remaining`
- No `pending` field in the schema

### 3. Approval Process

#### Current Frontend Implementation
- Uses `managerApproval` and `hrApproval` objects
- Separate mutations for manager and HR approvals

#### Actual Schema
- Uses direct references to `manager` and `hr` users
- Separate fields for comments and action timestamps
- Generic `approveLeaveRequest` and `rejectLeaveRequest` mutations

## Backend Gaps to Address

1. **Leave Request Status Handling**:
   - The schema uses `manager_approved` but our frontend might expect `approved_by_manager`
   - Need to ensure consistent status values between frontend and backend

2. **Half-Day Leave Handling**:
   - Backend has a single `halfDay` field
   - Frontend expects separate `halfDayStart` and `halfDayEnd` fields
   - Need to decide on a consistent approach

3. **Leave Balance Structure**:
   - Backend returns individual balance entries per leave type
   - Frontend expects a single record with nested balances
   - Need to align the data structure or transform data

4. **Approval Process**:
   - Backend uses a generic approval system
   - Frontend might expect role-specific approval endpoints
   - Need to ensure proper role checking in approval mutations

5. **Missing Fields**:
   - `pending` field for leave balances is used in frontend but not in schema
   - Need to add this field or adjust frontend to calculate it

## Recommended Backend Changes

1. **Add Support for Half-Day Start/End**:
   - Either modify schema to support both start/end half days
   - Or document the convention (e.g., halfDay=true means start or end)

2. **Add Pending Balance Calculation**:
   - Add a computed field for pending leave in LeaveBalance type
   - Or provide a separate query to get pending leave amounts

3. **Clarify Approval Flow**:
   - Document which roles can call approveLeaveRequest/rejectLeaveRequest
   - Ensure proper role checking in these mutations

4. **Status Transition Rules**:
   - Document the valid status transitions
   - Implement validation for status changes

## Frontend Adaptation Required

1. **Update Leave Request Component**:
   - Adapt to use `user` instead of `employee`
   - Handle single `halfDay` field
   - Update status handling

2. **Update Leave Balance Display**:
   - Handle multiple balance records (one per leave type)
   - Calculate pending amounts if not provided

3. **Update Approval Workflow**:
   - Use generic approval mutations with proper role context
   - Update UI to match the backend approval flow
