'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type RentalStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface RentalRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  createdAt: string;
  notes?: string;
}

interface RentalContextType {
  rentalRequests: RentalRequest[];
  createRentalRequest: (request: Omit<RentalRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRentalStatus: (requestId: string, newStatus: RentalStatus) => void;
  getRentalRequestsByUser: (userId: string, role: 'owner' | 'renter') => RentalRequest[];
  getRentalRequestById: (requestId: string) => RentalRequest | undefined;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

  // Load rental requests from localStorage on mount
  useEffect(() => {
    const storedRequests = localStorage.getItem('rentalRequests');
    if (storedRequests) {
      setRentalRequests(JSON.parse(storedRequests));
    }
  }, []);

  // Save rental requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rentalRequests', JSON.stringify(rentalRequests));
  }, [rentalRequests]);

  const createRentalRequest = (requestData: Omit<RentalRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: RentalRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRentalRequests(prev => [...prev, newRequest]);
  };

  const updateRentalStatus = (requestId: string, newStatus: RentalStatus) => {
    setRentalRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    );
  };

  const getRentalRequestsByUser = (userId: string, role: 'owner' | 'renter') => {
    return rentalRequests.filter(request =>
      role === 'owner'
        ? request.ownerId === userId
        : request.renterId === userId
    );
  };

  const getRentalRequestById = (requestId: string) => {
    return rentalRequests.find(request => request.id === requestId);
  };

  return (
    <RentalContext.Provider
      value={{
        rentalRequests,
        createRentalRequest,
        updateRentalStatus,
        getRentalRequestsByUser,
        getRentalRequestById
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRentals() {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRentals must be used within a RentalProvider');
  }
  return context;
} 