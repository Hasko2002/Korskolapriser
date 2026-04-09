'use client'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--primary)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
              <path strokeLinecap="round" strokeWidth="1.5" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-base leading-none" style={{ color: 'var(--foreground)' }}>
              Kör<span style={{ color: 'var(--primary)' }}>kollen</span>
            </span>
            <span className="block text-xs leading-none" style={{ color: 'var(--muted)' }}>Växjö</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="#priser"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: 'var(--muted)' }}
          >
            Priser
          </Link>
          <Link
            href="#karta"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: 'var(--muted)' }}
          >
            Karta
          </Link>

          <div className="w-px h-5 mx-1" style={{ background: 'var(--card-border)' }} />

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--muted-bg)]"
              style={{ color: 'var(--muted)' }}
              aria-label="Byt tema"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
