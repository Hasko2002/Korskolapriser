export const revalidate = 3600 // Bygg om sidan var 1:e timme

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

  const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.amount_sek)) : null
  const highestPrice = prices.length > 0 ? Math.max(...prices.map(p => p.amount_sek)) : null

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, var(--primary-light), transparent)',
          }}
        />
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wider"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Alltid uppdaterat · Växjö
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Hitta rätt körskola<br />
            <span style={{ color: 'var(--primary)' }}>till rätt pris</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12" style={{ color: 'var(--muted)' }}>
            Jämför priser på B-körkort, intensivkurser och handledarutbildning från alla körskolor i Växjö — på ett ställe.
          </p>

          {/* Stats */}
          <div className="inline-flex flex-wrap justify-center gap-px rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-border)' }}>
            {[
              { label: 'Körskolor', value: schools.length },
              { label: 'Tjänster', value: serviceTypes.length },
              ...(lowestPrice && highestPrice ? [{ label: 'Lägsta pris', value: `${lowestPrice.toLocaleString('sv-SE')} kr` }] : []),
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-4" style={{ background: 'var(--card)' }}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#priser"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--primary)' }}
            >
              Jämför priser nu
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Price comparison */}
      <PriceComparison serviceTypes={serviceTypes} prices={prices} schools={schools} />

      {/* Map */}
      <MapSection schools={geocodedSchools} />

      {/* AI Chat */}
      <ChatWidget />
    </main>
  )
}
