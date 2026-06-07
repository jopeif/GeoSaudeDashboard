// src/pages/Heatmap/HeatmapPage.tsx

import {
    useEffect,
    useState,
    useCallback
} from 'react';

import {
    LayersControl,
    MapContainer,
    TileLayer,
    useMap
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

import {
    LoaderCircle
} from 'lucide-react';

import { dashboardService } from '../../services/Dashboard.service';
import { userService } from '../../services/User.service';

import type { UserDetails } from '../../types/user';
import type { DashboardFilters } from '../../types/dashboard';

import { HeatmapFilters } from './components/HeatmapFilters';

import './Heatmap.css';

/* ========================================
   HEATMAP LAYER
======================================== */

const HeatmapLayer = ({
    points
}: {
    points: any[]
}) => {

    const map = useMap();

    useEffect(() => {

        if (!map) return;

        setTimeout(() => {
            map.invalidateSize();
        }, 250);

        if (
            !points ||
            points.length === 0
        ) return;

        const heatPoints =
            points.map(
                (p)=>[
                    p.lat,
                    p.lng,
                    p.weight || 1
                ]
            );

        const heatLayer =
            (L as any).heatLayer(
                heatPoints,
                {
                    radius: 25,
                    blur: 15,
                    maxZoom: 17,
                    gradient: {
                        0.4: 'blue',
                        0.6: 'cyan',
                        0.7: 'lime',
                        0.8: 'yellow',
                        1.0: 'red'
                    }
                }
            ).addTo(map);

        return () => {
            map.removeLayer(
                heatLayer
            );
        };

    }, [map, points]);

    return null;
};

/* ========================================
   PAGE
======================================== */

export const HeatmapPage = () => {

    const [loading, setLoading] =
        useState(false);

    const [points, setPoints] =
        useState([]);

    const [agents, setAgents] =
        useState<UserDetails[]>([]);

    const initialFilters: DashboardFilters = {
        startDate: '',
        endDate: '',
        userId: '',
        localityCode: '',
        groupBy: 'day'
    };

    const [filters, setFilters] =
        useState<DashboardFilters>(
            initialFilters
        );

    /* ========================================
       LOAD AGENTS
    ======================================== */

    useEffect(() => {

        const loadAgents =
            async () => {

                const response =
                    await userService.findAll({page:1, limit:100});

                if (
                    response.success &&
                    response.users
                ) {

                    setAgents(
                        response.users
                    );

                }

            };

        loadAgents();

    }, []);

    /* ========================================
       FETCH HEATMAP
    ======================================== */

    const fetchHeatmapData =
        useCallback(
            async (
                params: DashboardFilters
            ) => {

                setLoading(true);

                try {

                    const response =
                        await dashboardService.getHeatmapData(
                            params
                        );

                    if (
                        response.success
                    ) {

                        setPoints(
                            response.data
                        );

                    }

                } catch (error) {

                    console.error(
                        'Erro ao carregar mapa de calor:',
                        error
                    );

                } finally {

                    setLoading(false);

                }

            },
            []
        );

    /* ========================================
       DEBOUNCE FILTERS
    ======================================== */

    useEffect(() => {

        const timeout =
            setTimeout(() => {

                fetchHeatmapData(
                    filters
                );

            }, 500);

        return () =>
            clearTimeout(timeout);

    }, [filters]);

    /* ========================================
       CLEAR FILTERS
    ======================================== */

    const handleClearFilters =
        () => {

            setFilters(
                initialFilters
            );

        };

    /* ========================================
       RENDER
    ======================================== */

    return (

        <div className="heatmap-page">

            <h2 className="heatmap-page-title">
                Mapa de Calor Epidemiológico
            </h2>

            <HeatmapFilters
                filters={filters}
                setFilters={setFilters}
                agents={agents}
                onClearFilters={
                    handleClearFilters
                }
            />

            {/* ========================================
                MAP
            ======================================== */}

            <div className="map-wrapper-container">

                {
                    loading && (

                        <div className="map-loading-overlay">

                            <div className="map-loading-card">

                                <LoaderCircle
                                    size={34}
                                    className="map-loading-icon"
                                />

                                <span>
                                    Atualizando mapa...
                                </span>

                            </div>

                        </div>

                    )
                }

                <MapContainer
                    center={[
                        -5.148306510400497,
                        -38.09915291438934
                    ]}
                    zoom={14}
                    className="leaflet-main-map"
                >

                    <LayersControl position="topright">

                        {/* MAPA CLARO */}

                        <LayersControl.BaseLayer
                            checked
                            name="Mapa Claro"
                        >

                            <TileLayer
                                attribution='&copy; CARTO'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />

                        </LayersControl.BaseLayer>

                        {/* MAPA ESCURO */}

                        <LayersControl.BaseLayer
                            name="Mapa Escuro"
                        >

                            <TileLayer
                                attribution='&copy; CARTO'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                        </LayersControl.BaseLayer>

                        {/* SATÉLITE */}

                        <LayersControl.BaseLayer
                            name="Satélite"
                        >

                            <TileLayer
                                attribution='&copy; Esri'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />

                        </LayersControl.BaseLayer>

                        {/* OPEN STREET */}

                        <LayersControl.BaseLayer
                            name="Padrão"
                        >

                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                        </LayersControl.BaseLayer>

                    </LayersControl>

                    <HeatmapLayer
                        points={points}
                    />

                </MapContainer>

            </div>

        </div>

    );
};