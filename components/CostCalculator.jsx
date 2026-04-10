'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const SLUG_LABELS = {
  korlektioner_styck: 'Körlektioner',
  riskettan:          'Riskettan',
  risktvaan:          'Risktvåan',
  teoripaket:         'Teoripaket',
  handledarkurs:      'Handledarkurs',
}

const ALWAYS_INCLUDED = ['korlektioner_styck', 'riskettan', 'risktvaan']
const OPTIONAL         = ['teoripaket', 'handledarkurs']

export default function CostCalculator({ schools }) {
  const [schoolId, setSchoolId]     = useState(schools[0]?.id ?? '')
  const [lessons, setLessons]       = useState(15)
  const [checked, setChecked]       = useState({ teoripaket: true, handledarkurs: true })
  const [prices, setPrices]         = useState({})   // slug → amount_sek
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    if (!schoolId) return
    setLoading(true)
    supabase
      .from('prices')
      .select('amount_sek, service_type:service_types(slug)')
      .eq('school_id', schoolId)
      .then(({ data }) => {
        const map = {}
        for (const row of data ?? []) {
          if (row.service_type?.slug) map[row.service_type.slug] = row.amount_sek
        }
        setPrices(map)
        setLoading(false)
      })
  }, [schoolId])

  // Breakdown rows
  const lessonUnit = prices['korlektioner_styck'] ?? null
  const rows = []

  if (lessonUnit !== null) {
    rows.push({
      slug:  'korlektioner_styck',
      label: `${lessons} körlektioner`,
      price: lessons * lessonUnit,
      note:  `${lessonUnit.toLocaleString('sv-SE')} kr/st`,
    })
  }

  for (const slug of ['riskettan', 'risktvaan']) {
    if (prices[slug] != null) {
      rows.push({ slug, label: SLUG_LABELS[slug], price: prices[slug] })
    }
  }

  for (const slug of OPTIONAL) {
    if (checked[slug] && prices[slug] != null) {
      rows.push({ slug, label: SLUG_LABELS[slug], price: prices[slug] })
    }
  }

  const total = rows.reduce((s, r) => s + r.price, 0)

  // Savings: compare 15 lektioner styckkpris vs eventuellt paket
  const packagePrice = prices['korlektioner_paket'] ?? null
  const lessonCost   = lessonUnit !== null ? lessons * lessonUnit : 0
  const savings      = packagePrice !== null && lessonCost > packagePrice
    ? lessonCost - packagePrice
    : null

  const selectedSchool = schools.find(s => s.id === schoolId)
  const hasPrices = Object.keys(prices).length > 0

  return (
    <section id="kalkylator" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Kostnadskalkylator</h2>
          <p style={{ color: 'var(--muted)' }}>
            Beräkna vad ditt körkort kostar — anpassat efter dina val
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">

          {/* Controls */}
          <div
            className="rounded-2xl p-6 border space-y-6"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            {/* School selector */}
            <div>
              <label className="block text-sm font-semibold mb-2">Körskola</label>
              <select
                value={schoolId}
                onChange={e => setSchoolId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors"
                style={{
                  background: 'var(--muted-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--foreground)',
                }}
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Lessons slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-semibold">Antal körlektioner</label>
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: 'var(--primary)' }}
                >
                  {lessons}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={lessons}
                onChange={e => setLessons(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
                <span>1</span>
                <span>Snitt ~20</span>
                <span>40</span>
              </div>
            </div>

            {/* Optional checkboxes */}
            <div>
              <p className="text-sm font-semibold mb-3">Valfria delar</p>
              <div className="space-y-2.5">
                {/* Always-included pills */}
                {['riskettan', 'risktvaan'].map(slug => (
                  <div
                    key={slug}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--muted-bg)' }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded flex items-center justify-center"
                        style={{ background: 'var(--primary)' }}
                      >
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{SLUG_LABELS[slug]}</span>
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Obligatorisk</span>
                  </div>
                ))}

                {/* Optional toggles */}
                {OPTIONAL.map(slug => (
                  <label
                    key={slug}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background: 'var(--muted-bg)' }}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked[slug]}
                        onChange={() => setChecked(prev => ({ ...prev, [slug]: !prev[slug] }))}
                        className="w-4 h-4 rounded accent-[var(--primary)]"
                      />
                      <span>{SLUG_LABELS[slug]}</span>
                    </span>
                    {prices[slug] != null && (
                      <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                        {prices[slug].toLocaleString('sv-SE')} kr
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col gap-4">

            {/* Total */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>
                {selectedSchool?.name} · Uppskattat pris
              </p>
              {loading ? (
                <div className="h-12 w-40 rounded-lg animate-pulse" style={{ background: 'var(--muted-bg)' }} />
              ) : !hasPrices ? (
                <p className="text-lg" style={{ color: 'var(--muted)' }}>Inga priser tillgängliga</p>
              ) : (
                <>
                  <p className="text-5xl font-bold tabular-nums tracking-tight" style={{ color: 'var(--primary)' }}>
                    {total.toLocaleString('sv-SE')}
                    <span className="text-2xl font-semibold ml-1">kr</span>
                  </p>
                  {savings !== null && (
                    <p className="mt-2 text-sm font-medium" style={{ color: 'var(--success)' }}>
                      Du sparar {savings.toLocaleString('sv-SE')} kr med paketpris
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Breakdown */}
            {hasPrices && !loading && (
              <div
                className="rounded-2xl p-5 border flex-1"
                style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
              >
                <p className="text-sm font-semibold mb-3">Specificering</p>
                <div className="space-y-2">
                  {rows.map(row => (
                    <div key={row.slug} className="flex items-baseline justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>
                        {row.label}
                        {row.note && (
                          <span className="text-xs ml-1.5">({row.note})</span>
                        )}
                      </span>
                      <span className="font-medium tabular-nums ml-4 shrink-0">
                        {row.price.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex justify-between items-baseline mt-4 pt-4 border-t font-semibold"
                  style={{ borderColor: 'var(--card-border)' }}
                >
                  <span>Totalt</span>
                  <span className="tabular-nums" style={{ color: 'var(--primary)' }}>
                    {total.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
                  * Uppskattning baserat på tillgängliga priser. Kontakta skolan för exakt offert.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
