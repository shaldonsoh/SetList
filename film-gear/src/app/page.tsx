import Link from 'next/link'
import Navbar from '@/components/Navbar'
import EquipmentCard from '@/components/equipment/EquipmentCard'
import { equipment } from '@/data/equipment'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Rent Professional Film Gear</span>
                <span className="block text-blue-600">from Local Creators</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Access film and production equipment - from vehicles to rigging and staging gear, with Australia's first peer-to-peer rental platform for the film industry.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/equipment"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Browse Equipment
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/equipment/new"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    List Your Gear
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Equipment Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="md:flex md:items-center md:justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured Equipment</h2>
            <Link
              href="/equipment"
              className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
            >
              View all<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                category={item.category}
                location={item.location}
              />
            ))}
          </div>

          <div className="mt-8 text-sm font-medium text-blue-600 hover:text-blue-500 md:hidden">
            <Link href="/equipment">
              View all<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
