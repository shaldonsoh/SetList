'use client'

import { Equipment } from '@/types/equipment'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { equipment } from '@/data/equipment'
import { useFavorites } from '@/context/FavoritesContext'
import { useListings } from '@/context/ListingsContext'
import { useReviews } from '@/context/ReviewsContext'
import { useRentals } from '@/context/RentalContext'
import { useMessages } from '@/context/MessageContext'
import ReviewCard from '@/components/reviews/ReviewCard'
import Navbar from '@/components/Navbar'

interface Props {
  params: {
    id: string
  }
}

export default function EquipmentDetailPage({ params }: Props) {
  const router = useRouter();
  const { listings } = useListings();
  const { reviews, getEquipmentReviews } = useReviews();
  const { createRentalRequest } = useRentals();
  const { sendMessage } = useMessages();
  
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<Equipment | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [notes, setNotes] = useState('');
  
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setIsAuthenticated(authStatus);
    setUserId(storedUserId);
    setUserName(storedUserName);
  }, []);

  useEffect(() => {
    // Find the item in listings
    const foundItem = listings.find((e) => e.id === params.id);
    
    // Ensure owner information is loaded
    if (foundItem) {
      // If owner information is missing, try to find it in localStorage
      if (!foundItem.ownerName && foundItem.ownerId) {
        const userKey = `userListings_${foundItem.ownerId}`;
        try {
          const userListings = JSON.parse(localStorage.getItem(userKey) || '[]');
          const matchingListing = userListings.find((l: Equipment) => l.id === params.id);
          if (matchingListing && matchingListing.ownerName) {
            foundItem.ownerName = matchingListing.ownerName;
          }
        } catch (error) {
          console.error('Error loading owner information:', error);
        }
      }
    }
    
    setItem(foundItem || null);
    setIsLoading(false);
  }, [params.id, listings]);

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

  if (!item) {
    notFound();
  }

  const itemReviews = getEquipmentReviews(params.id);
  const averageRating = itemReviews.length > 0
    ? itemReviews.reduce((acc, review) => acc + review.rating, 0) / itemReviews.length
    : 0;

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnTo=/equipment/' + params.id);
      return;
    }
    
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item.id);
    }
  };

  const handleRentalRequest = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnTo=/equipment/' + params.id);
      return;
    }

    // Check if user is the owner
    if (item.ownerId === userId) {
      alert('You cannot rent your own equipment');
      return;
    }

    // Check if owner information is available
    if (!item.ownerId || !item.ownerName) {
      alert('Owner information is not available');
      return;
    }

    setShowRentalModal(true);
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnTo=/equipment/' + params.id);
      return;
    }
    
    if (!item.ownerId || !item.ownerName) {
      alert('Owner information is not available');
      return;
    }

    // Check if user is the owner
    if (item.ownerId === userId) {
      alert('This is your own equipment listing');
      return;
    }
    
    // Send initial message to owner
    sendMessage({
      senderId: userId!,
      senderName: userName!,
      receiverId: item.ownerId,
      receiverName: item.ownerName,
      content: `Hi, I'm interested in renting your ${item.name}. Is it available?`
    });
    
    // Navigate to messages
    router.push('/messages');
  };

  const submitRentalRequest = () => {
    if (!userId || !userName) return;
    if (!item.ownerId || !item.ownerName) {
      alert('Owner information is not available');
      return;
    }

    // Check if user is the owner
    if (item.ownerId === userId) {
      alert('You cannot rent your own equipment');
      return;
    }

    const days = Math.ceil(
      (new Date(rentalDates.endDate).getTime() - new Date(rentalDates.startDate).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    
    createRentalRequest({
      equipmentId: item.id,
      equipmentName: item.name,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      renterId: userId,
      renterName: userName,
      startDate: rentalDates.startDate,
      endDate: rentalDates.endDate,
      totalPrice: item.price * days,
      notes: notes
    });

    const requestId = Date.now().toString(); // This matches the ID generation in RentalContext

    // Send a message to the owner about the rental request
    sendMessage({
      senderId: userId,
      senderName: userName,
      receiverId: item.ownerId,
      receiverName: item.ownerName,
      content: `I've submitted a rental request for your ${item.name}. Request ID: ${requestId}`
    });

    setShowRentalModal(false);
    router.push('/rentals');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <div className="flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.image || '/default-equipment-image.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <button
                  onClick={handleFavoriteClick}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isFavorite(item.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Equipment info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {item.name}
              </h1>
              <div className="mt-3">
                <h2 className="sr-only">Equipment information</h2>
                <p className="text-lg text-gray-600">{item.category}</p>
              </div>

              <div className="mt-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({itemReviews.length} reviews)
                </span>
              </div>

              <p className="mt-4 text-xl text-gray-900">
                ${item.price} <span className="text-gray-600 text-base">per day</span>
              </p>

              <div className="mt-4 flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.location}
              </div>

              {/* Owner Information */}
              <div className="mt-4 flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {item.ownerName ? (
                  <Link 
                    href={`/profile/${item.ownerId}`}
                    className="text-gray-600 hover:text-yellow-400 transition-colors"
                  >
                    Listed by {item.ownerName}
                  </Link>
                ) : (
                  'Owner information not available'
                )}
              </div>

              <p className="mt-6 text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                {item.ownerId === userId ? (
                  <>
                    <Link 
                      href={`/equipment/${item.id}/edit`}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-900 md:py-4 md:text-lg md:px-10"
                    >
                      Edit Listing
                    </Link>
                    <button 
                      onClick={() => router.push('/listings')}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      View All Listings
                    </button>
                  </>
                ) : (
                  <>
                    {isAuthenticated ? (
                      <>
                        <button 
                          onClick={handleRentalRequest}
                          disabled={item.ownerId === userId}
                          className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                            item.ownerId === userId 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-black hover:bg-gray-900'
                          } md:py-4 md:text-lg md:px-10`}
                        >
                          {item.ownerId === userId ? 'Cannot Rent Own Equipment' : 'Request to Rent'}
                        </button>
                        <button 
                          onClick={handleContactOwner}
                          disabled={item.ownerId === userId}
                          className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md ${
                            item.ownerId === userId 
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                              : 'text-gray-700 bg-white hover:bg-gray-50'
                          } md:py-4 md:text-lg md:px-10`}
                        >
                          {item.ownerId === userId ? 'Your Listing' : 'Contact Owner'}
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => router.push('/auth/login?returnTo=/equipment/' + params.id)}
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-900 md:py-4 md:text-lg md:px-10"
                      >
                        Login to Rent
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Reviews ({itemReviews.length})
            </h2>
            <div className="space-y-6">
              {itemReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {itemReviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review this equipment!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Rental Request Modal */}
      {showRentalModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Request to Rent {item.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={rentalDates.startDate}
                  onChange={(e) => setRentalDates(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={rentalDates.endDate}
                  onChange={(e) => setRentalDates(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
                  min={rentalDates.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="Any special requirements or questions?"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRentalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRentalRequest}
                  disabled={!rentalDates.startDate || !rentalDates.endDate}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 