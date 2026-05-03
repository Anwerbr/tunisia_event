'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { EventCard } from '@/components/event-card'
import { EventFilters } from '@/components/event-filters'
import { Empty } from '@/components/ui/empty'
import { Calendar, Search } from 'lucide-react'
import type { Event } from '@/lib/types'

function EventsContent() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [governorate, setGovernorate] = useState(searchParams.get('governorate') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (governorate && governorate !== 'all') params.set('governorate', governorate)
      if (category && category !== 'all') params.set('category', category)
      
      const res = await fetch(`/api/events?${params.toString()}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [search, governorate, category])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEvents()
    }, 300)
    return () => clearTimeout(debounce)
  }, [fetchEvents])

  const clearFilters = () => {
    setSearch('')
    setGovernorate('')
    setCategory('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
          <p className="text-muted-foreground">
            Discover events happening across Tunisia
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <EventFilters
              search={search}
              governorate={governorate}
              category={category}
              onSearchChange={setSearch}
              onGovernorateChange={setGovernorate}
              onCategoryChange={setCategory}
              onClear={clearFilters}
            />
          </aside>
          
          {/* Events Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card animate-pulse rounded-lg h-80" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <Empty
                icon={<Search className="h-12 w-12" />}
                title="No events found"
                description="Try adjusting your filters or search terms to find more events."
              />
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-muted/30">
          <Navbar />
          <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
              <p className="text-muted-foreground">Discover events happening across Tunisia</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card animate-pulse rounded-lg h-80" />
              ))}
            </div>
          </main>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  )
}
