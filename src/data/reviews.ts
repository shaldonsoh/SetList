export interface Review {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: '1',
    equipmentId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent camera, perfect condition and great communication from the owner.',
    date: '2024-03-15'
  },
  {
    id: '2',
    equipmentId: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Very sharp lens, minor wear but works perfectly.',
    date: '2024-03-14'
  },
  {
    id: '3',
    equipmentId: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'The gimbal was in perfect condition and worked flawlessly.',
    date: '2024-03-13'
  }
];

// Helper function to generate random recent dates
function getRandomRecentDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // Random day within last 30 days
  const date = new Date(now.setDate(now.getDate() - daysAgo));
  return date.toISOString();
} 