import { gql } from '@apollo/client';
import { User } from '../types/schema';

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

export const GET_USERS_QUERY = gql`
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

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
      leaveRequests {
        id
        startDate
        endDate
        status
      }
      leaveBalances {
        id
        leaveType {
          id
          name
        }
        year
        allocated
        used
        remaining
      }
    }
  }
`;
