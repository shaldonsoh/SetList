'use client';

import { useSearch } from '@/context/SearchContext';

const filterChips = [
  { id: 'available-now', label: 'Available Now' },
  { id: 'instant-book', label: 'Instant Book' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'free-delivery', label: 'Free Delivery' }
] as const;

const priceRanges = [
  { id: 'under-50', label: 'Under $50/day' },
  { id: '50-100', label: '$50-$100/day' },
  { id: '100-200', label: '$100-$200/day' },
  { id: 'over-200', label: 'Over $200/day' }
] as const;

const distanceRanges = [
  { id: 'within-5', label: 'Within 5 km' },
  { id: 'within-10', label: 'Within 10 km' },
  { id: 'within-25', label: 'Within 25 km' },
  { id: 'within-50', label: 'Within 50 km' }
] as const;

const deliveryOptions = [
  { id: 'pickup-only', label: 'Pickup Only' },
  { id: 'delivery-available', label: 'Delivery Available' },
  { id: 'shipping-available', label: 'Shipping Available' }
] as const;

export default function FilterSection() {
  const { activeFilters, setActiveFilters } = useSearch();

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev: string[]) =>
      prev.includes(filterId)
        ? prev.filter((id: string) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleDistanceChange = (rangeId: string) => {
    setActiveFilters((prev: string[]) => 
      prev
        .filter((id: string) => !id.startsWith('within-'))
        .concat(rangeId)
    );
  };

  return (
    <div className="w-full">
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Range Section */}
        <div>
          <h3 className="font-medium text-white mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={activeFilters.includes(range.id)}
                  onChange={() => toggleFilter(range.id)}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                />
                <span className="ml-2 text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance Range Section */}
        <div>
          <h3 className="font-medium text-white mb-3">Distance</h3>
          <div className="space-y-2">
            {distanceRanges.map(range => (
              <label key={range.id} className="flex items-center">
                <input
                  type="radio"
                  name="distance"
                  checked={activeFilters.includes(range.id)}
                  onChange={() => handleDistanceChange(range.id)}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600"
                />
                <span className="ml-2 text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery Options Section */}
        <div>
          <h3 className="font-medium text-white mb-3">Delivery Options</h3>
          <div className="space-y-2">
            {deliveryOptions.map(option => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={activeFilters.includes(option.id)}
                  onChange={() => toggleFilter(option.id)}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                />
                <span className="ml-2 text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 