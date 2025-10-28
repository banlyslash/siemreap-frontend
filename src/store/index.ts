/**
 * Zustand store utilities and exports
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Creates a Zustand store with devtools and optional persistence
 * 
 * @param name The name of the store (for devtools)
 * @param initialState The initial state of the store
 * @param options Additional options for the store
 * @returns A Zustand store
 */
export function createStore<T extends object>(
  name: string,
  initialState: T,
  options: {
    persist?: boolean;
    persistKey?: string;
    persistVersion?: number;
  } = {}
) {
  const { persist: shouldPersist = false, persistKey, persistVersion = 1 } = options;
  
  let middleware: any = devtools;
  
  // Add persistence middleware if requested
  if (shouldPersist) {
    middleware = (config: any) => 
      persist(devtools(config), {
        name: persistKey || `siemreap-${name}`,
        version: persistVersion,
      });
  }
  
  return create<T>()(middleware((set: any) => ({
    ...initialState,
    set: (fn: (state: T) => Partial<T>) => set(fn),
  })));
}

// Re-export Zustand for convenience
export { create } from 'zustand';
export { persist, devtools } from 'zustand/middleware';
