'use client';

import { ApolloProvider } from "@apollo/client/react";
import { getClient } from './apollo-client';

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = getClient();
  
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
