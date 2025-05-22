'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRentals, RentalStatus } from '@/context/RentalContext';
import { format } from 'date-fns';
import { Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function MyRentalsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'history'>('requests');
  const { getRentalRequestsByUser, updateRentalStatus } = useRentals();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserId = localStorage.getItem('userId');
    setIsAuthenticated(authStatus);
    setUserId(storedUserId);
    
    if (!authStatus) {
      router.push('/auth/login?returnTo=/rentals');
    }
  }, [router]);

  if (!isAuthenticated || !userId) {
    return null;
  }

  const rentalRequests = getRentalRequestsByUser(userId, 'renter');
  const currentRequests = rentalRequests.filter(request => 
    request.status === 'pending'
  );
  const activeRentals = rentalRequests.filter(request =>
    request.status === 'approved'
  );
  const requestHistory = rentalRequests.filter(request => 
    ['completed', 'rejected'].includes(request.status)
  );

  const handleStatusUpdate = (requestId: string, newStatus: RentalStatus) => {
    updateRentalStatus(requestId, newStatus);
  };

  const renderRentalCard = (rental: any) => (
    <div key={rental.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{rental.equipmentName}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(rental.startDate), 'MMM d, yyyy')} - {format(new Date(rental.endDate), 'MMM d, yyyy')}
          </p>
          <p className="text-sm text-gray-500 mt-1">Owner: {rental.ownerName}</p>
          <p className="mt-2 text-amber-600 font-medium">
            ${rental.totalPrice.toFixed(2)}
          </p>
          {rental.notes && (
            <p className="mt-2 text-sm text-gray-600">
              Notes: {rental.notes}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${rental.status === 'approved' ? 'bg-green-100 text-green-800' :
              rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              rental.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
          </span>
          {rental.status === 'approved' && (
            <button
              onClick={() => handleStatusUpdate(rental.id, 'completed')}
              className="mt-2 block text-sm text-amber-600 hover:text-amber-700"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
            <button
              onClick={() => router.push('/')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === 'requests'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Requests
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === 'active'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Active Rentals
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === 'history'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  History
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'requests' ? (
                currentRequests.length > 0 ? (
                  currentRequests.map(rental => renderRentalCard(rental))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don&apos;t have any pending rental requests.</p>
                    <p className="text-gray-400 mt-2">
                      Browse our equipment selection to find what you need.
                    </p>
                    <button
                      onClick={() => router.push('/equipment')}
                      className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    >
                      Browse Equipment
                    </button>
                  </div>
                )
              ) : activeTab === 'active' ? (
                activeRentals.length > 0 ? (
                  activeRentals.map(rental => renderRentalCard(rental))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don&apos;t have any active rentals.</p>
                  </div>
                )
              ) : (
                requestHistory.length > 0 ? (
                  requestHistory.map(rental => renderRentalCard(rental))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don&apos;t have any rental history.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 