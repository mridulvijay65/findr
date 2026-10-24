'use client';

import { useState, useCallback } from 'react';

interface BroadcastData {
  itemTitle: string;
  quadrant: string;
  minutesAgo: string;
  details: string;
  contactMethod: 'app' | 'phone';
}

interface BroadcastResult {
  id: string;
  itemTitle: string;
  quadrant: string;
  ambassadorsNotified: number;
  securityPostsNotified: number;
}

export function useBroadcasts() {
  const [broadcasting, setBroadcasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBroadcast = useCallback(async (data: BroadcastData): Promise<BroadcastResult> => {
    try {
      setBroadcasting(true);
      setError(null);

      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create broadcast');
      }

      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setBroadcasting(false);
    }
  }, []);

  return { createBroadcast, broadcasting, error };
}
