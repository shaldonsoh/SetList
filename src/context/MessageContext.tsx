'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  getConversation: (userId1: string, userId2: string) => Conversation | undefined;
  getConversationsForUser: (userId: string) => Conversation[];
  markMessageAsRead: (messageId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // Update conversations whenever messages change
  useEffect(() => {
    const newConversations = messages.reduce<{ [key: string]: Conversation }>((acc, message) => {
      const participantIds = [message.senderId, message.receiverId].sort();
      const conversationId = participantIds.join('-');

      if (!acc[conversationId]) {
        acc[conversationId] = {
          id: conversationId,
          participants: participantIds,
          lastMessage: message,
          unreadCount: message.read ? 0 : 1
        };
      } else {
        if (new Date(message.createdAt) > new Date(acc[conversationId].lastMessage.createdAt)) {
          acc[conversationId].lastMessage = message;
        }
        if (!message.read) {
          acc[conversationId].unreadCount++;
        }
      }

      return acc;
    }, {});

    setConversations(Object.values(newConversations));
  }, [messages]);

  const sendMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const getConversation = (userId1: string, userId2: string) => {
    const participantIds = [userId1, userId2].sort();
    const conversationId = participantIds.join('-');
    return conversations.find(conv => conv.id === conversationId);
  };

  const getConversationsForUser = (userId: string) => {
    return conversations.filter(conv => conv.participants.includes(userId));
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === messageId
          ? { ...message, read: true }
          : message
      )
    );
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversations,
        sendMessage,
        getConversation,
        getConversationsForUser,
        markMessageAsRead
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
} 