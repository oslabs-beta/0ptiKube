'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseFetchDataReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom React hook to fetch data from `http://localhost:3000/api/metrics/{endpoint}`
 * using Axios and an AbortController.
 *
 * @param endpoint - The endpoint under `/api/metrics`.
 *                  Example: "container/memory/percent" or "cluster/cpu/history".
 * @returns An object with { data, error, loading }.
 */
export function useData<T = unknown>(endpoint: string): UseFetchDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<T>(
          `http://localhost:3000/api/metrics/${endpoint}`,
          { signal },
        );

        setData(response.data);
      } catch (err: unknown) {
        // If the request was cancelled
        if (axios.isCancel(err)) {
          console.log('Request canceled', (err as Error).message);
        } else if (err instanceof Error) {
          // Handle normal errors
          setError(err.message);
        } else {
          // Fallback in case it's not an instance of Error
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      // Abort the Axios request if the component unmounts
      controller.abort();
    };
  }, [endpoint]);

  return { data, error, loading };
}
