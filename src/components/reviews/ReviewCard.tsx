'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import type { Review } from '@/data/reviews'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)

  const handleHelpfulClick = () => {
    if (!hasVoted) {
      setHelpfulCount(prev => prev + 1)
      setHasVoted(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="relative h-12 w-12">
            <Image
              src={review.userImage}
              alt={review.userName}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">{review.userName}</h4>
            <time className="text-sm text-gray-500">{formatDate(review.date)}</time>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${
                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="mt-3 text-gray-600 leading-relaxed">{review.comment}</p>
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={handleHelpfulClick}
              disabled={hasVoted}
              className={`inline-flex items-center space-x-2 text-sm ${
                hasVoted ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Helpful ({helpfulCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 