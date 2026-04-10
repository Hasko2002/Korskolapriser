'use client'
import { useState } from 'react'

/**
 * StarRating — visar snittbetyg och låter användaren rösta
 *
 * Props:
 *   schoolId  – string, Supabase school id
 *   avg       – number, snittbetyg (0 om inga betyg)
 *   count     – number, antal betyg
 *   userRated – number | null, stjärnor användaren redan röstat (null = ej röstat)
 *   onRate    – (schoolId, stars) => void, callback när användaren röstar
 */
export default function StarRating({ schoolId, avg, count, userRated, onRate }) {
  const [hover, setHover] = useState(0)
  const filled = hover || userRated || Math.round(avg)
  const voted = !!userRated

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          disabled={voted}
          onClick={() => onRate(schoolId, s)}
          onMouseEnter={() => !voted && setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="text-base leading-none transition-colors disabled:cursor-default"
          style={{ color: s <= filled ? '#f59e0b' : 'var(--card-border)' }}
          aria-label={`Sätt ${s} stjärnor`}
        >
          ★
        </button>
      ))}
      <span className="text-xs ml-1.5 select-none" style={{ color: 'var(--muted)' }}>
        {voted
          ? 'Tack!'
          : count > 0
          ? `${avg.toFixed(1)} (${count} betyg)`
          : 'Betygsätt'}
      </span>
    </div>
  )
}
