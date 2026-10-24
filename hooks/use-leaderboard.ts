'use client';

import { useState, useEffect, useCallback } from 'react';

interface LeaderboardUser {
  rank: number;
  name: string;
  department: string;
  itemsReunited: number;
  karmaPoints: number;
  avatar: string;
  badge: string;
}

export function useLeaderboard(userId?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const url = userId ? `/api/leaderboard?userId=${userId}` : '/api/leaderboard';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}
