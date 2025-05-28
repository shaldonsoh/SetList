'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMessages } from '@/context/MessageContext';
import { useRentals } from '@/context/RentalContext';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const { conversations, getConversationsForUser } = useMessages();
  const { getRentalRequestsByUser } = useRentals();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const storedName = localStorage.getItem('userName');
      const storedUserId = localStorage.getItem('userId');
      setIsAuthenticated(authStatus);
      setUserName(storedName || '');
      setUserId(storedUserId);
    };

    // Check immediately
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);

    // Check auth status when the component mounts or window gets focus
    window.addEventListener('focus', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    // Remove authentication status and userId
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
    router.refresh();
  };

  // Calculate notification counts
  const unreadMessageCount = userId ? getConversationsForUser(userId).reduce((acc, conv) => acc + conv.unreadCount, 0) : 0;
  const pendingRequestCount = userId ? getRentalRequestsByUser(userId, 'owner').filter(req => req.status === 'pending').length : 0;

  const NotificationBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">
                  <span className="text-black">Crew</span>
                  <span className="text-yellow-400">Mate</span>
                </h1>
                <span className="hidden md:inline text-sm text-black/80 border-l border-gray-300 pl-4">
                  Australia's 1st P2P lending platform for the Film Industry
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-8">
            <Link
              href="/equipment"
              className="text-gray-700 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              Browse Equipment
            </Link>
            <Link
              href="/equipment/new"
              className="text-gray-700 hover:text-yellow-400 px-3 py-2 text-sm font-medium"
            >
              List Your Gear
            </Link>
            
            {/* Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
              >
                {isAuthenticated ? userName || 'Account' : 'Sign up / Login'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/listings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Listings
                        </Link>
                        <Link
                          href="/rentals"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Rentals
                        </Link>
                        <div className="relative">
                          <Link
                            href="/messages"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Messages
                            {unreadMessageCount > 0 && <NotificationBadge count={unreadMessageCount} />}
                          </Link>
                        </div>
                        <Link
                          href="/favorites"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Saved Items
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-400"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-yellow-400 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/equipment"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
            >
              Browse Equipment
            </Link>
            <Link
              href="/equipment/new"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
            >
              List Your Gear
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/listings"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  My Listings
                </Link>
                <Link
                  href="/rentals"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  My Rentals
                </Link>
                <div className="relative inline-block">
                  <Link
                    href="/messages"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                  >
                    Messages
                    {unreadMessageCount > 0 && <NotificationBadge count={unreadMessageCount} />}
                  </Link>
                </div>
                <Link
                  href="/favorites"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  Saved Items
                </Link>
                <Link
                  href="/profile/settings"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 