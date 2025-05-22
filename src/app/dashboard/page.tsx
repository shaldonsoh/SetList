'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get the user's name from localStorage
    const storedName = localStorage.getItem('userName');
    setUserName(storedName || 'User');
  }, []);

  // This would come from your auth system
  const mockUser = {
    email: 'john@example.com',
    listedEquipment: [
      { id: 1, name: 'Sony A7III', status: 'Available' },
      { id: 2, name: 'DJI Ronin', status: 'Rented' },
    ],
    rentedEquipment: [
      { id: 3, name: 'Canon C70', status: 'Active' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome and Actions */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {userName}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-4">
            <Link
              href="/equipment"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse Equipment
            </Link>
            <Link
              href="/equipment/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900"
            >
              List New Equipment
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/equipment"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Browse Equipment</p>
              <p className="text-sm text-gray-500">Find gear for your next project</p>
            </div>
          </Link>

          <Link
            href="/equipment/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">List Equipment</p>
              <p className="text-sm text-gray-500">Share your gear with others</p>
            </div>
          </Link>

          <Link
            href="/messages"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Messages</p>
              <p className="text-sm text-gray-500">Check your conversations</p>
            </div>
          </Link>

          <Link
            href="/settings"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </Link>
        </div>

        {/* Equipment Lists */}
        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
          {/* Listed Equipment */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Listed Equipment</h3>
              <div className="mt-4 space-y-4">
                {mockUser.listedEquipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.status}</p>
                    </div>
                    <Link
                      href={`/equipment/${item.id}`}
                      className="text-sm text-amber-600 hover:text-amber-500"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rented Equipment */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Equipment You're Renting</h3>
              <div className="mt-4 space-y-4">
                {mockUser.rentedEquipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.status}</p>
                    </div>
                    <Link
                      href={`/equipment/${item.id}`}
                      className="text-sm text-amber-600 hover:text-amber-500"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
              <p className="mt-2 text-3xl font-bold text-black">2</p>
            </div>
          </div>
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Rentals</h3>
              <p className="mt-2 text-3xl font-bold text-black">1</p>
            </div>
          </div>
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
              <p className="mt-2 text-3xl font-bold text-black">$1,250</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 