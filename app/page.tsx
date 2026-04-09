import { getSchools, getServiceTypes, getPricesWithDetails } from '@/lib/queries'
import { geocodeSchools } from '@/lib/geocode'
import PriceComparison from '@/components/PriceComparison'
import MapSection from '@/components/MapSection'
import ChatWidget from '@/components/ChatWidget'

export default async function Home() {
  const [schools, serviceTypes, prices] = await Promise.all([
    getSchools(),
    getServiceTypes(),
    getPricesWithDetails(),
  ])

  const geocodedSchools = await geocodeSchools(schools)

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(to bottom, rgba(37,99,235,0.07), transparent)' }}>
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-6"
            style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--primary)' }}
          >
            Växjö
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight leading-tight">
            Jämför körskolor<br />
            <span style={{ color: 'var(--primary)' }}>i Växjö</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--muted)' }}>
            Hitta det bästa priset för B-körkort, intensivkurser och handledarutbildning. Alltid uppdaterade priser.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--muted)' }}>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {schools.length} körskolor
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              {serviceTypes.length} tjänstetyper
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              {prices.length} priser
            </span>
          </div>
        </div>
      </section>

      {/* Price comparison with tabs */}
      <PriceComparison serviceTypes={serviceTypes} prices={prices} schools={schools} />

      {/* Map + school cards */}
      <MapSection schools={geocodedSchools} />

      {/* Floating AI chat */}
      <ChatWidget />
    </main>
  )
}
