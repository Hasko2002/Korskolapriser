export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t mt-16" style={{ borderColor: 'var(--card-border)', background: 'var(--card)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeWidth="1.5" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">
                Kör<span style={{ color: 'var(--primary)' }}>kollen</span>
              </p>
              <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--muted)' }}>
                Jämför körskolor i Växjö
              </p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {year} Körkollen · Priser kan variera, kontakta skolan för aktuella uppgifter
          </p>
        </div>
      </div>
    </footer>
  )
}
