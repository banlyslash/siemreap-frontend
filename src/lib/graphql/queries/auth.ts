import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
      emailVerified
      avatarUrl
      role
      departmentId
      managerId
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      emailVerified
      avatarUrl
      role
      departmentId
      managerId
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers($role: UserRole, $departmentId: ID) {
    users(role: $role, departmentId: $departmentId) {
      id
      name
      email
      emailVerified
      avatarUrl
      role
      departmentId
      managerId
    }
  }
`;

export const GET_MANAGERS_QUERY = gql`
  query GetManagers {
    users(role: "manager") {
      id
      name
      email
      avatarUrl
      departmentId
    }
  }
`;
