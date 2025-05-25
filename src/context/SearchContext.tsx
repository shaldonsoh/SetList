'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { equipment as sampleEquipment } from '@/data/equipment';
import { useListings } from './ListingsContext';
import { useReviews } from './ReviewsContext';
import { Equipment } from '@/types/equipment';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeFilters: string[];
  setActiveFilters: Dispatch<SetStateAction<string[]>>;
  filteredEquipment: Equipment[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { listings } = useListings();
  const { reviews, getEquipmentReviews } = useReviews();

  // Get all equipment (sample equipment when not logged in, user listings when logged in)
  const allEquipment = listings;

  // Filter equipment based on search criteria
  let filteredEquipment = allEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                           item.category === selectedCategory;
    
    const matchesLocation = !location || 
                           item.location.toLowerCase().includes(location.toLowerCase());

    // Apply active filters
    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      switch (filter) {
        case 'under-50':
          return item.price < 50;
        case '50-100':
          return item.price >= 50 && item.price <= 100;
        case '100-200':
          return item.price >= 100 && item.price <= 200;
        case 'over-200':
          return item.price > 200;
        case 'within-5':
          return true; // TODO: Implement distance calculation
        case 'within-10':
          return true;
        case 'within-25':
          return true;
        case 'within-50':
          return true;
        case 'pickup-only':
          return item.deliveryOptions?.pickup ?? false;
        case 'delivery-available':
          return item.deliveryOptions?.delivery ?? false;
        case 'shipping-available':
          return item.deliveryOptions?.shipping ?? false;
        default:
          return true;
      }
    });

    return matchesSearch && matchesCategory && matchesLocation && matchesFilters;
  });

  // Sort equipment based on selected sort option
  filteredEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating': {
        const aReviews = getEquipmentReviews(a.id);
        const bReviews = getEquipmentReviews(b.id);
        const aRating = aReviews.length > 0 
          ? aReviews.reduce((acc, review) => acc + review.rating, 0) / aReviews.length 
          : 0;
        const bRating = bReviews.length > 0 
          ? bReviews.reduce((acc, review) => acc + review.rating, 0) / bReviews.length 
          : 0;
        return bRating - aRating;
      }
      default: // 'relevance'
        return 0;
    }
  });

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        location,
        setLocation,
        sortBy,
        setSortBy,
        activeFilters,
        setActiveFilters,
        filteredEquipment
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 