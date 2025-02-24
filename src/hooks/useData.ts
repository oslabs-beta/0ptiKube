'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

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
export function useData<T = unknown>(
  endpoint: string,
  preset?: string,
): UseFetchDataReturn<T> {
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

        // Build the final URL from .env variable
        const baseUrl =
          process.env.NEXT_PUBLIC_METRICS_API_BASE_URL ||
          'http://localhost:3000/api/metrics';

        // Add preset parameter if provided
        const url = preset
          ? `${baseUrl}/${endpoint}?preset=${preset}`
          : `${baseUrl}/${endpoint}`;

        const response = await axios.get<T>(url, {
          signal,
        });

        setData(response.data);
      } catch (err) {
        // If request was canceled
        if (axios.isCancel(err)) {
          console.log('Request canceled:', (err as Error).message);
        } else {
          // Extract the error message
          const message = err instanceof AxiosError ? err.message : String(err);
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      // Abort the Axios request if the component unmounts or dependency changes
      controller.abort();
    };
  }, [endpoint, preset]); // Added preset to dependency array

  return { data, error, loading };
}
