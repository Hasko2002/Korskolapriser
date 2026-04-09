'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { GeocodedSchool } from '@/lib/geocode'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const VAXJO_CENTER: [number, number] = [56.8777, 14.8094]

export default function MapClient({ schools }: { schools: GeocodedSchool[] }) {
  const schoolsWithCoords = schools.filter(s => s.coords)

  return (
    <MapContainer
      center={VAXJO_CENTER}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '420px', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {schoolsWithCoords.map(school => (
        <Marker key={school.id} position={school.coords!} icon={markerIcon}>
          <Popup>
            <div className="text-sm min-w-[160px]">
              <p className="font-bold mb-1">{school.name}</p>
              <p className="text-gray-500 text-xs mb-2">{school.address}</p>
              {school.phone && (
                <p className="text-xs">📞 <a href={`tel:${school.phone}`} className="text-blue-600">{school.phone}</a></p>
              )}
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs mt-1 inline-block"
                >
                  Besök hemsida →
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
