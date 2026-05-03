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
import { Empty } from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Calendar, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Users,
  BarChart3
} from 'lucide-react'
import type { Event, OrganizerStats } from '@/lib/types'

const COLORS = ['#E31B23', '#D4AF37', '#2563eb', '#16a34a', '#9333ea']

export default function OrganizerDashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<OrganizerStats | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (!authLoading && user && user.role !== 'organizer' && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    async function fetchData() {
      try {
        const res = await fetch('/api/organizer/stats')
        const data = await res.json()
        setStats(data.stats)
        setEvents(data.events || [])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === 'organizer' || user.role === 'admin')) {
      fetchData()
    }
  }, [user, authLoading, router])

  if (authLoading || !user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const ticketsByEvent = events.map(event => ({
    name: event.title.length > 15 ? event.title.slice(0, 15) + '...' : event.title,
    sold: event.total_tickets - event.available_tickets,
    available: event.available_tickets
  }))

  const categoryData = events.reduce((acc, event) => {
    const category = event.category.charAt(0).toUpperCase() + event.category.slice(1)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and track performance</p>
          </div>
          <Button asChild>
            <Link href="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalTicketsSold || 0}</p>
                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats?.totalRevenue || 0).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Revenue (TND)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.upcomingEvents || 0}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tickets by Event
              </CardTitle>
              <CardDescription>Sales performance for each event</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketsByEvent.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ticketsByEvent}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sold" fill="var(--color-primary)" name="Sold" />
                    <Bar dataKey="available" fill="var(--color-muted)" name="Available" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No event data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Events by Category
              </CardTitle>
              <CardDescription>Distribution of your events</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Events
            </CardTitle>
            <CardDescription>Manage all your events</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <Empty
                icon={<Calendar className="h-12 w-12" />}
                title="No events yet"
                description="Create your first event to start selling tickets."
              >
                <Button asChild>
                  <Link href="/events/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map(event => {
                      const sold = event.total_tickets - event.available_tickets
                      const revenue = sold * event.ticket_price
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">{event.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(event.event_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{event.governorate}</TableCell>
                          <TableCell>
                            <span className="font-medium">{sold}</span>
                            <span className="text-muted-foreground">/{event.total_tickets}</span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {revenue.toFixed(2)} TND
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                event.status === 'published' ? 'default' : 
                                event.status === 'draft' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/events/${event.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
