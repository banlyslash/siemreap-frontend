import { gql } from '@apollo/client';

// User queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

// Leave type queries
export const GET_LEAVE_TYPES = gql`
  query GetLeaveTypes {
    leaveTypes {
      id
      name
      description
      color
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAVE_TYPE = gql`
  query GetLeaveType($id: ID!) {
    leaveType(id: $id) {
      id
      name
      description
      color
      active
      createdAt
      updatedAt
    }
  }
`;

// Leave request queries
export const GET_LEAVE_REQUESTS = gql`
  query GetLeaveRequests($userId: ID, $status: LeaveRequestStatus, $startDate: DateTime, $endDate: DateTime) {
    leaveRequests(userId: $userId, status: $status, startDate: $startDate, endDate: $endDate) {
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
`;

export const GET_LEAVE_REQUEST = gql`
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
`;

// Team queries
export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($managerId: ID!) {
    teamMembers(managerId: $managerId) {
      id
      firstName
      lastName
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_TEAM_ON_LEAVE_TODAY = gql`
  query GetTeamOnLeaveToday($managerId: ID!) {
    teamOnLeaveToday(managerId: $managerId) {
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
      status
    }
  }
`;

// Leave approval queries
export const GET_PENDING_APPROVALS = gql`
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
      updatedAt
    }
  }
`;

export const GET_MANAGER_APPROVED_REQUESTS = gql`
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
      updatedAt
    }
  }
`;

// Leave balance queries
export const GET_LEAVE_BALANCES = gql`
  query GetLeaveBalances($userId: ID, $year: Int) {
    leaveBalances(userId: $userId, year: $year) {
      id
      user {
        id
        firstName
        lastName
      }
      leaveType {
        id
        name
        color
      }
      year
      allocated
      used
      pending
      remaining
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAVE_BALANCE = gql`
  query GetLeaveBalance($id: ID!) {
    leaveBalance(id: $id) {
      id
      user {
        id
        firstName
        lastName
      }
      leaveType {
        id
        name
        color
      }
      year
      allocated
      used
      pending
      remaining
      createdAt
      updatedAt
    }
  }
`;

// Holiday queries
export const GET_HOLIDAYS = gql`
  query GetHolidays($year: Int) {
    holidays(year: $year) {
      id
      name
      date
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_HOLIDAY = gql`
  query GetHoliday($id: ID!) {
    holiday(id: $id) {
      id
      name
      date
      description
      createdAt
      updatedAt
    }
  }
`;

// Auth mutations
export const LOGIN_MUTATION = gql`
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
`;

// User mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      role
      updatedAt
    }
  }
`;

// Leave request mutations
export const CREATE_LEAVE_REQUEST = gql`
  mutation CreateLeaveRequest($input: CreateLeaveRequestInput!) {
    createLeaveRequest(input: $input) {
      id
      user {
        id
        firstName
        lastName
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
      updatedAt
    }
  }
`;

export const UPDATE_LEAVE_REQUEST = gql`
  mutation UpdateLeaveRequest($id: ID!, $input: UpdateLeaveRequestInput!) {
    updateLeaveRequest(id: $id, input: $input) {
      id
      startDate
      endDate
      halfDay
      reason
      status
      updatedAt
    }
  }
`;

export const APPROVE_LEAVE_REQUEST = gql`
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
`;

export const REJECT_LEAVE_REQUEST = gql`
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
`;

export const CANCEL_LEAVE_REQUEST = gql`
  mutation CancelLeaveRequest($id: ID!) {
    cancelLeaveRequest(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// Leave type mutations
export const CREATE_LEAVE_TYPE = gql`
  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
    createLeaveType(input: $input) {
      id
      name
      description
      color
      active
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LEAVE_TYPE = gql`
  mutation UpdateLeaveType($id: ID!, $input: UpdateLeaveTypeInput!) {
    updateLeaveType(id: $id, input: $input) {
      id
      name
      description
      color
      active
      updatedAt
    }
  }
`;

// Leave balance mutations
export const UPDATE_LEAVE_BALANCE = gql`
  mutation UpdateLeaveBalance($id: ID!, $input: UpdateLeaveBalanceInput!) {
    updateLeaveBalance(id: $id, input: $input) {
      id
      allocated
      used
      remaining
      updatedAt
    }
  }
`;

// Holiday mutations
export const CREATE_HOLIDAY = gql`
  mutation CreateHoliday($input: CreateHolidayInput!) {
    createHoliday(input: $input) {
      id
      name
      date
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_HOLIDAY = gql`
  mutation UpdateHoliday($id: ID!, $input: UpdateHolidayInput!) {
    updateHoliday(id: $id, input: $input) {
      id
      name
      date
      description
      updatedAt
    }
  }
`;

export const DELETE_HOLIDAY = gql`
  mutation DeleteHoliday($id: ID!) {
    deleteHoliday(id: $id)
  }
`;

// New queries from updated schema
export const GET_USER_LEAVE_BALANCES = gql`
  query GetUserLeaveBalances($userId: ID!, $year: Int) {
    userLeaveBalances(userId: $userId, year: $year) {
      userId
      year
      balances {
        id
        leaveType {
          id
          name
          color
        }
        year
        allocated
        used
        pending
        remaining
      }
    }
  }
`;

export const GET_LEAVE_STATISTICS = gql`
  query GetLeaveStatistics {
    leaveStatistics {
      pendingApprovals
      totalEmployees
      onLeaveToday
      leaveReports {
        leaveType {
          id
          name
          color
        }
        count
        percentage
      }
    }
  }
`;

export const GET_HR_PENDING_APPROVALS = gql`
  query GetHrPendingApprovals {
    hrPendingApprovals {
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
      updatedAt
    }
  }
`;

// New mutations from updated schema
export const MANAGER_APPROVE_LEAVE_REQUEST = gql`
  mutation ManagerApproveLeaveRequest($id: ID!, $comment: String) {
    managerApproveLeaveRequest(id: $id, comment: $comment) {
      id
      status
      manager {
        id
        firstName
        lastName
      }
      managerComment
      managerActionAt
      updatedAt
    }
  }
`;

export const MANAGER_REJECT_LEAVE_REQUEST = gql`
  mutation ManagerRejectLeaveRequest($id: ID!, $comment: String!) {
    managerRejectLeaveRequest(id: $id, comment: $comment) {
      id
      status
      manager {
        id
        firstName
        lastName
      }
      managerComment
      managerActionAt
      updatedAt
    }
  }
`;

export const HR_APPROVE_LEAVE_REQUEST = gql`
  mutation HrApproveLeaveRequest($id: ID!, $comment: String) {
    hrApproveLeaveRequest(id: $id, comment: $comment) {
      id
      status
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
`;

export const HR_REJECT_LEAVE_REQUEST = gql`
  mutation HrRejectLeaveRequest($id: ID!, $comment: String!) {
    hrRejectLeaveRequest(id: $id, comment: $comment) {
      id
      status
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
`;

export const INITIALIZE_LEAVE_BALANCE = gql`
  mutation InitializeLeaveBalance($input: InitializeLeaveBalanceInput!) {
    initializeLeaveBalance(input: $input) {
      success
      message
      balances {
        id
        leaveType {
          id
          name
        }
        year
        allocated
        used
        pending
        remaining
      }
    }
  }
`;

export const CREATE_LEAVE_BATCH = gql`
  mutation CreateLeaveBatch($input: CreateLeaveBatchInput!) {
    createLeaveBatch(input: $input) {
      success
      message
      leaveRequests {
        id
        startDate
        endDate
        halfDay
        status
      }
      numberOfDays
      remainingBalance
    }
  }
`;
