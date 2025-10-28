/**
 * Common types for Zustand stores
 */

// Generic state slice interface with set function
export interface StateSlice<T> {
  set: (fn: (state: T) => Partial<T>) => void;
}
