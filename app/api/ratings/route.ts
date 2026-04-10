import { supabase } from '@/lib/supabase'
import type { SchoolRating } from '@/lib/types'

export async function GET() {
  const { data, error } = await supabase
    .from('ratings')
    .select('school_id, stars')

  if (error) return Response.json([], { status: 500 })

  // Aggregate per school
  const map = new Map<string, { sum: number; count: number }>()
  for (const row of data) {
    const entry = map.get(row.school_id) ?? { sum: 0, count: 0 }
    entry.sum += row.stars
    entry.count += 1
    map.set(row.school_id, entry)
  }

  const result: SchoolRating[] = Array.from(map.entries()).map(([school_id, { sum, count }]) => ({
    school_id,
    avg: sum / count,
    count,
  }))

  return Response.json(result)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { school_id, stars } = body

  if (!school_id || typeof stars !== 'number' || stars < 1 || stars > 5) {
    return Response.json({ error: 'Ogiltigt betyg' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ratings')
    .insert({ school_id, stars: Math.round(stars) })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}
