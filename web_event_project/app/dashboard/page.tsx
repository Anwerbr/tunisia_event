'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty } from '@/components/ui/empty'
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  Clock,
  User,
  Search
} from 'lucide-react'
import type { Ticket as TicketType } from '@/lib/types'

export default function UserDashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    async function fetchTickets() {
      try {
        const res = await fetch('/api/tickets')
        const data = await res.json()
        setTickets(data.tickets || [])
      } catch (error) {
        console.error('Failed to fetch tickets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchTickets()
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  const now = new Date()
  const upcomingTickets = tickets.filter(t => t.event_date && new Date(t.event_date) > now)
  const pastTickets = tickets.filter(t => t.event_date && new Date(t.event_date) <= now)

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.full_name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pastTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Past Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              My Tickets
            </CardTitle>
            <CardDescription>Manage and view your event tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingTickets.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastTickets.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : upcomingTickets.length === 0 ? (
                  <Empty
                    icon={<Search className="h-12 w-12" />}
                    title="No upcoming tickets"
                    description="Browse events and book your first ticket!"
                  >
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </Empty>
                ) : (
                  <div className="space-y-4">
                    {upcomingTickets.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : pastTickets.length === 0 ? (
                  <Empty
                    icon={<Clock className="h-12 w-12" />}
                    title="No past tickets"
                    description="Your attended events will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {pastTickets.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} isPast />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function TicketCard({ ticket, isPast = false }: { ticket: TicketType; isPast?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{ticket.event_title}</h3>
            <Badge variant={ticket.payment_status === 'paid' ? 'default' : 'secondary'}>
              {ticket.payment_status === 'paid' ? 'Confirmed' : ticket.payment_status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {ticket.event_date && format(new Date(ticket.event_date), 'MMM d, yyyy - h:mm a')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{ticket.event_venue}, {ticket.event_governorate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ticket className="h-4 w-4" />
              <span>{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">{ticket.ticket_code}</span>
          <Button asChild size="sm">
            <Link href={`/tickets/${ticket.ticket_code}`}>
              <QrCode className="h-4 w-4 mr-2" />
              View Ticket
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
