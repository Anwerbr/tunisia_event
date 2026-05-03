import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { demoLogout } from '@/lib/mock-data'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    cookieStore.delete('demo_user_id')
    cookieStore.delete('demo_user_data')
    
    demoLogout()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
