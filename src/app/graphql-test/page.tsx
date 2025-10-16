import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with localStorage
const GraphQLTest = dynamic(
  () => import('@/components/GraphQLTest'),
  { ssr: false }
);

export default function GraphQLTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GraphQLTest />
    </div>
  );
}
