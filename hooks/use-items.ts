'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampusItem, INITIAL_ITEMS } from '@/lib/campusData';

interface UseItemsOptions {
  search?: string;
  category?: string;
  status?: string;
  sector?: string;
}

export function useItems(options: UseItemsOptions = {}) {
  const [items, setItems] = useState<CampusItem[]>(INITIAL_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.search) params.set('search', options.search);
      if (options.category) params.set('category', options.category);
      if (options.status) params.set('status', options.status);
      if (options.sector) params.set('sector', options.sector);

      const url = `/api/items${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error('Failed to fetch items');

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [options.search, options.category, options.status, options.sector]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(
    async (itemData: {
      title: string;
      category: string;
      sector: string;
      location: string;
      description: string;
      verificationQuestion: string;
      reportType: 'lost' | 'found';
      handoverOption: string;
      image?: string;
    }): Promise<CampusItem> => {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) throw new Error('Failed to create item');

      const newItem = await res.json();
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    },
    []
  );

  const updateItemStatus = useCallback(async (itemId: string, status: string) => {
    const res = await fetch(`/api/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error('Failed to update item');

    const updatedItem = await res.json();
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: updatedItem.status } : item))
    );
    return updatedItem;
  }, []);

  return { items, loading, error, refetch: fetchItems, createItem, updateItemStatus, setItems };
}
