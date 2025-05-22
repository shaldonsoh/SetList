export interface Equipment {
  id: string
  name: string
  price: number
  image: string
  category: string
  location: string
  description: string
  ownerId?: string
  ownerName?: string
}

export const equipment: Equipment[] = []; 