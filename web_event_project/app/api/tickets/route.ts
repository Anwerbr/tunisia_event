import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { createTicket, getEventById, getUserTickets } from '@/lib/mock-data'
import type { AuthUser } from '@/lib/types'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get('demo_user_data')?.value
    
    if (!userDataCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user: AuthUser = JSON.parse(userDataCookie)
    const tickets = getUserTickets(user.id)
    
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Tickets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get('demo_user_data')?.value
    
    if (!userDataCookie) {
      return NextResponse.json({ error: 'Please sign in to book tickets' }, { status: 401 })
    }
    
    const user: AuthUser = JSON.parse(userDataCookie)
    const { eventId, quantity } = await request.json()
    
    if (!eventId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 })
    }
    
    const event = getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    if (event.available_tickets < quantity) {
      return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 })
    }
    
    // Generate ticket code
    const ticketCode = `TN-EVT-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`
    
    // Generate QR code
    const qrData = JSON.stringify({
      code: ticketCode,
      eventId: event.id,
      eventTitle: event.title,
      quantity,
      userId: user.id
    })
    const qrCode = await QRCode.toDataURL(qrData)
    
    const totalPrice = event.ticket_price * quantity
    
    const ticket = createTicket({
      ticket_code: ticketCode,
      event_id: eventId,
      user_id: user.id,
      quantity,
      total_price: totalPrice,
      payment_status: 'paid',
      qr_code: qrCode,
      event_title: event.title,
      event_date: event.event_date,
      event_venue: event.venue,
      event_governorate: event.governorate
    })
    
    return NextResponse.json({ 
      success: true, 
      ticket,
      message: 'Booking confirmed!' 
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to book tickets' }, { status: 500 })
  }
}
