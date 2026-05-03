import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { demoGetCurrentUser } from '@/lib/mock-data'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('demo_user_id')?.value
    
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    // For demo mode, we use local storage simulation via cookies
    const user = demoGetCurrentUser()
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
