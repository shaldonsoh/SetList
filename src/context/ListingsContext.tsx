'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Equipment } from '@/types/equipment';
import { equipment } from '@/data/equipment';

interface ListingsContextType {
  listings: Equipment[];
  addListing: (listing: Equipment) => void;
  removeListing: (listingId: string) => void;
  updateListing: (listingId: string, updatedListing: Equipment) => void;
  getUserListings: () => Equipment[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [userListings, setUserListings] = useState<Equipment[]>([]);
  const pathname = usePathname();

  // Load all listings from localStorage on mount
  useEffect(() => {
    const loadAllListings = () => {
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      
      // Filter keys that start with 'userListings_'
      const listingKeys = keys.filter(key => key.startsWith('userListings_'));
      console.log('Found listing keys:', listingKeys);
      
      // Create a Set to track unique listing IDs
      const seenIds = new Set<string>();
      
      // Load and combine all user listings, preventing duplicates
      const allListings = listingKeys.reduce((acc: Equipment[], key) => {
        try {
          const listings = JSON.parse(localStorage.getItem(key) || '[]');
          console.log(`Listings for ${key}:`, listings);
          
          // Only add listings that haven't been seen before
          const uniqueListings = listings.filter((listing: Equipment) => {
            if (seenIds.has(listing.id)) {
              return false;
            }
            seenIds.add(listing.id);
            return true;
          });
          
          return [...acc, ...uniqueListings];
        } catch (error) {
          console.error('Error parsing listings:', error);
          return acc;
        }
      }, []);

      console.log('Setting all listings:', allListings);
      setUserListings(allListings);
    };

    loadAllListings();
    window.addEventListener('storage', loadAllListings);
    return () => window.removeEventListener('storage', loadAllListings);
  }, [pathname]);

  const addListing = (listing: Equipment) => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (!userId) return;

    // Get existing user listings
    const userKey = `userListings_${userId}`;
    const existingListings = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    // Add new listing
    const newUserListings = [...existingListings, listing];
    
    // Save to localStorage
    localStorage.setItem(userKey, JSON.stringify(newUserListings));
    
    // Update state with all listings
    setUserListings(prevListings => [...prevListings, listing]);
  };

  const removeListing = (listingId: string) => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (!userId) return;

    // Get existing user listings
    const userKey = `userListings_${userId}`;
    const existingListings = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    // Remove listing
    const updatedUserListings = existingListings.filter((listing: Equipment) => listing.id !== listingId);
    
    // Save to localStorage
    localStorage.setItem(userKey, JSON.stringify(updatedUserListings));
    
    // Update state
    setUserListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
  };

  const updateListing = (listingId: string, updatedListing: Equipment) => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (!userId) return;

    // Get existing user listings
    const userKey = `userListings_${userId}`;
    const existingListings = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    // Update listing
    const updatedUserListings = existingListings.map((listing: Equipment) => 
      listing.id === listingId ? updatedListing : listing
    );
    
    // Save to localStorage
    localStorage.setItem(userKey, JSON.stringify(updatedUserListings));
    
    // Update state
    setUserListings(prevListings => 
      prevListings.map(listing => listing.id === listingId ? updatedListing : listing)
    );
  };

  const getUserListings = () => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (!userId) return [];

    try {
      const userKey = `userListings_${userId}`;
      return JSON.parse(localStorage.getItem(userKey) || '[]');
    } catch (error) {
      console.error('Error getting user listings:', error);
      return [];
    }
  };

  return (
    <ListingsContext.Provider value={{ 
      listings: userListings,
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