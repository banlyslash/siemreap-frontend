'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './client';

interface GraphQLProviderProps {
  children: React.ReactNode;
}

export default function GraphQLProvider({ children }: GraphQLProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
