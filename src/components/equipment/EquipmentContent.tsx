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
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <FilterSection />
            
            <div className="flex-1">
              <SearchBar />
              
              <div className="mt-8">
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 