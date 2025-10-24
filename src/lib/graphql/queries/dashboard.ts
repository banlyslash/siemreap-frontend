import { gql } from '@apollo/client';

export const GET_LEAVE_STATISTICS = gql`
  query LeaveStatistics {
    leaveStatistics {
      pendingApprovals
      totalEmployees
      onLeaveToday
      leaveReports {
        count
      }
    }
  }
`;

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

export const GET_EMPLOYEES_ON_LEAVE_TODAY = gql`
  query GetEmployeesOnLeaveToday {
    employeesOnLeaveToday {
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
    }
  }
`;
