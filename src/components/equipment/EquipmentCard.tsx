'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useReviews } from '@/context/ReviewsContext'

interface EquipmentCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  location: string
  showActions?: boolean
  onDelete?: () => void
  onEdit?: () => void
  ownerId?: string
  ownerName?: string
}

export default function EquipmentCard({ 
  id, 
  name, 
  price, 
  image, 
  category, 
  location,
  showActions,
  onDelete,
  onEdit,
  ownerId,
  ownerName: initialOwnerName
}: EquipmentCardProps) {
  const { getEquipmentReviews } = useReviews();
  const [ownerName, setOwnerName] = useState(initialOwnerName);
  const reviews = getEquipmentReviews(id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (!ownerId) return;
      
      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'X-User-Id': ownerId
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setOwnerName(userData.name);
        }
      } catch (error) {
        console.error('Error fetching owner info:', error);
      }
    };

    fetchOwnerInfo();
  }, [ownerId]);

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
      <Link href={`/equipment/${id}`} className="flex-1 flex flex-col">
        <div className="aspect-square w-full relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-medium text-white line-clamp-1">{name}</h3>
          <p className="mt-1 text-sm text-yellow-400">{category}</p>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Owner Information */}
          {ownerId && ownerName && (
            <Link 
              href={`/profile/${ownerId}`}
              className="mt-1 flex items-center text-sm text-gray-400 hover:text-yellow-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg 
                className="h-4 w-4 mr-1 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              <span className="line-clamp-1">{ownerName}</span>
            </Link>
          )}
          
          {/* Rating Stars */}
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 flex-shrink-0 ${
                    i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-400">
                ({reviews.length})
              </span>
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <p className="text-xl font-bold text-yellow-400">${price}</p>
            <p className="text-sm text-gray-400">/day</p>
          </div>
        </div>
      </Link>
      
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
} 