'use client'

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
}

export default function EquipmentCard({ 
  id, 
  name, 
  price, 
  image, 
  category, 
  location,
  showActions,
  onDelete 
}: EquipmentCardProps) {
  const { getEquipmentReviews } = useReviews();
  const reviews = getEquipmentReviews(id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link href={`/equipment/${id}`}>
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-white">{name}</h3>
          <p className="mt-1 text-sm text-yellow-400">{category}</p>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
          
          {/* Rating Stars */}
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
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

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xl font-bold text-yellow-400">${price}</p>
            <p className="text-sm text-gray-400">/day</p>
          </div>
        </div>
      </Link>
      
      {showActions && onDelete && (
        <div className="absolute top-2 right-2 flex gap-2">
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
        </div>
      )}
    </div>
  )
} 