export interface Equipment {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  location: string;
  image?: string;
  ownerId?: string;
  ownerName?: string;
  deliveryOptions?: {
    pickup?: boolean;
    delivery?: boolean;
    shipping?: boolean;
  };
}

export interface FilterState {
  priceRange: string;
  distance: string;
  deliveryOption: string;
  searchQuery: string;
  selectedCategories: string[];
} 