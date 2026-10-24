'use client';

import { useState, useCallback } from 'react';

interface ClaimData {
  itemId: string;
  proofAnswer: string;
  handoverMethod: 'locker' | 'security';
}

interface ClaimResult {
  id: string;
  otpCode: string;
  status: string;
  item: {
    id: string;
    title: string;
    lockerNumber?: string;
  };
}

export function useClaims() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitClaim = useCallback(async (data: ClaimData): Promise<ClaimResult> => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit claim');
      }

      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const fetchMyClaims = useCallback(async () => {
    const res = await fetch('/api/claims');
    if (!res.ok) throw new Error('Failed to fetch claims');
    return res.json();
  }, []);

  return { submitClaim, fetchMyClaims, submitting, error };
}
