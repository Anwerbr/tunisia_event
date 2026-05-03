'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Navbar } from '@/components/navbar'
import { PaymentModal } from '@/components/payment-modal'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  Share2, 
  ArrowLeft,
  User
} from 'lucide-react'
import type { Event } from '@/lib/types'

const categoryColors: Record<string, string> = {
  concert: 'bg-pink-100 text-pink-800',
  conference: 'bg-blue-100 text-blue-800',
  sports: 'bg-green-100 text-green-800',
  festival: 'bg-purple-100 text-purple-800',
  workshop: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${resolvedParams.id}`)
        const data = await res.json()
        if (data.event) {
          setEvent(data.event)
        }
      } catch (error) {
        console.error('Failed to fetch event:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [resolvedParams.id])

  const handleBooking = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (ticketCode: string) => {
    router.push(`/tickets/${ticketCode}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
            <div className="h-80 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
            <p className="text-muted-foreground mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const ticketsSold = event.total_tickets - event.available_tickets
  const soldOutPercentage = Math.round((ticketsSold / event.total_tickets) * 100)
  const isSoldOut = event.available_tickets === 0
  const maxQuantity = Math.min(event.available_tickets, 10)

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className={categoryColors[event.category] || categoryColors.other}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Event Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{format(new Date(event.event_date), 'h:mm a')}</span>
                  {event.end_date && (
                    <span>- {format(new Date(event.end_date), 'h:mm a')}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{event.venue}</p>
                  <p>{event.address}, {event.governorate}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Organized by <span className="font-medium text-foreground">{event.organizer_name || 'TunisiaEvents'}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Get Tickets</span>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {event.ticket_price === 0 ? 'Free' : `${event.ticket_price.toFixed(2)} TND`}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Availability */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium">{event.available_tickets} left</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${soldOutPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticketsSold} of {event.total_tickets} tickets sold
                  </p>
                </div>

                {!isSoldOut && (
                  <>
                    {/* Quantity Selector */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Quantity</label>
                      <Select 
                        value={quantity.toString()} 
                        onValueChange={(v) => setQuantity(parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} ticket{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{quantity} x {event.ticket_price.toFixed(2)} TND</span>
                        <span>{(quantity * event.ticket_price).toFixed(2)} TND</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{(quantity * event.ticket_price).toFixed(2)} TND</span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <Button className="w-full" size="lg" onClick={handleBooking}>
                      <Ticket className="h-5 w-5 mr-2" />
                      {user ? 'Book Now' : 'Sign In to Book'}
                    </Button>
                  </>
                )}

                {isSoldOut && (
                  <div className="text-center py-4">
                    <Badge variant="destructive" className="text-lg py-2 px-4">
                      Sold Out
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      This event is no longer available
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  <Users className="h-3 w-3 inline mr-1" />
                  {ticketsSold} people have booked this event
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {event && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          event={event}
          quantity={quantity}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
