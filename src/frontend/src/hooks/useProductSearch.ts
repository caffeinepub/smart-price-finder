import { useState } from 'react';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useProductSearch() {
  const { actor } = useActor();
  const [isSearching, setIsSearching] = useState(false);

  const searchByText = async (query: string): Promise<Product[]> => {
    if (!actor) {
      throw new Error('Actor not initialized');
    }

    setIsSearching(true);
    try {
      const results = await actor.searchByProductTitle(query);
      return results;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchByText,
    isSearching,
  };
}
