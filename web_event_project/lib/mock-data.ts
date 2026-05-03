// Mock data for development/demo when MySQL is not available
import type { Event, User, Ticket, AuthUser, EventCategory } from './types'

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@tunisiaevents.tn',
    full_name: 'Admin User',
    phone: '+216 71 000 001',
    role: 'admin',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 2,
    email: 'organizer@tunisiaevents.tn',
    full_name: 'Mohamed Organizer',
    phone: '+216 71 000 002',
    role: 'organizer',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 3,
    email: 'user@tunisiaevents.tn',
    full_name: 'Fatma User',
    phone: '+216 71 000 003',
    role: 'user',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
]

export const mockEvents: Event[] = [
  {
    id: 1,
    organizer_id: 2,
    title: 'Carthage Jazz Festival 2024',
    description: 'The most prestigious jazz festival in Tunisia featuring international and local artists. Experience world-class performances under the stars at the ancient Roman amphitheatre.',
    category: 'concert',
    governorate: 'Tunis',
    venue: 'Carthage Amphitheatre',
    address: 'Carthage, Tunis',
    event_date: new Date('2024-07-15T20:00:00'),
    end_date: new Date('2024-07-15T23:00:00'),
    ticket_price: 75.00,
    total_tickets: 500,
    available_tickets: 450,
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    status: 'published',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 2,
    organizer_id: 2,
    title: 'Tech Summit Tunisia',
    description: 'Annual technology conference bringing together innovators and entrepreneurs from across MENA. Featuring keynotes, workshops, and networking opportunities.',
    category: 'conference',
    governorate: 'Tunis',
    venue: 'Tunis Convention Center',
    address: 'Les Berges du Lac, Tunis',
    event_date: new Date('2024-08-20T09:00:00'),
    end_date: new Date('2024-08-21T18:00:00'),
    ticket_price: 150.00,
    total_tickets: 300,
    available_tickets: 280,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'published',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 3,
    organizer_id: 2,
    title: 'Sousse Marathon 2024',
    description: 'Run through the beautiful coastal city of Sousse in this annual marathon event. Routes for all levels including 5K, 10K, and full marathon.',
    category: 'sports',
    governorate: 'Sousse',
    venue: 'Sousse Beach',
    address: 'Corniche de Sousse',
    event_date: new Date('2024-09-10T06:00:00'),
    end_date: new Date('2024-09-10T12:00:00'),
    ticket_price: 25.00,
    total_tickets: 1000,
    available_tickets: 850,
    image_url: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
    status: 'published',
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 4,
    organizer_id: 2,
    title: 'Djerba Electronic Festival',
    description: 'Three days of electronic music on the beautiful island of Djerba. International DJs, beach parties, and unforgettable moments.',
    category: 'festival',
    governorate: 'Médenine',
    venue: 'Djerba Beach Resort',
    address: 'Houmt Souk, Djerba',
    event_date: new Date('2024-10-05T16:00:00'),
    end_date: new Date('2024-10-07T04:00:00'),
    ticket_price: 200.00,
    total_tickets: 800,
    available_tickets: 650,
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    status: 'published',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 5,
    organizer_id: 2,
    title: 'Startup Workshop Sfax',
    description: 'Learn how to build and scale your startup with industry experts. Hands-on sessions covering business planning, fundraising, and marketing.',
    category: 'workshop',
    governorate: 'Sfax',
    venue: 'Sfax Business Center',
    address: 'Centre Ville, Sfax',
    event_date: new Date('2024-06-25T10:00:00'),
    end_date: new Date('2024-06-25T17:00:00'),
    ticket_price: 50.00,
    total_tickets: 50,
    available_tickets: 35,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    status: 'published',
    created_at: new Date('2024-03-15'),
    updated_at: new Date('2024-03-15'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 6,
    organizer_id: 2,
    title: 'Kairouan Heritage Tour',
    description: 'Discover the rich history of one of the oldest Islamic cities in Africa. Guided tours of the Great Mosque and the Medina.',
    category: 'other',
    governorate: 'Kairouan',
    venue: 'Great Mosque of Kairouan',
    address: 'Medina, Kairouan',
    event_date: new Date('2024-07-01T08:00:00'),
    end_date: new Date('2024-07-01T16:00:00'),
    ticket_price: 30.00,
    total_tickets: 100,
    available_tickets: 75,
    image_url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800',
    status: 'published',
    created_at: new Date('2024-04-01'),
    updated_at: new Date('2024-04-01'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 7,
    organizer_id: 2,
    title: 'Hammamet Film Festival',
    description: 'Celebrating cinema from Tunisia and the Arab world. Film screenings, director Q&As, and industry networking events.',
    category: 'festival',
    governorate: 'Nabeul',
    venue: 'Hammamet Cultural Center',
    address: 'Hammamet, Nabeul',
    event_date: new Date('2024-11-15T18:00:00'),
    end_date: new Date('2024-11-20T23:00:00'),
    ticket_price: 40.00,
    total_tickets: 400,
    available_tickets: 380,
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    status: 'published',
    created_at: new Date('2024-04-15'),
    updated_at: new Date('2024-04-15'),
    organizer_name: 'Mohamed Organizer'
  },
  {
    id: 8,
    organizer_id: 2,
    title: 'Bizerte Sailing Championship',
    description: 'Annual sailing competition in the Mediterranean waters of Bizerte. Open to all skill levels with multiple categories.',
    category: 'sports',
    governorate: 'Bizerte',
    venue: 'Bizerte Marina',
    address: 'Port de Bizerte',
    event_date: new Date('2024-08-05T07:00:00'),
    end_date: new Date('2024-08-07T18:00:00'),
    ticket_price: 0.00,
    total_tickets: 200,
    available_tickets: 180,
    image_url: 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=800',
    status: 'published',
    created_at: new Date('2024-05-01'),
    updated_at: new Date('2024-05-01'),
    organizer_name: 'Mohamed Organizer'
  }
]

export const mockTickets: Ticket[] = [
  {
    id: 1,
    ticket_code: 'TN-EVT-2024-00001',
    event_id: 1,
    user_id: 3,
    quantity: 2,
    total_price: 150.00,
    payment_status: 'paid',
    qr_code: 'data:image/png;base64,mock',
    purchased_at: new Date('2024-05-15'),
    event_title: 'Carthage Jazz Festival 2024',
    event_date: new Date('2024-07-15T20:00:00'),
    event_venue: 'Carthage Amphitheatre',
    event_governorate: 'Tunis'
  },
  {
    id: 2,
    ticket_code: 'TN-EVT-2024-00002',
    event_id: 2,
    user_id: 3,
    quantity: 1,
    total_price: 150.00,
    payment_status: 'paid',
    qr_code: 'data:image/png;base64,mock',
    purchased_at: new Date('2024-05-20'),
    event_title: 'Tech Summit Tunisia',
    event_date: new Date('2024-08-20T09:00:00'),
    event_venue: 'Tunis Convention Center',
    event_governorate: 'Tunis'
  }
]

// Storage for demo mode
let demoUsers = [...mockUsers]
let demoEvents = [...mockEvents]
let demoTickets = [...mockTickets]
let currentUserId: number | null = null

// Demo auth functions
export function demoLogin(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
  const user = demoUsers.find(u => u.email === email)
  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }
  // For demo, accept any password
  if (password.length < 1) {
    return { success: false, error: 'Password required' }
  }
  currentUserId = user.id
  return { 
    success: true, 
    user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
  }
}

export function demoRegister(data: { email: string; password: string; full_name: string; phone?: string; role?: 'user' | 'organizer' }): { success: boolean; user?: AuthUser; error?: string } {
  if (demoUsers.find(u => u.email === data.email)) {
    return { success: false, error: 'Email already registered' }
  }
  const newUser: User = {
    id: demoUsers.length + 1,
    email: data.email,
    full_name: data.full_name,
    phone: data.phone,
    role: data.role || 'user',
    created_at: new Date(),
    updated_at: new Date()
  }
  demoUsers.push(newUser)
  currentUserId = newUser.id
  return { 
    success: true, 
    user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name, role: newUser.role }
  }
}

export function demoGetCurrentUser(): AuthUser | null {
  if (!currentUserId) return null
  const user = demoUsers.find(u => u.id === currentUserId)
  if (!user) return null
  return { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
}

export function demoLogout(): void {
  currentUserId = null
}

export function demoSetCurrentUser(userId: number | null): void {
  currentUserId = userId
}

// Event functions
export function getEvents(filters?: { search?: string; governorate?: string; category?: EventCategory }): Event[] {
  let filtered = demoEvents.filter(e => e.status === 'published')
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(search) || 
      e.description?.toLowerCase().includes(search)
    )
  }
  
  if (filters?.governorate) {
    filtered = filtered.filter(e => e.governorate === filters.governorate)
  }
  
  if (filters?.category) {
    filtered = filtered.filter(e => e.category === filters.category)
  }
  
  return filtered.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
}

export function getEventById(id: number): Event | undefined {
  return demoEvents.find(e => e.id === id)
}

export function getOrganizerEvents(organizerId: number): Event[] {
  return demoEvents.filter(e => e.organizer_id === organizerId)
}

export function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Event {
  const newEvent: Event = {
    ...event,
    id: demoEvents.length + 1,
    created_at: new Date(),
    updated_at: new Date()
  }
  demoEvents.push(newEvent)
  return newEvent
}

// Ticket functions
export function getUserTickets(userId: number): Ticket[] {
  return demoTickets.filter(t => t.user_id === userId)
}

export function getTicketByCode(code: string): Ticket | undefined {
  return demoTickets.find(t => t.ticket_code === code)
}

export function createTicket(ticket: Omit<Ticket, 'id' | 'purchased_at'>): Ticket {
  const newTicket: Ticket = {
    ...ticket,
    id: demoTickets.length + 1,
    purchased_at: new Date()
  }
  demoTickets.push(newTicket)
  
  // Update available tickets
  const event = demoEvents.find(e => e.id === ticket.event_id)
  if (event) {
    event.available_tickets -= ticket.quantity
  }
  
  return newTicket
}

// Stats functions
export function getOrganizerStats(organizerId: number) {
  const events = demoEvents.filter(e => e.organizer_id === organizerId)
  const eventIds = events.map(e => e.id)
  const tickets = demoTickets.filter(t => eventIds.includes(t.event_id) && t.payment_status === 'paid')
  
  return {
    totalEvents: events.length,
    totalTicketsSold: tickets.reduce((sum, t) => sum + t.quantity, 0),
    totalRevenue: tickets.reduce((sum, t) => sum + t.total_price, 0),
    upcomingEvents: events.filter(e => new Date(e.event_date) > new Date()).length
  }
}

export function getEventStats(eventId: number) {
  const tickets = demoTickets.filter(t => t.event_id === eventId && t.payment_status === 'paid')
  return {
    ticketsSold: tickets.reduce((sum, t) => sum + t.quantity, 0),
    revenue: tickets.reduce((sum, t) => sum + t.total_price, 0),
    attendees: tickets.length
  }
}
