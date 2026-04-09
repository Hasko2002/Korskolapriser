import { supabase } from './supabase'
import type { School, ServiceType, PriceWithDetails } from './types'

export async function getSchools(): Promise<School[]> {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('label')

  if (error) throw new Error(error.message)
  return data
}

export async function getPricesWithDetails(): Promise<PriceWithDetails[]> {
  const { data, error } = await supabase
    .from('prices')
    .select(`
      *,
      school:schools(*),
      service_type:service_types(*)
    `)
    .order('amount_sek')

  if (error) throw new Error(error.message)
  return data
}
