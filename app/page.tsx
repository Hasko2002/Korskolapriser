import { getSchools, getServiceTypes, getPricesWithDetails } from '@/lib/queries'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

export default async function Home() {
  let schools: School[] = []
  let serviceTypes: ServiceType[] = []
  let prices: PriceWithDetails[] = []
  let fetchError: string | null = null

  try {
    ;[schools, serviceTypes, prices] = await Promise.all([
      getSchools(),
      getServiceTypes(),
      getPricesWithDetails(),
    ])
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Körskolor i Växjö</h1>
      {fetchError && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <strong>Fel:</strong> {fetchError}
        </div>
      )}
      {!fetchError && schools.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Inga körskolor hittades — kontrollera RLS-policies i Supabase.
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Körskolor ({schools.length})</h2>
        <ul className="space-y-2">
          {schools.map((school) => (
            <li key={school.id} className="p-4 border rounded-lg">
              <p className="font-medium">{school.name}</p>
              <p className="text-sm text-gray-500">{school.address}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tjänster ({serviceTypes.length})</h2>
        <ul className="space-y-2">
          {serviceTypes.map((s) => (
            <li key={s.id} className="p-4 border rounded-lg">
              <p className="font-medium">{s.label}</p>
              <p className="text-sm text-gray-500">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Priser ({prices.length})</h2>
        <ul className="space-y-2">
          {prices.map((p) => (
            <li key={p.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{p.school.name}</p>
                <p className="text-sm text-gray-500">{p.service_type.label}</p>
              </div>
              <p className="text-lg font-bold">{p.amount_sek} kr</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
