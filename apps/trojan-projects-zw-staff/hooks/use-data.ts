import { useState, useEffect, useCallback, useRef } from "react";
import { create } from "zustand";

// ============================================
// Simple Data Store for optimistic updates
// ============================================
interface DataStore {
  data: Record<string, unknown>;
  setData: <T>(key: string, value: T) => void;
  getData: <T>(key: string) => T | undefined;
  updateData: <T>(key: string, updater: (prev: T | undefined) => T) => void;
  invalidate: (key: string) => void;
  subscriptions: Record<string, Set<() => void>>;
  subscribe: (key: string, callback: () => void) => () => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: {},
  subscriptions: {},
  
  setData: <T>(key: string, value: T) => {
    set((state) => ({
      data: { ...state.data, [key]: value },
    }));
    // Notify subscribers
    const subs = get().subscriptions[key];
    if (subs) {
      subs.forEach((cb) => cb());
    }
  },
  
  getData: <T>(key: string): T | undefined => {
    return get().data[key] as T | undefined;
  },
  
  updateData: <T>(key: string, updater: (prev: T | undefined) => T) => {
    const current = get().data[key] as T | undefined;
    const updated = updater(current);
    set((state) => ({
      data: { ...state.data, [key]: updated },
    }));
    // Notify subscribers
    const subs = get().subscriptions[key];
    if (subs) {
      subs.forEach((cb) => cb());
    }
  },
  
  invalidate: (key: string) => {
    set((state) => {
      const newData = { ...state.data };
      delete newData[key];
      return { data: newData };
    });
  },
  
  subscribe: (key: string, callback: () => void) => {
    set((state) => {
      const subs = state.subscriptions[key] || new Set();
      subs.add(callback);
      return {
        subscriptions: { ...state.subscriptions, [key]: subs },
      };
    });
    return () => {
      set((state) => {
        const subs = state.subscriptions[key];
        if (subs) {
          subs.delete(callback);
        }
        return { subscriptions: { ...state.subscriptions } };
      });
    };
  },
}));

export interface UseDataOptions<T> {
  initialData?: T;
  enabled?: boolean;
  cacheKey?: string;
}

export interface UseDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * A simple data fetching hook for React Native
 * Provides loading states, error handling, and refetch capability
 */
export function useData<T>(
  fetchFn: () => Promise<T>,
  options: UseDataOptions<T> = {}
): UseDataResult<T> {
  const { initialData, enabled = true } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Options for mutations with optimistic updates
 */
export interface MutationOptions<TData, TVariables, TContext = unknown> {
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables, context: TContext | undefined) => void;
}

/**
 * A hook for mutating data with loading and error states
 * Supports optimistic updates via onMutate callback
 */
export function useMutation<TData, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TVariables, TContext>
) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const contextRef = useRef<TContext | undefined>(undefined);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      setIsSuccess(false);
      contextRef.current = undefined;

      try {
        // Optimistic update callback
        if (options?.onMutate) {
          contextRef.current = await options.onMutate(variables);
        }

        const result = await mutationFn(variables);
        setData(result);
        setIsSuccess(true);
        
        // Success callback
        options?.onSuccess?.(result, variables, contextRef.current);
        options?.onSettled?.(result, null, variables, contextRef.current);
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An error occurred");
        setIsError(true);
        setError(error);
        
        // Error callback - allows rollback of optimistic updates
        options?.onError?.(error, variables, contextRef.current);
        options?.onSettled?.(undefined, error, variables, contextRef.current);
        
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    mutate,
    mutateAsync: mutate,
    data,
    isLoading,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
    reset,
  };
}
