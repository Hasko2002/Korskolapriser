'use client'
import { useState } from 'react'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

type Props = {
  serviceTypes: ServiceType[]
  prices: PriceWithDetails[]
  schools: School[]
}

export default function PriceComparison({ serviceTypes, prices }: Props) {
  const [activeTab, setActiveTab] = useState(serviceTypes[0]?.id ?? '')

  const filteredPrices = prices
    .filter(p => p.service_type_id === activeTab)
    .sort((a, b) => a.amount_sek - b.amount_sek)

  const activeService = serviceTypes.find(s => s.id === activeTab)

  return (
    <section id="priser" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Jämför priser</h2>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Sorterat från lägsta till högsta pris</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {serviceTypes.map(service => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={
                activeTab === service.id
                  ? { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }
                  : { background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--muted)' }
              }
            >
              {service.label}
            </button>
          ))}
        </div>

        {/* Description */}
        {activeService?.description && (
          <p className="text-sm mb-6 italic" style={{ color: 'var(--muted)' }}>
            {activeService.description}
          </p>
        )}

        {/* Price cards */}
        {filteredPrices.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ color: 'var(--muted)', background: 'var(--card)' }}>
            <p className="text-lg">Inga priser tillgängliga för denna tjänst.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredPrices.map((price, index) => (
              <div
                key={price.id}
                className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md"
                style={
                  index === 0
                    ? { border: '1.5px solid #22c55e', background: 'rgba(34,197,94,0.05)' }
                    : { background: 'var(--card)', border: '1px solid var(--card-border)' }
                }
              >
                <div className="flex items-center gap-4">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={
                      index === 0
                        ? { background: '#22c55e', color: '#fff' }
                        : { background: 'var(--muted-bg)', color: 'var(--muted)', border: '1px solid var(--card-border)' }
                    }
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{price.school.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {price.lesson_minutes > 0 && (
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {price.lesson_minutes} min/lektion
                        </span>
                      )}
                      {price.notes && (
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>{price.notes}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                    {price.amount_sek.toLocaleString('sv-SE')} kr
                  </p>
                  {index === 0 && (
                    <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                      Lägsta priset ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
