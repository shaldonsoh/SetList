import { equipment } from '@/data/equipment'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { imageUrl } = body

    const equipmentIndex = equipment.findIndex(item => item.id === params.id)
    
    if (equipmentIndex === -1) {
      return new NextResponse('Equipment not found', { status: 404 })
    }

    // Update the image URL
    equipment[equipmentIndex] = {
      ...equipment[equipmentIndex],
      image: imageUrl
    }

    return NextResponse.json(equipment[equipmentIndex])
  } catch (error) {
    console.error('[EQUIPMENT_IMAGE_UPDATE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 