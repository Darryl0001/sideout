import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Location } from '@/types';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -38],
  shadowSize: [46, 46],
});

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.flyTo(center, zoom, { animate: true, duration: 0.7 });
  return null;
}

interface CourtMapProps {
  courts: Location[];
  selectedCourt: Location | null;
  mapCenter: [number, number];
  mapZoom: number;
  onSelectCourt: (court: Location) => void;
  getMatchCount: (courtId: string) => number;
}

export function CourtMap({
  courts,
  selectedCourt,
  mapCenter,
  mapZoom,
  onSelectCourt,
  getMatchCount,
}: CourtMapProps) {
  return (
    <div className="relative min-h-[500px] lg:min-h-[620px]">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom
        doubleClickZoom
        className="z-0 h-full min-h-[500px] w-full lg:min-h-[620px]"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {courts.map((court) => {
          const isSelected = selectedCourt?.id === court.id;

          return (
            <Marker
              key={court.id}
              position={[court.latitude, court.longitude]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{ click: () => onSelectCourt(court) }}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <p className="text-sm font-semibold">{court.name}</p>
                  {court.address && (
                    <p className="mt-1 text-xs text-gray-500">{court.address}</p>
                  )}
                  <p className="mt-2 text-xs">
                    {getMatchCount(court.id)} matches recorded
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}