import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createEvent } from '@/lib/mock-data'
import type { AuthUser, EventCategory, EventStatus } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get('demo_user_data')?.value
    
    if (!userDataCookie) {
      return NextResponse.json({ error: 'Please sign in to create events' }, { status: 401 })
    }
    
    const user: AuthUser = JSON.parse(userDataCookie)
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only organizers can create events' }, { status: 403 })
    }
    
    const body = await request.json()
    const {
      title,
      description,
      category,
      governorate,
      venue,
      address,
      event_date,
      end_date,
      ticket_price,
      total_tickets,
      image_url
    } = body
    
    // Validation
    if (!title || !category || !governorate || !venue || !event_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const event = createEvent({
      organizer_id: user.id,
      title,
      description: description || '',
      category: category as EventCategory,
      governorate,
      venue,
      address: address || '',
      event_date: new Date(event_date),
      end_date: end_date ? new Date(end_date) : undefined,
      ticket_price: ticket_price || 0,
      total_tickets: total_tickets || 100,
      available_tickets: total_tickets || 100,
      image_url: image_url || undefined,
      status: 'published' as EventStatus,
      organizer_name: user.full_name
    })
    
    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
