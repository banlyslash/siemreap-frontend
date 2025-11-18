"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { GET_HOLIDAYS } from "../leave/leaveQueries";
import { getClient } from "../graphql/apollo-client";
import { Holiday } from "../leave/types";

interface HolidayContextType {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  fetchHolidays: (targetYear?: number) => Promise<void>;
  clearHolidays: () => void;
}

interface GetHolidaysResponse {
  holidays: Holiday[];
}

const HolidayContext = createContext<HolidayContextType | undefined>(undefined);

export function HolidayProvider({ children }: { children: React.ReactNode }) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedYear, setCachedYear] = useState<number | null>(null);

  const client = getClient();

  const fetchHolidays = useCallback(async (targetYear?: number) => {
    const yearToFetch = targetYear || new Date().getFullYear();
    
    // Return cached data if available for the same year
    if (cachedYear === yearToFetch && holidays.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await client.query<GetHolidaysResponse>({
        query: GET_HOLIDAYS,
        variables: { year: yearToFetch },
        fetchPolicy: 'network-only', // Always fetch fresh data
      });

      if (data?.holidays) {
        setHolidays(data.holidays);
        setCachedYear(yearToFetch);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching holidays:', error);
      setError(error.message || 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  }, [client, cachedYear, holidays.length]);

  const clearHolidays = useCallback(() => {
    setHolidays([]);
    setCachedYear(null);
    setError(null);
  }, []);

  const value: HolidayContextType = {
    holidays,
    loading,
    error,
    fetchHolidays,
    clearHolidays,
  };

  return (
    <HolidayContext.Provider value={value}>
      {children}
    </HolidayContext.Provider>
  );
}

export function useHoliday() {
  const context = useContext(HolidayContext);
  if (context === undefined) {
    throw new Error("useHoliday must be used within a HolidayProvider");
  }
  return context;
}
