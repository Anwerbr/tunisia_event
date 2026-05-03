export type UserRole = 'user' | 'organizer' | 'admin'
export type EventCategory = 'concert' | 'conference' | 'sports' | 'festival' | 'workshop' | 'other'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type PaymentMethod = 'card' | 'cash' | 'mobile'
export type TransactionStatus = 'pending' | 'success' | 'failed'

export interface User {
  id: number
  email: string
  password_hash?: string
  full_name: string
  phone?: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface Event {
  id: number
  organizer_id: number
  title: string
  description?: string
  category: EventCategory
  governorate: string
  venue: string
  address?: string
  event_date: Date
  end_date?: Date
  ticket_price: number
  total_tickets: number
  available_tickets: number
  image_url?: string
  status: EventStatus
  created_at: Date
  updated_at: Date
  // Joined fields
  organizer_name?: string
}

export interface Ticket {
  id: number
  ticket_code: string
  event_id: number
  user_id: number
  quantity: number
  total_price: number
  payment_status: PaymentStatus
  qr_code?: string
  purchased_at: Date
  // Joined fields
  event_title?: string
  event_date?: Date
  event_venue?: string
  event_governorate?: string
}

export interface Payment {
  id: number
  ticket_id: number
  amount: number
  payment_method: PaymentMethod
  card_last_four?: string
  transaction_id?: string
  status: TransactionStatus
  created_at: Date
}

// Tunisia Governorates
export const GOVERNORATES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Le Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Médenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili'
] as const

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'concert', label: 'Concerts & Music' },
  { value: 'conference', label: 'Conferences & Business' },
  { value: 'sports', label: 'Sports & Activities' },
  { value: 'festival', label: 'Festivals' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'other', label: 'Other' }
]

// Auth types
export interface AuthUser {
  id: number
  email: string
  full_name: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone?: string
  role?: UserRole
}

// Filter types
export interface EventFilters {
  search?: string
  governorate?: string
  category?: EventCategory
  dateFrom?: string
  dateTo?: string
  minPrice?: number
  maxPrice?: number
}

// Stats types
export interface OrganizerStats {
  totalEvents: number
  totalTicketsSold: number
  totalRevenue: number
  upcomingEvents: number
}

export interface EventStats {
  ticketsSold: number
  revenue: number
  attendees: number
}
