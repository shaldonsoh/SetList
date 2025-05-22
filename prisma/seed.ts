import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.review.deleteMany()
  await prisma.rental.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  })

  // Create sample equipment
  const camera = await prisma.equipment.create({
    data: {
      name: 'Sony A7III',
      description: 'Professional full-frame mirrorless camera with excellent low-light performance',
      price: 75.00,
      category: 'Cameras',
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      ownerId: user1.id,
    },
  })

  const lens = await prisma.equipment.create({
    data: {
      name: 'Canon EF 24-70mm f/2.8L II',
      description: 'Professional standard zoom lens with constant f/2.8 aperture',
      price: 45.00,
      category: 'Lenses',
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9',
      ownerId: user1.id,
    },
  })

  const tripod = await prisma.equipment.create({
    data: {
      name: 'Manfrotto MT190XPRO4',
      description: 'Professional aluminum tripod with 4-section legs',
      price: 25.00,
      category: 'Accessories',
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1582921017967-79d1cb6702ee',
      ownerId: user2.id,
    },
  })

  // Create a sample rental
  const rental = await prisma.rental.create({
    data: {
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-22'),
      totalPrice: 150.00,
      status: 'COMPLETED',
      equipmentId: camera.id,
      renterId: user2.id,
      ownerId: user1.id,
    },
  })

  // Create a sample review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent camera, perfect condition!',
      equipmentId: camera.id,
      userId: user2.id,
      rentalId: rental.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 