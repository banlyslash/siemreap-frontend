import { gql } from '@apollo/client';

export const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments {
    departments {
      id
      name
      description
      managerId
    }
  }
`;

export const GET_DEPARTMENT_QUERY = gql`
  query GetDepartment($id: ID!) {
    department(id: $id) {
      id
      name
      description
      managerId
    }
  }
`;
