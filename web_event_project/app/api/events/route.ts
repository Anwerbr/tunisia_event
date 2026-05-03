import { NextResponse } from 'next/server'
import { getEvents } from '@/lib/mock-data'
import type { EventCategory } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const governorate = searchParams.get('governorate') || undefined
    const category = searchParams.get('category') as EventCategory | undefined
    
    const events = getEvents({
      search,
      governorate: governorate === 'all' ? undefined : governorate,
      category: category === 'all' as EventCategory ? undefined : category
    })
    
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
