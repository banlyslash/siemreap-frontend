# Zustand State Management

This project uses [Zustand](https://github.com/pmndrs/zustand) for state management. Zustand is a small, fast and scalable state-management solution using simplified flux principles.

## Store Structure

The store is organized as follows:

```
src/store/
├── index.ts           # Store utilities and exports
├── types.ts           # Common types for stores
├── authStore.ts       # Authentication store
└── README.md          # This documentation
```

## Usage

### Creating a Store

We provide a `createStore` utility function to create stores with consistent configuration:

```typescript
import { createStore } from '@/store';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = createStore<CounterState>(
  'counter', // Store name (for devtools)
  {
    count: 0,
    increment: () => useCounterStore.setState(state => ({ count: state.count + 1 })),
    decrement: () => useCounterStore.setState(state => ({ count: state.count - 1 })),
    set: (fn) => useCounterStore.setState(fn(useCounterStore.getState())),
  },
  { persist: true } // Optional persistence
);
```

### Using a Store in Components

```tsx
import { useCounterStore } from '@/store/counterStore';

function Counter() {
  const { count, increment, decrement } = useCounterStore();
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

### Store Features

Our Zustand implementation includes:

1. **TypeScript Support**: Full type safety for all stores
2. **DevTools Integration**: Redux DevTools support for debugging
3. **Persistence**: Optional localStorage persistence
4. **Middleware Support**: Easy to add middleware

## Authentication Store

The `authStore.ts` provides authentication functionality:

```typescript
import { useAuthStore } from '@/store/authStore';

// In your component
const { user, signIn, signOut, loading } = useAuthStore();

// Sign in
await signIn({ email: 'user@example.com', password: 'password' });

// Sign out
await signOut();

// Check if user is authenticated
if (user) {
  // User is authenticated
}
```

## Best Practices

1. **Keep Stores Small**: Create multiple small stores instead of one large store
2. **Separate UI and Domain State**: Use different stores for UI state and domain data
3. **Use Selectors**: For performance optimization
4. **Avoid Circular Dependencies**: Don't import stores into each other directly
5. **Test Stores**: Write tests for store logic
