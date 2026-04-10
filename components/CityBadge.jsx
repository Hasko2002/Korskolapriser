const CITY_LOGOS = {
  'Växjö':    '/logos/Växjö_vapen.svg',
  'Ljungby':  '/logos/Ljungby_vapen.svg',
  'Älmhult':  '/logos/Älmhult_vapen.svg',
  'Alvesta':  '/logos/Alvesta_vapen.svg',
  'Markaryd': '/logos/Markaryd_vapen.svg',
}

export default function CityBadge({ city }) {
  if (!city) return null
  const logo = CITY_LOGOS[city]
  return (
    <span className="inline-flex items-center gap-1.5">
      {logo && (
        <img
          src={logo}
          alt=""
          width={20}
          height={20}
          className="object-contain shrink-0"
          style={{ opacity: 0.85 }}
        />
      )}
      <span>{city}</span>
    </span>
  )
}
