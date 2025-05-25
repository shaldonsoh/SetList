'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package2 } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import Navbar from '@/components/Navbar';

export default function MyListingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { listings, removeListing } = useListings();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    console.log('MyListingsPage - Auth Status:', { authStatus, userId });
    
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      router.push('/auth/login?returnTo=/listings');
    } else {
      // Check stored listings directly
      const storedListings = localStorage.getItem(`userListings_${userId}`);
      console.log('MyListingsPage - Stored Listings:', storedListings);
    }
  }, [router]);

  useEffect(() => {
    console.log('MyListingsPage - Current Listings:', listings);
  }, [listings]);

  const handleDelete = (listingId: string) => {
    removeListing(listingId);
  };

  const handleEdit = (listingId: string) => {
    router.push(`/equipment/${listingId}/edit`);
  };

  const filteredListings = selectedCategory === 'All Categories'
    ? listings
    : listings.filter(listing => listing.category === selectedCategory);

  console.log('MyListingsPage - Filtered Listings:', filteredListings);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <button
              onClick={() => router.push('/equipment/new')}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Add New Listing</span>
              <span className="sm:hidden">Add New</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Equipment Listings</h2>
                  <p className="text-gray-600 mt-1">Manage and track your listed equipment</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                  >
                    <option>All Categories</option>
                    <option>Cameras</option>
                    <option>Lenses</option>
                    <option>Lighting</option>
                    <option>Audio</option>
                    <option>Grip</option>
                    <option>Vehicles</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                <Package2 className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-6 text-xl font-medium text-gray-900">No equipment listed yet</h3>
                <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                  Start earning by listing your film gear for rent. It only takes a few minutes to create your first listing.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => router.push('/equipment/new')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Create Your First Listing
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Need help getting started?{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-500">
                    View our guide
                  </a>
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredListings.map((listing) => (
                    <EquipmentCard
                      key={listing.id}
                      id={listing.id}
                      name={listing.name}
                      price={listing.price}
                      image={listing.image || '/default-equipment-image.jpg'}
                      category={listing.category}
                      location={listing.location}
                      showActions={true}
                      onDelete={() => handleDelete(listing.id)}
                      onEdit={() => handleEdit(listing.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 