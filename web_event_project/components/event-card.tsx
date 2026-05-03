'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Ticket } from 'lucide-react'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
}

const categoryColors: Record<string, string> = {
  concert: 'bg-pink-100 text-pink-800',
  conference: 'bg-blue-100 text-blue-800',
  sports: 'bg-green-100 text-green-800',
  festival: 'bg-purple-100 text-purple-800',
  workshop: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
}

export function EventCard({ event }: EventCardProps) {
  const ticketsSold = event.total_tickets - event.available_tickets
  const soldOutPercentage = (ticketsSold / event.total_tickets) * 100
  const isAlmostSoldOut = soldOutPercentage >= 80
  const isSoldOut = event.available_tickets === 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={categoryColors[event.category] || categoryColors.other}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SOLD OUT</span>
          </div>
        )}
        {isAlmostSoldOut && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive">Almost Sold Out</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.event_date), 'EEE, MMM d, yyyy - h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue}, {event.governorate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.available_tickets} / {event.total_tickets} tickets left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Ticket className="h-4 w-4 text-primary" />
          <span className="font-bold text-lg">
            {event.ticket_price === 0 ? 'Free' : `${event.ticket_price.toFixed(2)} TND`}
          </span>
        </div>
        <Button asChild size="sm" disabled={isSoldOut}>
          <Link href={`/events/${event.id}`}>
            {isSoldOut ? 'Sold Out' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
