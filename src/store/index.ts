import { create, StateCreator, StoreMutatorIdentifier } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// Type for store creation options
export interface StoreOptions {
  name: string;
  persist?: boolean;
  devtools?: boolean;
}

/**
 * Helper function to create a store with common middleware
 * @param initializer The store initializer function
 * @param options Store configuration options
 * @returns A Zustand store hook
 */
export function createStore<T>(
  initializer: StateCreator<T>,
  options: StoreOptions
) {
  const { name, persist: shouldPersist = false, devtools: shouldUseDevtools = true } = options;

  type ExtendedState = T;
  let storeCreator = initializer as unknown as StateCreator<ExtendedState, [], []>;

  // Apply devtools middleware if enabled
  if (shouldUseDevtools) {
    storeCreator = devtools(storeCreator, { name }) as unknown as StateCreator<ExtendedState, [], []>;
  }

  // Apply persist middleware if enabled
  if (shouldPersist) {
    storeCreator = persist(storeCreator, {
      name: `${name}-storage`,
      storage: createJSONStorage(() => localStorage),
    }) as unknown as StateCreator<ExtendedState, [], []>;
  }

  return create<T>()(storeCreator);
}

// Export all from zustand for convenience
export * from 'zustand';
