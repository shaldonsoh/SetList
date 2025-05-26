'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment } from '@/types/equipment';

interface ListingsContextType {
  listings: Equipment[];
  addListing: (listing: Omit<Equipment, 'id'>) => Promise<void>;
  removeListing: (listingId: string) => Promise<void>;
  updateListing: (listingId: string, updatedListing: Equipment) => Promise<void>;
  getUserListings: () => Promise<Equipment[]>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Equipment[]>([]);

  // Fetch all listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const addListing = async (listing: Omit<Equipment, 'id'>) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(listing)
      });

      if (!response.ok) throw new Error('Failed to add listing');
      
      const newListing = await response.json();
      setListings(prev => [...prev, newListing]);
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
  };

  const removeListing = async (listingId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch(`/api/equipment/${listingId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId
        }
      });

      if (!response.ok) throw new Error('Failed to remove listing');
      
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error removing listing:', error);
      throw error;
    }
  };

  const updateListing = async (listingId: string, updatedListing: Equipment) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch(`/api/equipment/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(updatedListing)
      });

      if (!response.ok) throw new Error('Failed to update listing');
      
      const updated = await response.json();
      setListings(prev => 
        prev.map(listing => listing.id === listingId ? updated : listing)
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const getUserListings = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];

    return listings.filter(listing => listing.ownerId === userId);
  };

  return (
    <ListingsContext.Provider value={{ 
      listings,
      addListing, 
      removeListing, 
      updateListing, 
      getUserListings 
    }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
} 