'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  karmaPoints: number;
  itemsReunited: number;
  badge: string;
  rank: number;
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const redeemKarma = useCallback(async (perkTitle: string, cost: number) => {
    const res = await fetch('/api/users/me/karma', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perkTitle, cost }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to redeem karma');
    }

    const result = await res.json();
    setUser((prev) =>
      prev ? { ...prev, karmaPoints: result.remainingKarma } : null
    );
    return result;
  }, []);

  return { user, loading, error, refetch: fetchUser, redeemKarma };
}
