/**
 * Common types for Zustand stores
 */

// Base state interface that can be extended by specific stores
export interface BaseState {
  // Add common state properties here if needed
}

// Status type for async operations
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Generic async state interface
export interface AsyncState<T = unknown> {
  data: T | null;
  status: Status;
  error: string | null;
}

// Helper function to create initial async state
export const createInitialAsyncState = <T>(): AsyncState<T> => ({
  data: null,
  status: 'idle',
  error: null,
});

// Helper types for store slices
export type StateSelector<T, U> = (state: T) => U;
export type StateListener<T> = (state: T) => void;

// Helper type for action creators
export type ActionCreator<T, P = void> = P extends void 
  ? () => void 
  : (payload: P) => void;
