export type MovieClassification = 'G' | '+13' | '+16' | '+18'
export type ShowStatus = 'available' | 'limited' | 'full' | 'closed' | 'expired'
export type EventType = 'drawing' | 'workshop' | 'seminar' | 'lounge'

export interface Seat {
  id: number
  seat_number: number
  is_booked: number
}

export interface Showtime {
  id: number
  movie_id: number
  show_date: string
  show_time: string
  total_seats: number
  status: ShowStatus
  generated_for_date?: string | null
  generation_source?: 'manual' | 'auto'
  slot_index?: number | null
  seats?: Seat[]
  booked_count?: number
}

export interface Movie {
  id: number
  title: string
  slug: string
  description: string
  duration_minutes: number
  classification: MovieClassification
  trailer_url: string
  poster_url: string
  is_active: number
  sort_order?: number
  showtimes?: Showtime[]
  created_at?: string
  updated_at?: string
}

export interface FeaturedMovie {
  id: number
  movie_id: number
  sort_order: number
  is_active: number
}

export interface ScheduleTemplate {
  id: number
  slot_index: number
  show_time: string
}

export interface EventItem {
  id: number
  title: string
  description: string
  event_type: EventType
  event_date: string
  event_time: string
  capacity: number
  available_seats: number
  image_url: string
  is_active: number
}

export interface Settings {
  id: number
  phone_number: string
  whatsapp_number: string
  hero_badge: string
  hero_title_line_1: string
  hero_title_line_2: string
  hero_title_line_3: string
  hero_description: string
}
