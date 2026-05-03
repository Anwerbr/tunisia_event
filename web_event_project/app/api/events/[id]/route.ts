import { NextResponse } from 'next/server'
import { getEventById } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventId = parseInt(id, 10)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }
    
    const event = getEventById(eventId)
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ event })
  } catch (error) {
    console.error('Event fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
