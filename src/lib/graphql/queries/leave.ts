import { gql } from '@apollo/client';

export const GET_LEAVE_REQUESTS_QUERY = gql`
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

export const GET_LEAVE_REQUEST_QUERY = gql`
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

export const GET_LEAVE_TYPES_QUERY = gql`
  query GetLeaveTypes {
    leaveTypes {
      id
      name
      description
      color
      active
    }
  }
`;

export const GET_LEAVE_BALANCES_QUERY = gql`
  query GetLeaveBalances {
    leaveBalances {
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
      year
      entitled
      taken
      remaining
    }
  }
`;

export const GET_HOLIDAYS_QUERY = gql`
  query GetHolidays {
    holidays {
      id
      name
      date
      description
      isRecurringYearly
    }
  }
`;
