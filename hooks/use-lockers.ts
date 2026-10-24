'use client';

import { useState, useEffect, useCallback } from 'react';
import { LockerStation } from '@/lib/campusData';

export function useLockers() {
  const [stations, setStations] = useState<LockerStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/lockers');
      if (!res.ok) throw new Error('Failed to fetch locker stations');
      const data = await res.json();
      setStations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const verifyOtp = useCallback(async (stationId: string, otp: string) => {
    const res = await fetch('/api/lockers/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationId, otp }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Invalid OTP');
    }

    return res.json();
  }, []);

  return { stations, loading, error, refetch: fetchStations, verifyOtp };
}
