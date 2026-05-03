import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from './db'
import type { User, AuthUser, RegisterData } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'tunisia-events-secret-key-change-in-production'
const TOKEN_EXPIRY = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser & { iat: number; exp: number }
    return { id: decoded.id, email: decoded.email, full_name: decoded.full_name || '', role: decoded.role }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  // Fetch fresh user data from database
  const users = await query<User[]>(
    'SELECT id, email, full_name, role FROM users WHERE id = ?',
    [decoded.id]
  )
  
  if (users.length === 0) return null
  
  return {
    id: users[0].id,
    email: users[0].email,
    full_name: users[0].full_name,
    role: users[0].role
  }
}

export async function registerUser(data: RegisterData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // Check if email already exists
    const existing = await query<User[]>(
      'SELECT id FROM users WHERE email = ?',
      [data.email]
    )
    
    if (existing.length > 0) {
      return { success: false, error: 'Email already registered' }
    }
    
    const passwordHash = await hashPassword(data.password)
    
    const result = await query<{ insertId: number }>(
      'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [data.email, passwordHash, data.full_name, data.phone || null, data.role || 'user']
    )
    
    const user: AuthUser = {
      id: result.insertId,
      email: data.email,
      full_name: data.full_name,
      role: data.role || 'user'
    }
    
    return { success: true, user }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed' }
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  try {
    const users = await query<User[]>(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash!)
    
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
    
    const token = generateToken(authUser)
    
    return { success: true, user: authUser, token }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}
