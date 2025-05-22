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
    <div className="flex flex-col gap-3">
      {/* First Row: Search Input and Category Dropdown */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for equipment..."
            className="w-full h-14 px-4 py-2 pl-12 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
          />
          <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
        </div>
        
        {/* Category Dropdown */}
        <div className="w-1/4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-14 w-full flex items-center justify-between px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-r-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
          >
            <span className="truncate">{selectedCategory}</span>
            <ChevronDown className="w-5 h-5 ml-2 flex-shrink-0" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-[calc(25%-0.5rem)] mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-white hover:bg-gray-700 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Location and Search Button */}
      <div className="flex justify-between gap-2">
        {/* Location Input */}
        <div className="relative flex-grow-0 sm:w-64">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Location"
            className="w-full h-14 px-4 py-2 pl-12 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
          />
          <MapPin className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
        </div>

        {/* Search Button */}
        <div className="flex-grow flex justify-end">
          <button
            onClick={handleSearch}
            className="h-14 w-32 text-black font-semibold bg-yellow-400 rounded-xl hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
} 