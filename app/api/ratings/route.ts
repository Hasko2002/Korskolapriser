import { supabase } from '@/lib/supabase'
import type { SchoolRating } from '@/lib/types'

export async function GET() {
  const { data, error } = await supabase
    .from('school_ratings')
    .select('school_id, avg_rating, review_count')

  if (error) return Response.json([], { status: 500 })

  const result: SchoolRating[] = data.map(row => ({
    school_id: row.school_id,
    avg: Number(row.avg_rating),
    count: Number(row.review_count),
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
