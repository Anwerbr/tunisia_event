import { NextResponse } from 'next/server'
import { getTicketByCode } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    const ticket = getTicketByCode(code)
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }
    
    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Ticket fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}
