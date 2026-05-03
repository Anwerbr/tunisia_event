'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { GOVERNORATES, EVENT_CATEGORIES } from '@/lib/types'
import type { EventCategory } from '@/lib/types'

export default function CreateEventPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as EventCategory | '',
    governorate: '',
    venue: '',
    address: '',
    event_date: '',
    event_time: '',
    end_date: '',
    end_time: '',
    ticket_price: '',
    total_tickets: '',
    image_url: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (!authLoading && user && user.role !== 'organizer' && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [user, authLoading, router])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Combine date and time
      const eventDateTime = `${formData.event_date}T${formData.event_time}`
      const endDateTime = formData.end_date && formData.end_time 
        ? `${formData.end_date}T${formData.end_time}`
        : undefined

      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          governorate: formData.governorate,
          venue: formData.venue,
          address: formData.address,
          event_date: eventDateTime,
          end_date: endDateTime,
          ticket_price: parseFloat(formData.ticket_price) || 0,
          total_tickets: parseInt(formData.total_tickets) || 100,
          image_url: formData.image_url || undefined
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/organizer')
        }, 2000)
      } else {
        setError(data.error || 'Failed to create event')
      }
    } catch {
      setError('Failed to create event')
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Event Created!</h2>
              <p className="text-muted-foreground">
                Your event has been created successfully. Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/organizer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Create New Event
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new event
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  
                  <Field>
                    <FieldLabel htmlFor="title">Event Title *</FieldLabel>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Music Festival"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Description *</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="category">Category *</FieldLabel>
                    <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Location</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="governorate">Governorate *</FieldLabel>
                      <Select value={formData.governorate} onValueChange={(v) => updateField('governorate', v)}>
                        <SelectTrigger id="governorate">
                          <SelectValue placeholder="Select governorate" />
                        </SelectTrigger>
                        <SelectContent>
                          {GOVERNORATES.map((gov) => (
                            <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="venue">Venue *</FieldLabel>
                      <Input
                        id="venue"
                        placeholder="e.g., Carthage Amphitheatre"
                        value={formData.venue}
                        onChange={(e) => updateField('venue', e.target.value)}
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="address">Full Address</FieldLabel>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                    />
                  </Field>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Date & Time</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="event_date">Start Date *</FieldLabel>
                      <Input
                        id="event_date"
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => updateField('event_date', e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="event_time">Start Time *</FieldLabel>
                      <Input
                        id="event_time"
                        type="time"
                        value={formData.event_time}
                        onChange={(e) => updateField('event_time', e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => updateField('end_date', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="end_time">End Time</FieldLabel>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => updateField('end_time', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Ticket Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="ticket_price">Ticket Price (TND) *</FieldLabel>
                      <Input
                        id="ticket_price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00 for free events"
                        value={formData.ticket_price}
                        onChange={(e) => updateField('ticket_price', e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="total_tickets">Total Tickets *</FieldLabel>
                      <Input
                        id="total_tickets"
                        type="number"
                        min="1"
                        placeholder="Number of tickets available"
                        value={formData.total_tickets}
                        onChange={(e) => updateField('total_tickets', e.target.value)}
                        required
                      />
                    </Field>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Event Image</h3>
                  
                  <Field>
                    <FieldLabel htmlFor="image_url">Image URL</FieldLabel>
                    <Input
                      id="image_url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => updateField('image_url', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a URL for your event cover image (optional)
                    </p>
                  </Field>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Create Event
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
