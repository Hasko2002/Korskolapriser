import type { School } from './types'

export type GeocodedSchool = School & { coords?: [number, number] }

async function geocodeAddress(address: string, city: string): Promise<[number, number] | null> {
  const query = encodeURIComponent(`${address}, ${city}, Sverige`)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=se`,
      {
        headers: {
          'User-Agent': 'Korskolapriser/1.0',
          'Accept-Language': 'sv',
        },
        next: { revalidate: 60 * 60 * 24 * 7 }, // cache 7 dagar
      }
    )
    const data = await res.json()
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch (err) {
    console.error('Geocoding error:', err)
  }
  return null
}

export async function geocodeSchools(schools: School[]): Promise<GeocodedSchool[]> {
  const results: GeocodedSchool[] = []
  for (let i = 0; i < schools.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 1100)) // Nominatim rate limit: 1 req/s
    const coords = await geocodeAddress(schools[i].address, schools[i].city)
    results.push({ ...schools[i], coords: coords ?? undefined })
  }
  return results
}
