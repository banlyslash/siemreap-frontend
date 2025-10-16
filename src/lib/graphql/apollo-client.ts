import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Define your GraphQL API endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
});

// Error handling link
const errorLink = onError((options) => {
  // Use type assertion for the error options
  const { graphQLErrors, networkError } = options as {
    graphQLErrors?: ReadonlyArray<{
      message: string;
      locations?: ReadonlyArray<{ line: number; column: number }>;
      path?: ReadonlyArray<string | number>;
    }>;
    networkError?: Error;
  };

  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Authentication link to add auth headers to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('siemreap_auth_token') : null;
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Type policies for the cache
const typePolicies = {
  Query: {
    fields: {
      // Add field policies here if needed
    },
  },
  User: {
    keyFields: ['id'],
  },
  LeaveRequest: {
    keyFields: ['id'],
  },
  LeaveType: {
    keyFields: ['id'],
  },
  LeaveBalance: {
    keyFields: ['id'],
  },
  Holiday: {
    keyFields: ['id'],
  },
};

// Create cache
const cache = new InMemoryCache({
  typePolicies,
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  name: 'siemreap-frontend',
  version: '1.0',
});

// Export the client directly
export function getClient() {
  return client;
}
