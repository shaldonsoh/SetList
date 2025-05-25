import { Equipment } from '@/types/equipment';

export const equipment: Equipment[] = [
  {
    id: '1',
    name: 'Sony A7III',
    price: 75,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Cameras',
    location: 'San Francisco, CA',
    description: 'Professional full-frame mirrorless camera with excellent low-light performance.',
    deliveryOptions: {
      pickup: true,
      delivery: true,
      shipping: false
    }
  },
  {
    id: '2',
    name: 'Canon EF 24-70mm f/2.8L II',
    price: 45,
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Lenses',
    location: 'San Francisco, CA',
    description: 'Versatile professional zoom lens, perfect for events and portraits.',
    deliveryOptions: {
      pickup: true,
      delivery: true,
      shipping: true
    }
  },
  {
    id: '3',
    name: 'DJI Ronin-S',
    price: 55,
    image: 'https://images.unsplash.com/photo-1589872337262-e695c8e41292?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Stabilizers',
    location: 'Oakland, CA',
    description: 'Professional 3-axis gimbal stabilizer for DSLRs and mirrorless cameras.',
    deliveryOptions: {
      pickup: true,
      delivery: false,
      shipping: false
    }
  },
  {
    id: '4',
    name: 'Profoto B1X 500 AirTTL',
    price: 85,
    image: 'https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Lighting',
    location: 'San Jose, CA',
    description: 'Professional battery-powered flash with TTL and HSS capabilities.',
    deliveryOptions: {
      pickup: true,
      delivery: true,
      shipping: true
    }
  },
  {
    id: '5',
    name: 'RED DSMC2 GEMINI',
    price: 650,
    image: 'https://images.unsplash.com/photo-1533702165324-66678e2069b2?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Cinema Cameras',
    location: 'San Francisco, CA',
    description: 'Professional cinema camera with exceptional low-light performance.',
    deliveryOptions: {
      pickup: true,
      delivery: false,
      shipping: false
    }
  },
  {
    id: '6',
    name: 'ARRI SkyPanel S60-C',
    price: 150,
    image: 'https://images.unsplash.com/photo-1595859703065-2c794f06b4c3?q=80&w=300&h=300&auto=format&fit=crop',
    category: 'Lighting',
    location: 'Berkeley, CA',
    description: 'Professional LED panel with full RGB color mixing and effects.',
    deliveryOptions: {
      pickup: true,
      delivery: true,
      shipping: false
    }
  }
]; 