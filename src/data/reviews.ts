export interface Review {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export const reviews: Review[] = [
  {
    id: '1',
    equipmentId: '1',
    userId: 'user1',
    userName: 'John Doe',
    userImage: '/avatars/avatar-1.jpg',
    rating: 5,
    comment: 'Excellent camera, perfect condition and great communication from the owner.',
    date: '2024-03-15',
    helpful: 12
  },
  {
    id: '2',
    equipmentId: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userImage: '/avatars/avatar-2.jpg',
    rating: 4,
    comment: 'Very sharp lens, minor wear but works perfectly.',
    date: '2024-03-14',
    helpful: 8
  },
  {
    id: '3',
    equipmentId: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userImage: '/avatars/avatar-3.jpg',
    rating: 5,
    comment: 'The gimbal was in perfect condition and worked flawlessly.',
    date: '2024-03-13',
    helpful: 15
  }
];

// Helper function to generate random recent dates
function getRandomRecentDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // Random day within last 30 days
  const date = new Date(now.setDate(now.getDate() - daysAgo));
  return date.toISOString();
} 