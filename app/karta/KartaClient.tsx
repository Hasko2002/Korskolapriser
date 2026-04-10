'use client'
import { useState } from 'react'
import KronobergMap from '@/components/KronobergMap'
import CityBadge from '@/components/CityBadge'
import type { School } from '@/lib/types'

export default function KartaClient({ schools }: { schools: School[] }) {
  const [cityFilter, setCityFilter] = useState('all')

  const visibleSchools = cityFilter === 'all'
    ? schools
    : schools.filter(s => s.city === cityFilter)

  return (
    <main>
      <KronobergMap
        schools={schools}
        cityFilter={cityFilter}
        onCityChange={setCityFilter}
      />

      {/* School list filtered by map */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--muted)' }}>
            {visibleSchools.length} skola{visibleSchools.length !== 1 ? 'r' : ''} visas
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {visibleSchools.map(school => (
              <div
                key={school.id}
                className="p-4 rounded-2xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
              >
                <p className="font-semibold">{school.name}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  <CityBadge city={school.city} />
                </p>
                {school.address && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{school.address}</p>
                )}
                {school.website && (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mt-2 inline-block"
                    style={{ color: 'var(--primary)' }}
                  >
                    Besök hemsida →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
