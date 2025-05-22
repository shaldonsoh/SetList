'use client';

import { useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';

const categories = [
  'All Categories',
  'Cameras',
  'Lenses',
  'Lighting',
  'Audio',
  'Grip',
  'Vehicles',
  'Other'
];

export default function SearchBar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    location,
    setLocation
  } = useSearch();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
    if (location) params.append('location', location);
    
    router.push(`/equipment${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row w-full gap-3">
      {/* Equipment Search */}
      <div className="flex flex-grow">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for equipment..."
            className="w-full h-12 px-4 py-2 pl-10 text-gray-900 placeholder-gray-500 border-0 border-r border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-lg"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="relative min-w-[160px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-12 w-full flex items-center px-4 py-2 text-gray-700 bg-white border-0 rounded-r-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-lg"
          >
            <span className="truncate">{selectedCategory}</span>
            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border-0 rounded-lg shadow-xl">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-yellow-50 focus:outline-none text-sm first:rounded-t-lg last:rounded-b-lg"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Search */}
      <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Location"
          className="w-full h-12 px-4 py-2 pl-10 text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-lg"
        />
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
} 