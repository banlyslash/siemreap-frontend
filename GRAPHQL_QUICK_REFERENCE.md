# GraphQL Quick Reference

## Server Endpoint
```
http://localhost:4000/graphql
```

## Authentication

### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

### Get Current User
```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    role
  }
}
```

## User Management

### Get All Users
```graphql
query GetUsers {
  users {
    id
    email
    firstName
    lastName
    role
  }
}
```

### Get User by ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    role
  }
}
```

### Create User
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    firstName
    lastName
    role
  }
}
```

### Update User
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    firstName
    lastName
    role
  }
}
```

## Leave Management

### Get Leave Requests
```graphql
query GetLeaveRequests {
  leaveRequests {
    id
    user {
      id
      firstName
      lastName
    }
    leaveType {
      id
      name
    }
    startDate
    endDate
    status
  }
}
```

### Create Leave Request
```graphql
mutation CreateLeaveRequest($input: CreateLeaveRequestInput!) {
  createLeaveRequest(input: $input) {
    id
    startDate
    endDate
    status
  }
}
```

### Approve Leave Request
```graphql
mutation ApproveLeaveRequest($id: ID!, $comment: String) {
  approveLeaveRequest(id: $id, comment: $comment) {
    id
    status
  }
}
```

### Reject Leave Request
```graphql
mutation RejectLeaveRequest($id: ID!, $comment: String!) {
  rejectLeaveRequest(id: $id, comment: $comment) {
    id
    status
  }
}
```

### Cancel Leave Request
```graphql
mutation CancelLeaveRequest($id: ID!) {
  cancelLeaveRequest(id: $id) {
    id
    status
  }
}
```

## Common React Hooks

### Login
```tsx
const [login, { loading }] = useMutation(LOGIN_MUTATION);

const handleLogin = async () => {
  try {
    const { data } = await login({
      variables: { email, password }
    });
    localStorage.setItem('siemreap_auth_token', data.login.token);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Fetch Current User
```tsx
const { data, loading, error } = useQuery(ME_QUERY);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

const user = data.me;
```

### Create Leave Request
```tsx
const [createLeaveRequest, { loading }] = useMutation(
  CREATE_LEAVE_REQUEST_MUTATION,
  {
    refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
  }
);

const handleSubmit = async (values) => {
  try {
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
  } catch (error) {
    console.error('Failed to create leave request:', error);
  }
};
```

## Type Definitions

### User Role
```typescript
export type UserRole = 'ADMIN' | 'MANAGER' | 'HR' | 'EMPLOYEE';
```

### Leave Request Status
```typescript
export type LeaveRequestStatus = 
  | 'PENDING'
  | 'MANAGER_APPROVED'
  | 'MANAGER_REJECTED'
  | 'HR_APPROVED'
  | 'HR_REJECTED'
  | 'CANCELLED';
```

## Common Error Messages

- **Authentication Error**: "Not authenticated"
- **Permission Error**: "Not authorized"
- **Not Found Error**: "Resource not found"
- **Validation Error**: "Input validation failed"
