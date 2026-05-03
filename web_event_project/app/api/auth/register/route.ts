import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { demoRegister, demoSetCurrentUser } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const { email, password, full_name, phone, role } = await request.json()
    
    if (!email || !password || !full_name) {
      return NextResponse.json({ success: false, error: 'Email, password and full name are required' }, { status: 400 })
    }
    
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    
    const result = demoRegister({ email, password, full_name, phone, role })
    
    if (result.success && result.user) {
      const cookieStore = await cookies()
      
      cookieStore.set('demo_user_id', result.user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      cookieStore.set('demo_user_data', JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      
      demoSetCurrentUser(result.user.id)
      
      return NextResponse.json({ success: true, user: result.user })
    }
    
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
