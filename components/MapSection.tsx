import dynamic from 'next/dynamic'
import type { School } from '@/lib/types'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: '420px', borderRadius: '1rem', background: 'var(--muted-bg)', animation: 'pulse 2s infinite' }}
      className="w-full"
    />
  ),
})

export default function MapSection({ schools }: { schools: School[] }) {
  return (
    <section id="karta" className="py-16 px-4" style={{ background: 'var(--muted-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Karta</h2>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Körskolor i Växjö</p>

        <MapClient schools={schools} />

        {/* School cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {schools.map(school => (
            <div
              key={school.id}
              className="p-5 rounded-2xl border"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <p className="font-semibold text-base mb-1">{school.name}</p>
              <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{school.address}, {school.city}</p>

              <div className="space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
                {school.phone && (
                  <p>📞 <a href={`tel:${school.phone}`} className="hover:underline">{school.phone}</a></p>
                )}
                {school.email && (
                  <p>✉️ <a href={`mailto:${school.email}`} className="hover:underline">{school.email}</a></p>
                )}
              </div>

              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium"
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
  )
}
