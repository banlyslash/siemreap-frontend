# Leave Approval Feature Requirements

## Overview
The Leave Approval feature enables a structured workflow for reviewing, approving, or rejecting leave requests through a defined chain of approvers.

## User Stories
- As a manager, I want to review leave requests from my team members so that I can approve or reject them
- As a manager, I want to see team availability when reviewing requests so that I can maintain adequate coverage
- As an HR administrator, I want to provide final approval on leave requests so that policies are enforced
- As an employee, I want to track the status of my leave request so that I know when it's approved

## Requirements

### Functional Requirements
1. **Approval Workflow**
   - Two-step approval process (Manager → HR)
   - Queue of pending requests for approvers
   - Ability to approve or reject with mandatory comments for rejections
   - Delegation of approval authority during approver absence

2. **Approval Dashboard**
   - List view of pending requests requiring action
   - Detailed view of individual requests with all relevant information
   - Team calendar view showing existing approved leaves
   - Batch approval option for multiple similar requests

3. **Status Tracking**
   - Real-time status updates visible to all parties
   - Status history with timestamps and approver information
   - Email notifications at each approval stage
   - Status categories: Pending, Manager Approved, Manager Rejected, HR Approved, HR Rejected, Cancelled

### Non-Functional Requirements
1. **Performance**
   - Dashboard loading time under 2 seconds
   - Approval/rejection action processing within 1 second

2. **Security**
   - Role-based access to approval functions
   - Audit logging of all approval actions with user information
   - Prevention of self-approval for own requests

3. **Usability**
   - Clear visual indicators of request status
   - Mobile-responsive approval screens
   - Intuitive approval/rejection buttons with confirmation
   - Keyboard shortcuts for common actions

## Technical Specifications
- Workflow engine for approval routing
- GraphQL API endpoints for approval actions
- WebSocket or polling for real-time status updates
- Audit trail database for all approval actions

## Dependencies
- Authentication and role management system
- Email notification system
- Leave request data
- Team structure data for routing to correct managers

## Limitations and Constraints
- No custom approval workflows in MVP (fixed two-step process)
- No automatic approvals after timeout in MVP
- No integration with external calendar systems in MVP

## API Integration

### GraphQL Schema Integration

#### Queries

1. **Fetch Pending Approvals (for Managers)**
```graphql
query GetPendingApprovals {
  pendingApprovals {
    id
    user {
      id
      firstName
      lastName
      email
    }
    leaveType {
      id
      name
      color
    }
    startDate
    endDate
    halfDay
    reason
    status
    createdAt
  }
}
```

2. **Fetch Manager-Approved Requests (for HR)**
```graphql
query GetManagerApprovedRequests {
  managerApprovedRequests {
    id
    user {
      id
      firstName
      lastName
      email
    }
    leaveType {
      id
      name
      color
    }
    startDate
    endDate
    halfDay
    reason
    status
    manager {
      id
      firstName
      lastName
    }
    managerComment
    managerActionAt
    createdAt
  }
}
```

3. **Fetch Individual Leave Request Details**
```graphql
query GetLeaveRequest($id: ID!) {
  leaveRequest(id: $id) {
    id
    user {
      id
      firstName
      lastName
      email
    }
    leaveType {
      id
      name
      color
    }
    startDate
    endDate
    halfDay
    reason
    status
    manager {
      id
      firstName
      lastName
    }
    managerComment
    managerActionAt
    hr {
      id
      firstName
      lastName
    }
    hrComment
    hrActionAt
    createdAt
    updatedAt
  }
}
```

#### Mutations

1. **Approve Leave Request (Manager or HR)**
```graphql
mutation ApproveLeaveRequest($id: ID!, $comment: String) {
  approveLeaveRequest(id: $id, comment: $comment) {
    id
    status
    manager {
      id
      firstName
      lastName
    }
    managerComment
    managerActionAt
    hr {
      id
      firstName
      lastName
    }
    hrComment
    hrActionAt
    updatedAt
  }
}
```

2. **Reject Leave Request (Manager or HR)**
```graphql
mutation RejectLeaveRequest($id: ID!, $comment: String!) {
  rejectLeaveRequest(id: $id, comment: $comment) {
    id
    status
    manager {
      id
      firstName
      lastName
    }
    managerComment
    managerActionAt
    hr {
      id
      firstName
      lastName
    }
    hrComment
    hrActionAt
    updatedAt
  }
}
```

### API Implementation Guidelines

1. **Authentication and Authorization**
   - All API requests must include a valid JWT token in the Authorization header
   - Role-based access control must be enforced on the server side
   - Managers can only approve/reject requests for their direct reports
   - HR can only approve/reject requests that have been approved by managers

2. **Error Handling**
   - Proper error codes and messages for common scenarios:
     - Request not found
     - Unauthorized access
     - Invalid state transitions
     - Validation errors

3. **Optimistic UI Updates**
   - Implement optimistic updates in the UI for better user experience
   - Handle rollback scenarios if server requests fail

4. **Caching Strategy**
   - Cache pending approvals and manager-approved requests with appropriate invalidation
   - Use Apollo Client cache policies for efficient data management

## Success Criteria
- Average time from request submission to final approval under 24 hours
- 100% of requests properly routed to correct approvers
- Zero instances of improper approvals (e.g., self-approval)
- API response time for approval actions under 500ms
