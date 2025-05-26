import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get user ID from header or URL query parameter
    const userId = request.headers.get('X-User-Id') || new URL(request.url).searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Error fetching user data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('X-User-Id');
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        location: body.location,
        bio: body.bio,
        image: body.avatar,
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error updating user data' },
      { status: 500 }
    );
  }
} 