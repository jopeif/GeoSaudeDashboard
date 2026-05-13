import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./AgentRouteMap.css"
import { Calendar, Siren } from 'lucide-react';

interface RoutePoint {
    lat: number;
    lng: number;
    visitDate: string;
    hasFocus: boolean;
}

interface AgentRouteMapProps {
    points: RoutePoint[];
}

// Componente para ajustar o zoom e o tamanho do mapa automaticamente
const MapController = ({ points }: { points: RoutePoint[] }) => {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 250);
        if (points.length > 0) {
            const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, points]);

    return null;
};

export const AgentRouteMap = ({ points }: AgentRouteMapProps) => {
    // Ordena os pontos por data para garantir que a linha siga a ordem cronológica
    const sortedPoints = [...points].sort((a, b) => 
        new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
    );

    const polylinePositions = sortedPoints.map(p => [p.lat, p.lng] as [number, number]);

    return (
        <div className="map-wrapper-container" style={{ height: '500px', marginTop: '20px' }}>
            <MapContainer 
                center={[-5.1483, -38.0991]} 
                zoom={14} 
                className="leaflet-main-map"
            >
                <LayersControl position="topright">
                {/* Opção 1: Minimalista Claro (Padrão) */}
                <LayersControl.BaseLayer checked name="Mapa Claro">
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                </LayersControl.BaseLayer>

                {/* Opção 2: Minimalista Escuro */}
                <LayersControl.BaseLayer name="Mapa Escuro">
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                </LayersControl.BaseLayer>

                {/* Opção 3: Satélite (Útil para ver terrenos baldios) */}
                <LayersControl.BaseLayer name="Satélite">
                <TileLayer
                    attribution='&copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                </LayersControl.BaseLayer>

                {/* Opção 4: Padrão (OpenStreetMap) */}
                <LayersControl.BaseLayer name="Padrão">
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                </LayersControl.BaseLayer>
            </LayersControl>

                {/* Linha da Rota */}
                <Polyline 
                    positions={polylinePositions} 
                    pathOptions={{ color: '#469472', weight: 3, opacity: 0.6, dashArray: '10, 10' }} 
                />

                {/* Pontos de Visita */}
                {sortedPoints.map((point, index) => (
                    <CircleMarker
                        key={index}
                        center={[point.lat, point.lng]}
                        radius={point.hasFocus ? 8 : 5}
                        pathOptions={{
                            fillColor: point.hasFocus ? '#ef4444' : '#469472',
                            color: '#fff',
                            weight: 2,
                            fillOpacity: 0.9
                        }}
                    >
                        <Popup>
                            <div style={{ fontSize: '12px' }}>
                                <strong>Visita #{index + 1}</strong><br />
                                <Calendar size={22}/> {new Date(point.visitDate).toLocaleString('pt-BR')}<br />
                                <Siren size={22}/> {point.hasFocus ? 'Foco Encontrado' : 'Nenhum foco'}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                <MapController points={sortedPoints} />
            </MapContainer>
        </div>
    );
};