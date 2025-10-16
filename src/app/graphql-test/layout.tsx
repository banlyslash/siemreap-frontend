'use client';

import ApolloProvider from '@/lib/graphql/ApolloProvider';

export default function GraphQLTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider>
      {children}
    </ApolloProvider>
  );
}
