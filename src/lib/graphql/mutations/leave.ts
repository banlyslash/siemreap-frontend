import { gql } from '@apollo/client';

export const CREATE_LEAVE_REQUEST_MUTATION = gql`
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
      }
      startDate
      endDate
      halfDay
      reason
      status
      createdAt
    }
  }
`;

export const UPDATE_LEAVE_REQUEST_MUTATION = gql`
  mutation UpdateLeaveRequest($id: ID!, $input: UpdateLeaveRequestInput!) {
    updateLeaveRequest(id: $id, input: $input) {
      id
      leaveType {
        id
        name
      }
      startDate
      endDate
      halfDay
      reason
      updatedAt
    }
  }
`;

export const APPROVE_LEAVE_REQUEST_MUTATION = gql`
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
      updatedAt
    }
  }
`;

export const REJECT_LEAVE_REQUEST_MUTATION = gql`
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
      updatedAt
    }
  }
`;

export const CANCEL_LEAVE_REQUEST_MUTATION = gql`
  mutation CancelLeaveRequest($id: ID!) {
    cancelLeaveRequest(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const CREATE_LEAVE_TYPE_MUTATION = gql`
  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
    createLeaveType(input: $input) {
      id
      name
      description
      color
      active
    }
  }
`;

export const UPDATE_LEAVE_TYPE_MUTATION = gql`
  mutation UpdateLeaveType($id: ID!, $input: UpdateLeaveTypeInput!) {
    updateLeaveType(id: $id, input: $input) {
      id
      name
      description
      color
      active
    }
  }
`;

export const UPDATE_LEAVE_BALANCE_MUTATION = gql`
  mutation UpdateLeaveBalance($id: ID!, $input: UpdateLeaveBalanceInput!) {
    updateLeaveBalance(id: $id, input: $input) {
      id
      entitled
      taken
      remaining
      updatedAt
    }
  }
`;

export const INITIALIZE_LEAVE_BALANCE_MUTATION = gql`
  mutation InitializeLeaveBalance($input: InitializeLeaveBalanceInput!) {
    initializeLeaveBalance(input: $input) {
      success
      message
      balances {
        id
        leaveType {
          id
          name
          color
        }
        allocated
        used
        remaining
        year
      }
    }
  }
`;
