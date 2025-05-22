'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Review, reviews as sampleReviews } from '@/data/reviews';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
  removeReview: (reviewId: string) => void;
  updateReview: (reviewId: string, updatedReview: Review) => void;
  getEquipmentReviews: (equipmentId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from localStorage or initialize with sample reviews
  useEffect(() => {
    console.log('ReviewsContext: Loading reviews...');
    const storedReviews = localStorage.getItem('reviews');
    
    if (storedReviews) {
      console.log('ReviewsContext: Found stored reviews');
      const parsedReviews = JSON.parse(storedReviews);
      setReviews(parsedReviews);
    } else {
      console.log('ReviewsContext: No stored reviews found, initializing with sample reviews');
      localStorage.setItem('reviews', JSON.stringify(sampleReviews));
      setReviews(sampleReviews);
    }
  }, []); // Only run on mount

  const getEquipmentReviews = (equipmentId: string) => {
    console.log('ReviewsContext: Getting reviews for equipment:', equipmentId);
    console.log('ReviewsContext: Current reviews state:', reviews);
    const filteredReviews = reviews.filter(review => {
      const matches = review.equipmentId === equipmentId;
      console.log(`ReviewsContext: Comparing review ${review.id} equipmentId ${review.equipmentId} with ${equipmentId}: ${matches}`);
      return matches;
    });
    console.log('ReviewsContext: Found reviews for equipment:', filteredReviews);
    return filteredReviews;
  };

  const addReview = (review: Review) => {
    setReviews(prev => {
      const newReviews = [...prev, review];
      localStorage.setItem('reviews', JSON.stringify(newReviews));
      return newReviews;
    });
  };

  const removeReview = (reviewId: string) => {
    setReviews(prev => {
      const newReviews = prev.filter(review => review.id !== reviewId);
      localStorage.setItem('reviews', JSON.stringify(newReviews));
      return newReviews;
    });
  };

  const updateReview = (reviewId: string, updatedReview: Review) => {
    setReviews(prev => {
      const newReviews = prev.map(review => 
        review.id === reviewId ? updatedReview : review
      );
      localStorage.setItem('reviews', JSON.stringify(newReviews));
      return newReviews;
    });
  };

  return (
    <ReviewsContext.Provider value={{ 
      reviews,
      addReview, 
      removeReview, 
      updateReview,
      getEquipmentReviews 
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
} 