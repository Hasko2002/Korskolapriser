export type School = {
  id: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  logo_url: string
}

export type ServiceType = {
  id: string
  slug: string
  label: string
  description: string
}

export type Price = {
  id: string
  school_id: string
  service_type_id: string
  amount_sek: number
  lesson_minutes: number
  notes: string
  valid_from: string
  updated_at: string
}

// Joined type used when fetching prices with school and service info
export type PriceWithDetails = Price & {
  school: School
  service_type: ServiceType
}
