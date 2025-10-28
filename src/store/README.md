# Zustand State Management

This directory contains the Zustand state management setup for the Siemreap Frontend application.

## Overview

[Zustand](https://github.com/pmndrs/zustand) is a small, fast, and scalable state management solution for React applications. It provides a simple API based on hooks and doesn't require boilerplate code or complex setup.

## Directory Structure

```
src/store/
├── index.ts         # Core utility functions and exports
├── types.ts         # Common types for stores
├── authStore.ts     # Authentication store
└── README.md        # This documentation
```

## Usage

### Creating a New Store

To create a new store, use the `createStore` utility function:

```typescript
import { createStore } from '../store';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = createStore<CounterState>(
  (set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }),
  {
    name: 'counter-store', // Used for devtools and persistence
    persist: true,         // Enable localStorage persistence
    devtools: true,        // Enable Redux DevTools integration
  }
);
```

### Using a Store in Components

```tsx
import { useCounterStore } from '../store/counterStore';

function Counter() {
  // Select only what you need from the store
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

### Using Store Outside of React Components

You can access the store state and actions outside of React components:

```typescript
import { useCounterStore } from '../store/counterStore';

// Get current state
const count = useCounterStore.getState().count;

// Update state
useCounterStore.getState().increment();
```

### Subscribing to Store Changes

```typescript
import { useCounterStore } from '../store/counterStore';

// Subscribe to store changes
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count,
  (count) => {
    console.log('Count changed:', count);
  }
);

// Later, when you want to unsubscribe
unsubscribe();
```

## Available Stores

### Auth Store

The auth store manages user authentication state and provides methods for signing in, signing out, and loading user data.

```typescript
import { useAuthStore } from '../store/authStore';

// In a component
function LoginForm() {
  const { signIn, loading, error } = useAuthStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({
      email: 'user@example.com',
      password: 'password123'
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## Best Practices

1. **Selective Imports**: Only select the parts of the state you need in your components to prevent unnecessary re-renders.

2. **Store Organization**: Split large stores into logical slices using the slice pattern.

3. **Immutable Updates**: Always update state immutably. Zustand's `set` function helps with this by merging state.

4. **TypeScript**: Use TypeScript interfaces to define your store state and actions for better type safety.

5. **Middleware**: Use middleware like `devtools` for debugging and `persist` for state persistence when needed.

## Migrating from Context API

If you're migrating from React Context API to Zustand, follow these steps:

1. Create a new store with the same state and actions as your context
2. Replace context provider with direct store usage
3. Replace `useContext` hooks with store selectors

## Additional Resources

- [Zustand GitHub Repository](https://github.com/pmndrs/zustand)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
