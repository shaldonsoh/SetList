'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock, Check, X } from 'lucide-react';
import { useMessages } from '@/context/MessageContext';
import { useRentals } from '@/context/RentalContext';
import { format } from 'date-fns';
import ConversationView from '@/components/messages/ConversationView';
import Navbar from '@/components/Navbar';

export default function MessagesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'requests'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  const { conversations, getConversationsForUser, markMessageAsRead } = useMessages();
  const { getRentalRequestsByUser, updateRentalStatus } = useRentals();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserId = localStorage.getItem('userId');
    setIsAuthenticated(authStatus);
    setUserId(storedUserId);
    
    if (!authStatus) {
      router.push('/auth/login?returnTo=/messages');
    }
  }, [router]);

  if (!isAuthenticated || !userId) {
    return null;
  }

  const userConversations = getConversationsForUser(userId);
  const rentalRequests = getRentalRequestsByUser(userId, 'owner');

  const handleRentalAction = (requestId: string, newStatus: 'approved' | 'rejected') => {
    updateRentalStatus(requestId, newStatus);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages & Requests</h1>
          
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    setSelectedConversation(null);
                  }}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === 'messages'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    setActiveTab('requests');
                    setSelectedConversation(null);
                  }}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === 'requests'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Rental Requests
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'messages' ? (
                selectedConversation ? (
                  <div>
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Back to Messages
                    </button>
                    <ConversationView
                      conversationId={selectedConversation}
                      onClose={() => setSelectedConversation(null)}
                    />
                  </div>
                ) : userConversations.length > 0 ? (
                  <div className="space-y-4">
                    {userConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (conversation.unreadCount > 0) {
                            markMessageAsRead(conversation.lastMessage.id);
                          }
                          setSelectedConversation(conversation.id);
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {conversation.participants.find(p => p !== userId)}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {format(new Date(conversation.lastMessage.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-2">
                              {conversation.unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
                    <p className="mt-2 text-gray-500">
                      When you communicate with equipment owners or renters, your messages will appear here.
                    </p>
                    <button
                      onClick={() => router.push('/equipment')}
                      className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    >
                      Browse Equipment
                    </button>
                  </div>
                )
              ) : (
                rentalRequests.length > 0 ? (
                  <div className="space-y-4">
                    {rentalRequests.map(request => (
                      <div key={request.id} className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{request.equipmentName}</h3>
                            <p className="text-sm text-gray-500">
                              Requested by {request.renterName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(request.startDate), 'MMM d, yyyy')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                            </p>
                            <p className="mt-2 text-amber-600 font-medium">
                              ${request.totalPrice.toFixed(2)}
                            </p>
                            {request.notes && (
                              <p className="mt-2 text-sm text-gray-600">
                                Notes: {request.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                            {request.status === 'pending' && (
                              <div className="mt-2 space-x-2">
                                <button
                                  onClick={() => handleRentalAction(request.id, 'approved')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRentalAction(request.id, 'rejected')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No rental requests</h3>
                    <p className="mt-2 text-gray-500">
                      When someone requests to rent your equipment, it will appear here.
                    </p>
                    <button
                      onClick={() => router.push('/equipment/new')}
                      className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    >
                      List Equipment
                    </button>
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