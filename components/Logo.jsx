export default function Logo({ width = '100%', textFill = '#1a1a2e' }) {
  return (
    <svg width={width} viewBox="0 0 680 200" role="img" aria-label="Körkollen logotyp">
      <defs>
        <clipPath id="circle-clip">
          <circle cx="100" cy="100" r="72" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="72" fill="#1a1a2e" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="#3B8BD4" strokeWidth="5" />
      <polygon points="100,48 130,140 70,140" fill="#3B8BD4" opacity="0.15" clipPath="url(#circle-clip)" />
      <line x1="100" y1="56" x2="100" y2="76" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="84" x2="100" y2="100" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="108" x2="100" y2="120" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <polygon points="100,48 138,148 62,148" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" opacity="0.25" clipPath="url(#circle-clip)" />
      <path d="M78,98 L93,113 L122,82" fill="none" stroke="#3BD48B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="192" y="88" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="52" fill={textFill} letterSpacing="-1">
        Kör<tspan fill="#3B8BD4">kollen</tspan>
      </text>
      <text x="194" y="122" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="18" fill="#888780" letterSpacing="1">
        Jämför körskolor i Växjö
      </text>
      <rect x="192" y="132" width="120" height="3" rx="1.5" fill="#3B8BD4" opacity="0.5" />
    </svg>
  )
}
