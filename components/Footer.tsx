import Logo from '@/components/Logo'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t mt-16" style={{ borderColor: 'var(--card-border)', background: 'var(--card)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo width="170" textFill="var(--foreground)" />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {year} Körkollen · Priser kan variera, kontakta skolan för aktuella uppgifter
          </p>
        </div>
      </div>
    </footer>
  )
}
