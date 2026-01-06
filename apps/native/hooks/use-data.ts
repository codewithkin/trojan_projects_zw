import { useState, useEffect, useCallback } from "react";

export interface UseDataOptions<T> {
  initialData?: T;
  enabled?: boolean;
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
 * A hook for mutating data with loading and error states
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      setIsSuccess(false);

      try {
        const result = await mutationFn(variables);
        setData(result);
        setIsSuccess(true);
        return result;
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("An error occurred"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
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
