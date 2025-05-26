'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import EquipmentCard from '@/components/equipment/EquipmentCard'
import SearchBar from '@/components/search/SearchBar'
import { useSearch } from '@/context/SearchContext'
import { useListings } from '@/context/ListingsContext'
import { 
  Car, 
  Camera, 
  Anchor, 
  Lightbulb, 
  Grip, 
  Mic,
  LampDesk,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { type ReactNode } from 'react';

export default function Home(): ReactNode {
  const router = useRouter();
  const { setSelectedCategory } = useSearch();
  const { listings } = useListings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Get featured equipment (first 6 listings)
  const featuredEquipment = listings?.slice(0, 6) || [];

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const categories = [
    {
      name: 'Vehicles',
      icon: Car,
    },
    {
      name: 'Cameras',
      icon: Camera,
    },
    {
      name: 'Rigs',
      icon: Anchor,
    },
    {
      name: 'Lighting',
      icon: LampDesk,
    },
    {
      name: 'Grips',
      icon: Grip,
    },
    {
      name: 'Audio',
      icon: Mic,
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    router.push(`/equipment?category=${encodeURIComponent(categoryName)}`);
  };

  const handleListGear = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnTo=/equipment/new');
    } else {
      router.push('/equipment/new');
    }
  };

  // Function to scroll the carousel
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Get the width of the viewport
      const isMobile = window.innerWidth < 768;
      // On mobile, scroll by one card (170px + 12px gap)
      // On desktop, scroll by three cards (360px + 24px gap each)
      const scrollAmount = isMobile ? 182 : 1080;
      
      const scrollPosition = direction === 'left' 
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Section with Pattern Background */}
        <div className="relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Background Illustrations */}
          <div className="absolute inset-0 opacity-[0.15]">
            <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  {/* Camera */}
                  <path d="M30 40 h30 v20 h-30 v-20 m5 -5 h20 v5 h-20 v-5" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="45" cy="50" r="6" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                  
                  {/* Film Reel */}
                  <circle cx="90" cy="90" r="15" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                  <circle cx="90" cy="90" r="5" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="90" cy="90" r="10" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3"/>
                  
                  {/* Light */}
                  <path d="M85 20 h10 l5 10 h-20 l5 -10" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                  <path d="M90 30 v5 m-7 -2 l14 4" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                  
                  {/* Microphone */}
                  <circle cx="20" cy="90" r="6" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 96 v10" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 106 h10" className="text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"/>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-pattern)"/>
            </svg>
          </div>

          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="pt-32 pb-20">
          <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                  <span className="block">Rent Film Gear from</span>
                  <span className="block text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Local Creators</span>
            </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl drop-shadow">
                  Access film and production equipment at affordable rates. List your gear and earn when you're not shooting.
            </p>
                <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/equipment"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Browse Equipment
                </Link>
                <Link
                  href="/equipment/new"
                    className="inline-flex items-center px-8 py-3 border border-yellow-400 text-base font-medium rounded-md text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-black md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  List Your Gear
                  </Link>
                </div>
              </div>
            </div>

            {/* Category Shortcuts */}
            <div className="pb-16">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                <Link href="/equipment?category=Cameras" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Camera className="h-6 w-6 text-yellow-400" />
                  <span className="mt-2 text-sm text-white">Cameras</span>
                </Link>
                <Link href="/equipment?category=Lenses" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="mt-2 text-sm text-white">Lenses</span>
                </Link>
                <Link href="/equipment?category=Lighting" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <LampDesk className="h-6 w-6 text-yellow-400" />
                  <span className="mt-2 text-sm text-white">Lighting</span>
                </Link>
                <Link href="/equipment?category=Audio" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Mic className="h-6 w-6 text-yellow-400" />
                  <span className="mt-2 text-sm text-white">Audio</span>
                </Link>
                <Link href="/equipment?category=Grip" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Grip className="h-6 w-6 text-yellow-400" />
                  <span className="mt-2 text-sm text-white">Grip</span>
                </Link>
                <Link href="/equipment?category=Vehicles" className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Car className="h-6 w-6 text-yellow-400" />
                  <span className="mt-2 text-sm text-white">Vehicles</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Find the Perfect Equipment</h2>
              <div className="w-full max-w-3xl">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Equipment Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Equipment</h2>
            <Link
              href="/equipment"
                className="text-yellow-400 hover:text-yellow-500 font-medium"
            >
                View All
            </Link>
          </div>
            {/* Carousel Container */}
            <div className="relative">
              <div 
                ref={carouselRef}
                className="overflow-x-auto hide-scrollbar scroll-smooth"
              >
                <div className="flex gap-3 md:gap-6">
                  {featuredEquipment && featuredEquipment.length > 0 ? (
                    featuredEquipment.map((item) => (
                      <div key={item.id} className="w-[170px] md:w-[352px] flex-[0_0_auto]">
              <EquipmentCard
                id={item.id}
                name={item.name}
                price={item.price}
                          image={item.image || '/default-equipment-image.jpg'}
                category={item.category}
                location={item.location}
              />
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-8">
                      <p className="text-gray-500">No equipment listings available yet.</p>
                      <Link 
                        href="/equipment/new"
                        className="mt-4 inline-block text-yellow-400 hover:text-yellow-500"
                      >
                        Add your first listing
                      </Link>
                    </div>
                  )}
                </div>
          </div>

              {/* Only show arrows if there are listings */}
              {featuredEquipment && featuredEquipment.length > 0 && (
                <>
                  <button
                    onClick={() => scroll('left')}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-colors z-10"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-colors z-10"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
    </>
  );
}
