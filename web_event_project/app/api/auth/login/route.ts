import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { demoLogin, demoSetCurrentUser } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }
    
    const result = demoLogin(email, password)
    
    if (result.success && result.user) {
      const cookieStore = await cookies()
      
      // Set demo user cookie
      cookieStore.set('demo_user_id', result.user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      // Store user data in cookie for demo
      cookieStore.set('demo_user_data', JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      demoSetCurrentUser(result.user.id)
      
      return NextResponse.json({ success: true, user: result.user })
    }
    
    return NextResponse.json({ success: false, error: result.error }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
