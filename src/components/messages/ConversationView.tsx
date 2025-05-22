import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useMessages } from '@/context/MessageContext';
import { useRentals } from '@/context/RentalContext';
import { X, Send } from 'lucide-react';

interface ConversationViewProps {
  conversationId: string;
  onClose: () => void;
}

export default function ConversationView({ conversationId, onClose }: ConversationViewProps) {
  const { messages, sendMessage } = useMessages();
  const { getRentalRequestById } = useRentals();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  // Get all messages for this conversation
  const conversationMessages = messages.filter(message => {
    const messageParticipants = [message.senderId, message.receiverId].sort().join('-');
    return messageParticipants === conversationId;
  });

  // Sort messages by date
  const sortedMessages = [...conversationMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get the other participant's info
  const otherParticipant = sortedMessages[0]?.senderId === userId 
    ? { id: sortedMessages[0].receiverId, name: sortedMessages[0].receiverName }
    : { id: sortedMessages[0].senderId, name: sortedMessages[0].senderName };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !userName || !otherParticipant) return;

    sendMessage({
      senderId: userId,
      senderName: userName,
      receiverId: otherParticipant.id,
      receiverName: otherParticipant.name,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg w-full flex flex-col" style={{ height: '70vh' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Conversation with {otherParticipant?.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedMessages.map(message => {
          const isCurrentUser = message.senderId === userId;
          const rentalRequest = message.content.includes("Request ID:") 
            ? getRentalRequestById(message.content.split("Request ID: ")[1]) 
            : null;

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  isCurrentUser
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {rentalRequest ? (
                  <div className="space-y-2">
                    <p className="font-medium">{message.content}</p>
                    <div className="mt-2 p-3 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-900">
                        {rentalRequest.equipmentName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(rentalRequest.startDate), 'MMM d, yyyy')} - {format(new Date(rentalRequest.endDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm font-medium text-yellow-400 mt-1">
                        ${rentalRequest.totalPrice.toFixed(2)}
                      </p>
                      {rentalRequest.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Note: {rentalRequest.notes}
                        </p>
                      )}
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        Status: {rentalRequest.status.charAt(0).toUpperCase() + rentalRequest.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-yellow-100' : 'text-gray-500'}`}>
                  {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 