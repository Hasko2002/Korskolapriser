'use client'
import { useState } from 'react'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

type Props = {
  serviceTypes: ServiceType[]
  prices: PriceWithDetails[]
  schools: School[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function PriceComparison({ serviceTypes, prices }: Props) {
  const [activeTab, setActiveTab] = useState(serviceTypes[0]?.id ?? '')

  const filteredPrices = prices
    .filter(p => p.service_type_id === activeTab)
    .sort((a, b) => a.amount_sek - b.amount_sek)

  const activeService = serviceTypes.find(s => s.id === activeTab)
  const cheapest = filteredPrices[0]
  const mostExpensive = filteredPrices[filteredPrices.length - 1]
  const savings = cheapest && mostExpensive && filteredPrices.length > 1
    ? mostExpensive.amount_sek - cheapest.amount_sek
    : null

  return (
    <section id="priser" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Prisjämförelse</h2>
          <p style={{ color: 'var(--muted)' }}>Sorterat från lägsta till högsta pris</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-xl w-fit" style={{ background: 'var(--muted-bg)' }}>
          {serviceTypes.map(service => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === service.id
                  ? { background: 'var(--card)', color: 'var(--foreground)', boxShadow: 'var(--shadow)' }
                  : { color: 'var(--muted)', background: 'transparent' }
              }
            >
              {service.label}
            </button>
          ))}
        </div>

        {/* Savings banner */}
        {savings !== null && savings > 0 && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-6 text-sm"
            style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <span className="text-xl">💡</span>
            <p>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>
                Spara upp till {savings.toLocaleString('sv-SE')} kr
              </span>
              <span style={{ color: 'var(--muted)' }}> genom att välja billigaste skolan</span>
            </p>
          </div>
        )}

        {/* Description */}
        {activeService?.description && (
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>{activeService.description}</p>
        )}

        {/* Price list */}
        {filteredPrices.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{ color: 'var(--muted)', background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            Inga priser tillgängliga för denna tjänst.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPrices.map((price, index) => (
              <div
                key={price.id}
                className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md"
                style={
                  index === 0
                    ? { background: 'var(--card)', border: '1.5px solid var(--primary)', boxShadow: 'var(--shadow-md)' }
                    : { background: 'var(--card)', borderColor: 'var(--card-border)' }
                }
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center select-none">
                    {MEDALS[index] ?? <span className="text-sm font-bold" style={{ color: 'var(--muted)' }}>{index + 1}</span>}
                  </span>
                  <div>
                    <p className="font-semibold">{price.school.name}</p>
                    <div className="flex flex-wrap gap-3 mt-0.5">
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
                  <p className="text-2xl font-bold tabular-nums" style={{ color: index === 0 ? 'var(--primary)' : 'var(--foreground)' }}>
                    {price.amount_sek.toLocaleString('sv-SE')} kr
                  </p>
                  {index === 0 && (
                    <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                      Bästa priset
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
