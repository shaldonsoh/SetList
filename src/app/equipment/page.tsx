'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/search/SearchBar';
import FilterSection from '@/components/search/FilterSection';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import { useSearch } from '@/context/SearchContext';

export default function EquipmentSearch() {
  const searchParams = useSearchParams();
  const { 
    filteredEquipment,
    setSearchTerm,
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
      <main className="min-h-screen bg-white">
        {/* Search Header */}
        <div className="bg-gradient-to-br from-gray-900 to-black pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Search Equipment</h1>
            <p className="text-gray-300 mb-8">Find the perfect gear for your next production</p>
            <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
              <SearchBar />
              <FilterSection />
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Results Count and Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-700">{filteredEquipment.length} items found</p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 