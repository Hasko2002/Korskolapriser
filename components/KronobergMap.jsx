'use client'
import { useState } from 'react'

// Approximate SVG polygons for Kronobergs län municipalities
// viewBox: 0 0 400 460
const MUNICIPALITIES = [
  {
    id: 'vaxjo', name: 'Växjö', city: 'Växjö',
    path: 'M 155,148 L 248,130 L 302,168 L 316,254 L 274,292 L 200,312 L 155,268 Z',
    cx: 228, cy: 218,
  },
  {
    id: 'ljungby', name: 'Ljungby', city: 'Ljungby',
    path: 'M 10,10 L 208,10 L 210,65 L 196,145 L 155,148 L 155,268 L 80,268 L 22,238 L 10,175 Z',
    cx: 100, cy: 125,
  },
  {
    id: 'uppvidinge', name: 'Uppvidinge', city: 'Uppvidinge',
    path: 'M 210,10 L 390,10 L 390,188 L 302,168 L 248,130 L 210,65 Z',
    cx: 308, cy: 88,
  },
  {
    id: 'alvesta', name: 'Alvesta', city: 'Alvesta',
    path: 'M 22,238 L 80,268 L 155,268 L 148,328 L 78,338 L 22,308 Z',
    cx: 88, cy: 292,
  },
  {
    id: 'lessebo', name: 'Lessebo', city: 'Lessebo',
    path: 'M 302,168 L 390,188 L 390,298 L 340,302 L 316,254 Z',
    cx: 353, cy: 238,
  },
  {
    id: 'tingsryd', name: 'Tingsryd', city: 'Tingsryd',
    path: 'M 316,254 L 340,302 L 390,298 L 390,450 L 282,450 L 252,380 L 274,292 Z',
    cx: 340, cy: 368,
  },
  {
    id: 'almhult', name: 'Älmhult', city: 'Älmhult',
    path: 'M 78,338 L 148,328 L 200,312 L 252,380 L 228,450 L 100,450 L 78,388 Z',
    cx: 162, cy: 393,
  },
  {
    id: 'markaryd', name: 'Markaryd', city: 'Markaryd',
    path: 'M 10,175 L 22,238 L 22,308 L 78,338 L 78,388 L 100,450 L 10,450 Z',
    cx: 42, cy: 352,
  },
]

export default function KronobergMap({ schools, cityFilter, onCityChange }) {
  const [hovered, setHovered] = useState(null)

  // Count schools per city
  const countByCity = {}
  for (const s of schools) {
    if (s.city) countByCity[s.city] = (countByCity[s.city] || 0) + 1
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10 flex items-center gap-5">
          <img
            src="/logos/Kronobergs_läns_vapen.svg"
            alt="Kronobergs läns vapen"
            width={56}
            height={56}
            className="shrink-0 object-contain"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Trafikskolor i Kronoberg</h2>
            <p style={{ color: 'var(--muted)' }}>Visar de trafikskolor som finns i Kronobergs län. Klicka på en kommun för att filtrera.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-start">

          {/* SVG Map */}
          <div className="w-full sm:w-auto sm:flex-1 max-w-sm mx-auto sm:mx-0">
            <svg viewBox="0 0 400 460" className="w-full h-auto">
              {MUNICIPALITIES.map(m => {
                const count = countByCity[m.city] || 0
                const isActive = cityFilter === m.city
                const isHovered = hovered === m.id
                const clickable = count > 0

                let fill
                if (isActive) fill = 'var(--primary)'
                else if (isHovered && clickable) fill = 'var(--primary-light)'
                else if (clickable) fill = 'var(--card)'
                else fill = 'var(--muted-bg)'

                return (
                  <g key={m.id}>
                    <path
                      d={m.path}
                      fill={fill}
                      stroke="var(--card-border)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      style={{
                        cursor: clickable ? 'pointer' : 'default',
                        transition: 'fill 0.15s',
                      }}
                      onClick={() => clickable && onCityChange(isActive ? 'all' : m.city)}
                      onMouseEnter={() => clickable && setHovered(m.id)}
                      onMouseLeave={() => setHovered(null)}
                    />

                    {/* Municipality label */}
                    <text
                      x={m.cx}
                      y={m.cy}
                      textAnchor="middle"
                      fontSize={m.id === 'uppvidinge' || m.id === 'markaryd' ? '10' : '11'}
                      fontWeight={isActive ? '700' : '500'}
                      fill={isActive ? '#fff' : 'var(--foreground)'}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {m.name}
                    </text>

                    {/* School count badge */}
                    {count > 0 && (
                      <>
                        <circle
                          cx={m.cx}
                          cy={m.cy + 14}
                          r="9"
                          fill={isActive ? 'rgba(255,255,255,0.25)' : 'var(--primary)'}
                        />
                        <text
                          x={m.cx}
                          y={m.cy + 18}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="700"
                          fill={isActive ? '#fff' : '#fff'}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {count}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Sidebar legend */}
          <div className="flex flex-col gap-2 sm:pt-2 w-full sm:w-48 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
              Filtrera efter ort
            </p>

            <button
              onClick={() => onCityChange('all')}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                cityFilter === 'all'
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { background: 'var(--muted-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }
              }
            >
              Alla orter
            </button>

            {MUNICIPALITIES.filter(m => (countByCity[m.city] || 0) > 0).map(m => (
              <button
                key={m.id}
                onClick={() => onCityChange(cityFilter === m.city ? 'all' : m.city)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  cityFilter === m.city
                    ? { background: 'var(--primary)', color: '#fff' }
                    : { background: 'var(--muted-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }
                }
              >
                <span>{m.name}</span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full ml-2"
                  style={
                    cityFilter === m.city
                      ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
                      : { background: 'var(--primary-light)', color: 'var(--primary)' }
                  }
                >
                  {countByCity[m.city]}
                </span>
              </button>
            ))}

            {/* No-schools municipalities note */}
            {MUNICIPALITIES.some(m => !countByCity[m.city]) && (
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                Gråa kommuner saknar registrerade skolor.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
