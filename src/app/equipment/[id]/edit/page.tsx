'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useListings } from '@/context/ListingsContext';
import { Equipment } from '@/types/equipment';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

export default function EditEquipmentPage({ params }: Props) {
  const router = useRouter();
  const { getUserListings, updateListing } = useListings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    location: '',
    image: ''
  });

  useEffect(() => {
    const loadListing = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/auth/login?returnTo=/equipment/' + params.id + '/edit');
          return;
        }

        const userListings = await getUserListings();
        const listing = userListings.find(l => l.id === params.id);

        if (listing) {
          setFormData({
            name: listing.name,
            description: listing.description || '',
            price: listing.price.toString(),
            category: listing.category,
            location: listing.location,
            image: listing.image || ''
          });
        } else {
          setError('Equipment not found or you do not have permission to edit it.');
        }
      } catch (error) {
        console.error('Error loading listing:', error);
        setError('Failed to load equipment details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [params.id, router, getUserListings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await updateListing(params.id, {
        ...formData,
        id: params.id,
        price: parseFloat(formData.price),
        ownerId: localStorage.getItem('userId') || '',
        ownerName: localStorage.getItem('userName') || ''
      });

      router.push('/equipment/' + params.id);
    } catch (error) {
      console.error('Error updating listing:', error);
      setError('Failed to update equipment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={handleBack}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900"
            >
              Go Back
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Equipment</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Equipment Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                placeholder="e.g., Sony A7III Camera"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                placeholder="Describe your equipment..."
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Daily Rate (USD)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">/day</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                placeholder="e.g., Camera, Lens, Lighting"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                id="image"
                value={formData.image}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 