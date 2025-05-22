'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/search/SearchBar';
import FilterSection from '@/components/search/FilterSection';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import { useSearch } from '@/context/SearchContext';

export default function EquipmentContent() {
  const searchParams = useSearchParams();
  const { 
    filteredEquipment,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    setLocation,
    sortBy,
    setSortBy
  } = useSearch();

  // Apply URL parameters to search context
  useEffect(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const loc = searchParams.get('location');
    const sort = searchParams.get('sort');

    if (q) setSearchTerm(q);
    if (category) setSelectedCategory(category);
    if (loc) setLocation(loc);
    if (sort) setSortBy(sort);
  }, [searchParams, setSearchTerm, setSelectedCategory, setLocation, setSortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Search Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center space-y-8">
            <h1 className="text-3xl font-bold text-white text-center">Find Your Perfect Gear</h1>
            
            {/* Search Bar */}
            <div className="w-full max-w-4xl">
              <SearchBar />
            </div>
            
            {/* Additional Filters */}
            <div className="w-full max-w-4xl">
              <FilterSection />
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-t-3xl min-h-screen">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredEquipment.length} {filteredEquipment.length === 1 ? 'item' : 'items'} found
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                category={item.category}
                location={item.location}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 