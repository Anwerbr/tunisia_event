'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Search, Ticket, Users, ArrowRight, Music, Briefcase, Trophy, PartyPopper } from 'lucide-react'
import type { Event } from '@/lib/types'

const categories = [
  { name: 'Concerts', icon: Music, color: 'bg-pink-100 text-pink-700' },
  { name: 'Conferences', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
  { name: 'Sports', icon: Trophy, color: 'bg-green-100 text-green-700' },
  { name: 'Festivals', icon: PartyPopper, color: 'bg-purple-100 text-purple-700' },
]

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setFeaturedEvents(data.events?.slice(0, 4) || [])
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              All 24 Governorates of Tunisia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Discover Amazing Events Across{' '}
              <span className="text-primary">Tunisia</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              From the ancient ruins of Carthage to the beaches of Djerba, find and book 
              the best concerts, festivals, conferences, and sports events happening near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/events">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">
                  <Ticket className="h-5 w-5 mr-2" />
                  Start Selling Tickets
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { label: 'Events Listed', value: '500+' },
              { label: 'Governorates', value: '24' },
              { label: 'Tickets Sold', value: '10K+' },
              { label: 'Happy Users', value: '5K+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-card rounded-lg border">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Browse by Category</h2>
              <p className="text-muted-foreground mt-1">Find events that match your interests</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/events?category=${cat.name.toLowerCase().slice(0, -1)}`}
                className="group p-6 bg-card rounded-lg border hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
              <p className="text-muted-foreground mt-1">Don&apos;t miss these upcoming events</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/events">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Host Your Own Event?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizers who trust TunisiaEvents to reach their audience. 
            Create, manage, and sell tickets for your events with ease.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">
              <Users className="h-5 w-5 mr-2" />
              Become an Organizer
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="font-bold">TunisiaEvents</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
              <Link href="/auth/login" className="hover:text-primary transition-colors">Sign In</Link>
              <Link href="/auth/register" className="hover:text-primary transition-colors">Register</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with love in Tunisia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
