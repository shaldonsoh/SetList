import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { SearchProvider } from '@/context/SearchContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ListingsProvider } from '@/context/ListingsContext'
import { ReviewsProvider } from '@/context/ReviewsContext'
import { RentalProvider } from '@/context/RentalContext'
import { MessageProvider } from '@/context/MessageContext'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "SetList",
  description: "The film and production gear rental platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ListingsProvider>
          <ReviewsProvider>
            <SearchProvider>
              <FavoritesProvider>
                <RentalProvider>
                  <MessageProvider>
                    {children}
                  </MessageProvider>
                </RentalProvider>
              </FavoritesProvider>
            </SearchProvider>
          </ReviewsProvider>
        </ListingsProvider>
      </body>
    </html>
  )
} 