'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, DollarSign, MapPin, FileText, Upload } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { Equipment } from '@/types/equipment';
import Navbar from '@/components/Navbar';

interface Props {
  params: {
    id: string;
  };
}

interface FormData {
  title: string;
  category: string;
  description: string;
  dailyRate: number;
  weeklyDiscount: number;
  location: string;
  pickup: boolean;
  delivery: boolean;
  shipping: boolean;
}

export default function EditEquipmentPage({ params }: Props) {
  const router = useRouter();
  const { getUserListings, updateListing } = useListings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    dailyRate: 0,
    weeklyDiscount: 0,
    location: '',
    pickup: false,
    delivery: false,
    shipping: false
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
            title: listing.name,
            description: listing.description || '',
            dailyRate: listing.price,
            weeklyDiscount: 0, // Default to 0 if not set
            category: listing.category,
            location: listing.location,
            pickup: listing.deliveryOptions?.pickup || false,
            delivery: listing.deliveryOptions?.delivery || false,
            shipping: listing.deliveryOptions?.shipping || false
          });
          if (listing.image) {
            setImages([listing.image]);
          }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImages([dataUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await updateListing(params.id, {
        id: params.id,
        name: formData.title,
        description: formData.description,
        price: formData.dailyRate,
        category: formData.category,
        location: formData.location,
        image: images[0] || undefined,
        ownerId: localStorage.getItem('userId') || '',
        ownerName: localStorage.getItem('userName') || '',
        deliveryOptions: {
          pickup: formData.pickup,
          delivery: formData.delivery,
          shipping: formData.shipping
        }
      });

      router.push('/equipment/' + params.id);
    } catch (error) {
      console.error('Error updating listing:', error);
      setError('Failed to update equipment.');
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => router.back()}
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
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Equipment</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Equipment Title
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g., Sony A7III Camera Kit"
                    />
                    <Camera className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Lenses">Lenses</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Grip">Grip</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1 relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Describe your equipment, including condition, included accessories, etc."
                    />
                    <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
                    Daily Rate
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      id="dailyRate"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full px-4 py-3 pl-8 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0.00"
                    />
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="weeklyDiscount" className="block text-sm font-medium text-gray-700">
                    Weekly Discount (%)
                  </label>
                  <input
                    type="number"
                    id="weeklyDiscount"
                    name="weeklyDiscount"
                    value={formData.weeklyDiscount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="mt-1 block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., 10"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Pickup Location
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter your address"
                    />
                    <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Delivery Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pickup"
                        checked={formData.pickup}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Pickup Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="delivery"
                        checked={formData.delivery}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Delivery Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="shipping"
                        checked={formData.shipping}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Shipping Available</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-amber-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="images" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Drop images here, or click to upload
                        </span>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
} 