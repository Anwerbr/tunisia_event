import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrganizerStats, getOrganizerEvents } from '@/lib/mock-data'
import type { AuthUser } from '@/lib/types'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get('demo_user_data')?.value
    
    if (!userDataCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user: AuthUser = JSON.parse(userDataCookie)
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not an organizer' }, { status: 403 })
    }
    
    const stats = getOrganizerStats(user.id)
    const events = getOrganizerEvents(user.id)
    
    return NextResponse.json({ stats, events })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
