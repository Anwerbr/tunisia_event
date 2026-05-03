'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, MapPin, Ticket, Download, ArrowLeft, CheckCircle } from 'lucide-react'
import type { Ticket as TicketType } from '@/lib/types'

export default function TicketViewPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params)
  const [ticket, setTicket] = useState<TicketType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/tickets/${resolvedParams.code}`)
        const data = await res.json()
        if (data.ticket) {
          setTicket(data.ticket)
        }
      } catch (error) {
        console.error('Failed to fetch ticket:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTicket()
  }, [resolvedParams.code])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse w-full max-w-md px-4">
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Ticket Not Found</h1>
            <p className="text-muted-foreground mb-4">The ticket you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-lg px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-primary text-primary-foreground p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Ticket className="h-6 w-6" />
              <span className="font-bold text-lg">TunisiaEvents</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Confirmed
            </Badge>
          </div>

          <CardContent className="p-6">
            {/* Event Info */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold mb-2">{ticket.event_title}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {ticket.event_date && format(new Date(ticket.event_date), 'EEEE, MMM d, yyyy - h:mm a')}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-1">
                <MapPin className="h-4 w-4" />
                <span>{ticket.event_venue}, {ticket.event_governorate}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <p className="text-sm text-muted-foreground mb-3">Scan this QR code at the venue</p>
              {ticket.qr_code && (
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <Image
                    src={ticket.qr_code}
                    alt="Ticket QR Code"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Ticket Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket Code</span>
                <span className="font-mono font-bold">{ticket.ticket_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-primary">{ticket.total_price.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium">
                  {format(new Date(ticket.purchased_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/events/${ticket.event_id}`}>
                  View Event
                </Link>
              </Button>
            </div>
          </CardContent>

          {/* Ticket Footer */}
          <div className="bg-muted/50 px-6 py-4 text-center text-xs text-muted-foreground">
            <p>Present this ticket at the venue entrance</p>
            <p>Keep your ticket code safe and do not share it</p>
          </div>
        </Card>
      </main>
    </div>
  )
}
