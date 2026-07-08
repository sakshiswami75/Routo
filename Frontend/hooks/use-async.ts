"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAsync<T>(loader: () => Promise<T>) {
  const loaderRef = useRef(loader);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loaderRef.current());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return { data, error, isLoading, refetch: run };
}
