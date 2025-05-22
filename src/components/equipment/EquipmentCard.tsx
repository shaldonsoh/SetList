'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Edit, Trash2, MoreVertical } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useReviews } from '@/context/ReviewsContext'
import ImageUpload from '../ImageUpload'

interface EquipmentCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  location: string
  onImageUpdate?: (imageUrl: string) => void
  onDelete?: () => void
  isEditable?: boolean
  showActions?: boolean
}

export default function EquipmentCard({ 
  id, 
  name, 
  price, 
  image, 
  category, 
  location,
  onImageUpdate,
  onDelete,
  isEditable = false,
  showActions = false
}: EquipmentCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { getEquipmentReviews } = useReviews()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Get reviews for this equipment
  const reviews = getEquipmentReviews(id)
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
  }, [])

  const handleImageChange = (newImageUrl: string) => {
    if (onImageUpdate) {
      onImageUpdate(newImageUrl)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the Link component from navigating
    if (!isAuthenticated) {
      window.location.href = '/auth/login?returnTo=/favorites'
      return
    }
    
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the Link component from navigating
    window.location.href = `/equipment/${id}/edit`
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the Link component from navigating
    if (confirm('Are you sure you want to delete this listing?')) {
      onDelete?.()
    }
  }

  // Function to render the image content
  const renderImage = () => {
    if (!image || imageError) {
      return (
        <div className="flex h-full items-center justify-center bg-gray-200">
          <span className="text-sm text-gray-500">Image not available</span>
        </div>
      );
    }

    return (
      <Image
        src={image}
        alt={name}
        fill
        className={`object-cover object-center transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100 group-hover:opacity-75'
        }`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        priority={id === '1'}
        quality={85}
        sizes="(max-width: 768px) 170px, 352px"
      />
    );
  };

  return (
    <Link href={`/equipment/${id}`} className="group relative">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 relative">
        {isEditable ? (
          <ImageUpload
            value={image}
            onChange={handleImageChange}
          />
        ) : (
          <>
            {renderImage()}
            {isLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              </div>
            )}
          </>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          {!showActions && (
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
            >
              <Heart
                className={`h-4 w-4 md:h-6 md:w-6 ${
                  isFavorite(id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`}
              />
            </button>
          )}
          
          {showActions && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(!showMenu)
                }}
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
              >
                <MoreVertical className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleEditClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Listing
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-xs md:text-sm font-medium text-black group-hover:text-yellow-400 truncate">{name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs md:text-sm font-medium text-yellow-400">${price}/day</p>
          <p className="text-xs text-gray-500 truncate ml-2">{location}</p>
        </div>
        {/* Rating Stars */}
        <div className="mt-1 flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-3 w-3 md:h-4 md:w-4 ${
                i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-xs md:text-sm text-gray-500">
            {reviews.length > 0 && `(${reviews.length})`}
          </span>
        </div>
      </div>
    </Link>
  )
} 