export interface Review {
  id: string;
  equipmentId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Helper function to generate random recent dates
function getRandomRecentDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // Random day within last 30 days
  const date = new Date(now.setDate(now.getDate() - daysAgo));
  return date.toISOString();
}

export const reviews: Review[] = []; 