'use client'
import { useState, useEffect, useCallback } from 'react'
import StarRating from '@/components/StarRating'
import CityBadge from '@/components/CityBadge'
import type { School, ServiceType, PriceWithDetails, SchoolRating } from '@/lib/types'

type Props = {
  serviceTypes: ServiceType[]
  prices: PriceWithDetails[]
  schools: School[]
  cityFilter: string
  onCityChange: (city: string) => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function PriceComparison({ serviceTypes, prices, schools, cityFilter, onCityChange }: Props) {
  const [activeTab, setActiveTab] = useState(serviceTypes[0]?.id ?? '')
  const [cheapestOnly, setCheapestOnly] = useState(false)
  const [ratings, setRatings] = useState<SchoolRating[]>([])
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  const [shareLabel, setShareLabel] = useState('Dela')

  // Derive sorted unique cities from schools
  const cities = ['all', ...Array.from(new Set(schools.map(s => s.city).filter(Boolean))).sort()]

  // Sync initial tab from URL
  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab')
    if (tab && serviceTypes.find(s => s.id === tab)) setActiveTab(tab)
  }, [serviceTypes])

  // Load ratings
  useEffect(() => {
    fetch('/api/ratings').then(r => r.json()).then(setRatings).catch(() => {})
  }, [])

  // Load user's own ratings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('korkollen_ratings')
      if (stored) setUserRatings(JSON.parse(stored))
    } catch {}
  }, [])

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id)
    setCheapestOnly(false)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', id)
    window.history.replaceState({}, '', url.toString())
  }, [])

  const handleRate = useCallback(async (schoolId: string, stars: number) => {
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId, stars }),
      })
      setRatings(prev => {
        const existing = prev.find(r => r.school_id === schoolId)
        if (existing) {
          const newCount = existing.count + 1
          return prev.map(r =>
            r.school_id === schoolId
              ? { ...r, avg: (r.avg * r.count + stars) / newCount, count: newCount }
              : r
          )
        }
        return [...prev, { school_id: schoolId, avg: stars, count: 1 }]
      })
      const updated = { ...userRatings, [schoolId]: stars }
      setUserRatings(updated)
      localStorage.setItem('korkollen_ratings', JSON.stringify(updated))
    } catch {}
  }, [userRatings])

  const handleShare = useCallback(async () => {
    const url = new URL(window.location.href)
    url.searchParams.set('tab', activeTab)
    const shareUrl = url.toString()
    const label = serviceTypes.find(s => s.id === activeTab)?.label ?? 'körskolor'
    const text = `Jämför priser på ${label} i Växjö – Körkollen`

    if (navigator.share) {
      try { await navigator.share({ title: text, url: shareUrl }); return } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareLabel('Kopierad! ✓')
      setTimeout(() => setShareLabel('Dela'), 2000)
    } catch {}
  }, [activeTab, serviceTypes])

  // Filter schools by city
  const visibleSchools = cityFilter === 'all'
    ? schools
    : schools.filter(s => s.city === cityFilter)

  // Build rows: each visible school paired with its price for the active tab (or null)
  const pricesForTab = prices.filter(p => p.service_type_id === activeTab)

  const rows = visibleSchools
    .map(school => ({
      school,
      price: pricesForTab.find(p => p.school_id === school.id) ?? null,
    }))
    .sort((a, b) => {
      if (!a.price && b.price) return 1
      if (a.price && !b.price) return -1
      if (!a.price || !b.price) return 0
      return a.price.amount_sek - b.price.amount_sek
    })

  const rowsWithPrice = rows.filter(r => r.price !== null)
  const cheapestPrice = rowsWithPrice[0]?.price ?? null
  const mostExpensivePrice = rowsWithPrice[rowsWithPrice.length - 1]?.price ?? null
  const savings = cheapestPrice && mostExpensivePrice && rowsWithPrice.length > 1
    ? mostExpensivePrice.amount_sek - cheapestPrice.amount_sek
    : null

  const displayed = cheapestOnly ? rowsWithPrice.slice(0, 1) : rows
  const activeService = serviceTypes.find(s => s.id === activeTab)

  // Medal index only counts rows with prices
  let medalIdx = 0

  return (
    <section id="priser" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Prisjämförelse</h2>
            <p style={{ color: 'var(--muted)' }}>Sorterat från lägsta till högsta pris</p>
          </div>
          <button
            onClick={handleShare}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
            style={{ borderColor: 'var(--card-border)', color: 'var(--muted)', background: 'var(--card)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {shareLabel}
          </button>
        </div>

        {/* Service type tabs + Billigaste toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2 p-1 rounded-xl" style={{ background: 'var(--muted-bg)' }}>
            {serviceTypes.map(service => (
              <button
                key={service.id}
                onClick={() => handleTabChange(service.id)}
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

          <button
            onClick={() => setCheapestOnly(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={
              cheapestOnly
                ? { background: 'var(--primary)', color: '#fff' }
                : { background: 'var(--muted-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }
            }
          >
            ⚡ {cheapestOnly ? 'Visa alla' : 'Billigaste'}
          </button>
        </div>

        {/* City filter */}
        {cities.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => { onCityChange(city); setCheapestOnly(false) }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={
                  cityFilter === city
                    ? { background: 'var(--primary)', color: '#fff' }
                    : { background: 'var(--muted-bg)', color: 'var(--muted)', border: '1px solid var(--card-border)' }
                }
              >
                {city === 'all' ? 'Alla orter' : city}
              </button>
            ))}
          </div>
        )}

        {/* Savings banner */}
        {savings !== null && savings > 0 && !cheapestOnly && (
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
        {displayed.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{ color: 'var(--muted)', background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            Inga skolor eller priser hittades.
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(({ school, price }) => {
              const isLowest = price !== null && price.amount_sek === cheapestPrice?.amount_sek
              const currentMedalIdx = price !== null ? medalIdx++ : -1
              const rating = ratings.find(r => r.school_id === school.id)
              const userRated = userRatings[school.id] ?? null

              return (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md"
                  style={
                    isLowest
                      ? { background: 'var(--card)', border: '1.5px solid var(--primary)', boxShadow: 'var(--shadow-md)' }
                      : { background: 'var(--card)', borderColor: 'var(--card-border)' }
                  }
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl w-8 text-center select-none">
                      {price !== null
                        ? (MEDALS[currentMedalIdx] ?? <span className="text-sm font-bold" style={{ color: 'var(--muted)' }}>{currentMedalIdx + 1}</span>)
                        : <span className="text-sm" style={{ color: 'var(--muted)' }}>—</span>
                      }
                    </span>
                    <div>
                      <p className="font-semibold">{school.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        <CityBadge city={school.city} />
                      </p>
                      {price !== null && (
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
                      )}
                      <StarRating
                        schoolId={school.id}
                        avg={rating?.avg ?? 0}
                        count={rating?.count ?? 0}
                        userRated={userRated}
                        onRate={handleRate}
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    {price !== null ? (
                      <>
                        <p
                          className="text-2xl font-bold tabular-nums"
                          style={{ color: isLowest ? 'var(--success)' : 'var(--foreground)' }}
                        >
                          {price.amount_sek.toLocaleString('sv-SE')} kr
                        </p>
                        {isLowest && (
                          <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                            Bästa priset
                          </span>
                        )}
                      </>
                    ) : (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--muted-bg)', color: 'var(--muted)' }}
                      >
                        Priser saknas
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
