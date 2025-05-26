'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { equipment } from '@/data/equipment';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { favorites } = useFavorites();
  
  // Get the saved equipment items
  const savedEquipment = equipment.filter(item => favorites.includes(item.id));

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      router.push('/auth/login?returnTo=/favorites');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
          </div>
          
          {savedEquipment.length === 0 ? (
            <div className="bg-white rounded-lg shadow">
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No saved items yet</h3>
                <p className="mt-2 text-gray-500">
                  Save items you&apos;re interested in renting by clicking the heart icon on equipment listings.
                </p>
                <button
                  onClick={() => router.push('/equipment')}
                  className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900"
                >
                  Browse Equipment
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savedEquipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image || '/default-equipment-image.jpg'}
                  category={item.category}
                  location={item.location}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 