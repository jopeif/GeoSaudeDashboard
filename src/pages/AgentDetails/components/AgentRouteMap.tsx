// src/components/maps/AgentRouteMap.tsx

import { useEffect } from 'react';

import {
    MapContainer,
    TileLayer,
    Polyline,
    CircleMarker,
    Popup,
    useMap,
    LayersControl
} from 'react-leaflet';

import { useNavigate } from 'react-router-dom';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import {
    Calendar,
    Siren
} from 'lucide-react';

import { useTheme } from '../../../contexts/ThemeContext';

import './AgentRouteMap.css';

interface RoutePoint {
    visitId: string;

    lat: number;
    lng: number;

    visitDate: string;

    hasFocus: boolean;
}

interface AgentRouteMapProps {
    points: RoutePoint[];
}

/* ========================================
   MAP CONTROLLER
======================================== */

const MapController = ({
    points
}: {
    points: RoutePoint[];
}) => {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        const container = map.getContainer();
        let observer: ResizeObserver | null = null;

        if (typeof ResizeObserver !== 'undefined' && container) {
            observer = new ResizeObserver(() => {
                map.invalidateSize();
            });
            observer.observe(container);
        }

        if (points.length > 0) {
            const bounds = L.latLngBounds(
                points.map((p) => [
                    p.lat,
                    p.lng
                ])
            );

            map.fitBounds(bounds, {
                padding: [50, 50]
            });
        }

        return () => {
            clearTimeout(timer);
            if (observer && container) {
                observer.unobserve(container);
                observer.disconnect();
            }
        };
    }, [map, points]);

    return null;
};

/* ========================================
   COMPONENT
======================================== */

export const AgentRouteMap = ({
    points
}: AgentRouteMapProps) => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const sortedPoints = [...points].sort(
        (a, b) =>
            new Date(a.visitDate).getTime() -
            new Date(b.visitDate).getTime()
    );

    const polylinePositions = sortedPoints.map(
        (p) =>
            [p.lat, p.lng] as [
                number,
                number
            ]
    );

    return (
        <div className="map-wrapper-container">
            <MapContainer
                key={isDark ? 'route-map-dark' : 'route-map-light'}
                center={[-5.1483, -38.0991]}
                zoom={14}
                className="leaflet-main-map"
            >
                <LayersControl position="topright">

                    {/* MAPA CLARO */}
                    <LayersControl.BaseLayer
                        checked={!isDark}
                        name="Mapa Claro"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            className="map-tiles-light"
                        />
                    </LayersControl.BaseLayer>

                    {/* MAPA ESCURO */}
                    <LayersControl.BaseLayer
                        checked={isDark}
                        name="Mapa Escuro"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            className="map-tiles-dark"
                        />
                    </LayersControl.BaseLayer>

                    {/* SATÉLITE */}
                    <LayersControl.BaseLayer
                        name="Satélite"
                    >
                        <TileLayer
                            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>

                    {/* HUMANITÁRIO */}
                    <LayersControl.BaseLayer
                        name="Humanitário"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.hotosm.org/">HOT</a>'
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            className="map-tiles-light"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* ROUTE LINE */}
                <Polyline
                    positions={polylinePositions}
                    pathOptions={{
                        color: '#469472',
                        weight: 4,
                        opacity: 0.65,
                        dashArray: '10, 10'
                    }}
                />

                {/* VISIT POINTS */}
                {sortedPoints.map(
                    (point, index) => (
                        <CircleMarker
                            key={index}
                            center={[
                                point.lat,
                                point.lng
                            ]}
                            radius={
                                point.hasFocus
                                    ? 8
                                    : 5
                            }
                            pathOptions={{
                                fillColor:
                                    point.hasFocus
                                        ? '#ef4444'
                                        : '#469472',

                                color: '#ffffff',

                                weight: 2,

                                fillOpacity: 0.95
                            }}
                        >
                            <Popup>
                                <button
                                    className="map-popup-card"
                                    onClick={() =>
                                        navigate(
                                            `/visit/${point.visitId}`
                                        )
                                    }
                                >
                                    <div className="popup-visit-title">
                                        <strong>
                                            Visita #
                                            {index + 1}
                                        </strong>
                                    </div>

                                    <div className="popup-info-row">
                                        <Calendar size={16} />

                                        <span>
                                            {new Date(
                                                point.visitDate
                                            ).toLocaleString(
                                                'pt-BR'
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        className={`popup-info-row popup-focus ${
                                            point.hasFocus
                                                ? 'alert'
                                                : 'safe'
                                        }`}
                                    >
                                        <Siren size={16} />

                                        <span>
                                            {point.hasFocus
                                                ? 'Foco encontrado'
                                                : 'Nenhum foco'}
                                        </span>
                                    </div>

                                    {/* <div className="popup-redirect">
                                        Ver detalhes da visita
                                    </div> */}
                                </button>
                            </Popup>
                        </CircleMarker>
                    )
                )}

                <MapController
                    points={sortedPoints}
                />
            </MapContainer>
        </div>
    );
};