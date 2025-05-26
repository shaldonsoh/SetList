import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all equipment
export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });

    // Transform the data to match your frontend expectations
    const transformedEquipment = equipment.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      location: item.location,
      image: item.image,
      ownerId: item.owner.id,
      ownerName: item.owner.name
    }));

    return NextResponse.json(transformedEquipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Error fetching equipment' },
      { status: 500 }
    );
  }
}

// Create new equipment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = request.headers.get('X-User-Id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        location: body.location,
        image: body.image,
        ownerId: userId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      ...equipment,
      ownerName: equipment.owner.name
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Error creating equipment' },
      { status: 500 }
    );
  }
} 