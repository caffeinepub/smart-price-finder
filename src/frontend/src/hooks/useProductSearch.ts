import { useState } from 'react';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useProductSearch() {
  const { actor } = useActor();
  const [isSearching, setIsSearching] = useState(false);

  const searchByText = async (query: string): Promise<Product[]> => {
    console.log('useProductSearch: searchByText called with query:', query);
    
    if (!actor) {
      console.error('useProductSearch: Actor not initialized');
      throw new Error('Actor not initialized');
    }

    setIsSearching(true);
    try {
      console.log('useProductSearch: Calling actor.searchByProductTitle');
      const results = await actor.searchByProductTitle(query);
      console.log('useProductSearch: Received results:', results);
      return results;
    } catch (error) {
      console.error('useProductSearch: Error during search:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchByText,
    isSearching,
  };
}
