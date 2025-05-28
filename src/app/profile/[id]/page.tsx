'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Star, Calendar } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useReviews } from '@/context/ReviewsContext';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Equipment } from '@/types/equipment';

interface UserProfile {
  id: string;
  name: string;
  location: string;
  joinDate: string;
  avatar: string;
  bio: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userName: string;
  equipmentId: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { listings } = useListings();
  const { getEquipmentReviews } = useReviews();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<Equipment[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if this is the current user's profile
        const currentUserId = localStorage.getItem('userId');
        setIsCurrentUser(currentUserId === params.id);

        // Fetch user profile from API
        const response = await fetch(`/api/auth/user?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to load user profile');
        }

        const userData = await response.json();
        
        setProfile({
          id: userData.id,
          name: userData.name || 'Unknown User',
          location: userData.location || 'Location not specified',
          joinDate: userData.createdAt,
          avatar: userData.image || '/default-avatar.png',
          bio: userData.bio || `${userData.name} is a member of our film gear lending community.`
        });

        // Get user's listings
        const userListings = listings.filter(listing => listing.ownerId === params.id);
        setUserListings(userListings);

        // Calculate average rating across all listings
        let totalRating = 0;
        let reviewCount = 0;
        userListings.forEach((listing: Equipment) => {
          const reviews = getEquipmentReviews(listing.id);
          reviewCount += reviews.length;
          totalRating += reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
        });

        setTotalReviews(reviewCount);
        setAverageRating(reviewCount > 0 ? totalRating / reviewCount : 0);
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [params.id, listings, getEquipmentReviews]);

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </main>
      </>
    );
  }

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

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
            <p className="mt-2 text-gray-600">The user profile you're looking for doesn't exist.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white shadow-lg overflow-hidden">
            {/* Banner */}
            <div className="relative h-64 bg-gradient-to-r from-gray-900 to-black">
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hero-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M0 32V.5H32" fill="none" stroke="white" strokeOpacity="0.1"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
                </svg>
              </div>

              {/* Profile picture */}
              <div className="absolute -bottom-12 left-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Edit Profile Button */}
              {isCurrentUser && (
                <div className="absolute bottom-4 right-4">
                  <Link
                    href="/profile/settings"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="pt-16 pb-8 px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <div className="mt-2 flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="mt-1 flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-lg font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-600">({totalReviews} reviews)</span>
                </div>
              </div>
              
              <p className="mt-6 text-gray-600 max-w-3xl">{profile.bio}</p>
            </div>
          </div>

          {/* User's Listings */}
          <div className="mt-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Equipment Listed by {profile.name}</h2>
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userListings.map((listing) => (
                  <EquipmentCard
                    key={listing.id}
                    id={listing.id}
                    name={listing.name}
                    price={listing.price}
                    image={listing.image || '/default-equipment-image.jpg'}
                    category={listing.category}
                    location={listing.location}
                    showActions={false}
                    ownerId={listing.ownerId}
                    ownerName={listing.ownerName}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  This user hasn't listed any equipment yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 