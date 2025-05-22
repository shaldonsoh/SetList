import Image from 'next/image'
import Link from 'next/link'

interface EquipmentCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  location: string
}

export default function EquipmentCard({ id, name, price, image, category, location }: EquipmentCardProps) {
  return (
    <Link href={`/equipment/${id}`} className="group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{category}</p>
          <p className="mt-1 text-sm text-gray-500">{location}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${price}/day</p>
      </div>
    </Link>
  )
} 