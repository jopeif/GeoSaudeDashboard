// src/pages/Heatmap/HeatmapPage.tsx

import {
    useEffect,
    useState,
    useCallback,
    useRef
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
    LoaderCircle,
    Info
} from 'lucide-react';

import { dashboardService } from '../../services/Dashboard.service';
import { userService } from '../../services/User.service';
import { useTheme } from '../../contexts/ThemeContext';

import type { UserDetails } from '../../types/user';
import type { DashboardFilters, HeatmapPoint } from '../../types/dashboard';

import { HeatmapFilters } from './components/HeatmapFilters';

import './Heatmap.css';

/* ========================================
   MAP RESIZE HANDLER
   Garante recálculo de dimensões e recarregamento
   de tiles em qualquer tamanho de tela / rotação
======================================== */

const MapResizeHandler = () => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Invalidação inicial para evitar áreas cinzas ao carregar o mapa
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        const container = map.getContainer();
        let observer: ResizeObserver | null = null;

        // Observa alterações de dimensões do container (ex: redimensionamento, toggle da sidebar)
        if (typeof ResizeObserver !== 'undefined' && container) {
            observer = new ResizeObserver(() => {
                map.invalidateSize();
            });
            observer.observe(container);
        }

        const handleResize = () => {
            map.invalidateSize();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            if (observer && container) {
                observer.unobserve(container);
                observer.disconnect();
            }
        };
    }, [map]);

    return null;
};

/* ========================================
   BASE LAYER LISTENER
   Detecta se a camada base ativa possui fundo escuro
======================================== */

const BaseLayerListener = ({
    onLayerDarknessChange
}: {
    onLayerDarknessChange: (isDarkLayer: boolean) => void;
}) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const handleBaseLayerChange = (e: L.LayersControlEvent) => {
            const isDark = e.name === 'Mapa Escuro' || e.name === 'Satélite';
            onLayerDarknessChange(isDark);
        };

        map.on('baselayerchange', handleBaseLayerChange);

        return () => {
            map.off('baselayerchange', handleBaseLayerChange);
        };
    }, [map, onLayerDarknessChange]);

    return null;
};

/* ========================================
   HEATMAP LAYER
   Camada de calor com paleta e contraste adaptativos
======================================== */

interface HeatmapLayerProps {
    points: HeatmapPoint[];
    isDarkBackground: boolean;
}

const HeatmapLayer = ({
    points,
    isDarkBackground
}: HeatmapLayerProps) => {
    const map = useMap();
    const heatLayerRef = useRef<L.HeatLayer | null>(null);

    // Gradiente luminescente de alto contraste para fundos escuros / satélite
    const darkGradient: Record<number, string> = {
        0.2: '#00e5ff', // Ciano neon
        0.4: '#00ff88', // Verde limão elétrico
        0.6: '#ffea00', // Amarelo vibrante
        0.8: '#ff6d00', // Laranja
        1.0: '#ff1744'  // Vermelho vivo
    };

    // Gradiente nítido para fundos claros
    const lightGradient: Record<number, string> = {
        0.2: '#2563eb', // Azul
        0.4: '#06b6d4', // Ciano
        0.6: '#10b981', // Verde
        0.8: '#f59e0b', // Âmbar
        1.0: '#ef4444'  // Vermelho
    };

    const gradient = isDarkBackground ? darkGradient : lightGradient;
    const minOpacity = isDarkBackground ? 0.35 : 0.25;

    // Atualiza pontos e opções do mapa de calor de forma suave
    useEffect(() => {
        if (!map) return;

        const heatLatLngs: [number, number, number][] = points.map((p) => [
            p.lat,
            p.lng,
            p.weight || 1
        ]);

        if (!heatLayerRef.current) {
            heatLayerRef.current = L.heatLayer(heatLatLngs, {
                radius: 26,
                blur: 16,
                maxZoom: 17,
                minOpacity,
                gradient
            }).addTo(map);
        } else {
            heatLayerRef.current.setLatLngs(heatLatLngs);
            heatLayerRef.current.setOptions({
                radius: 26,
                blur: 16,
                maxZoom: 17,
                minOpacity,
                gradient
            });
            heatLayerRef.current.redraw();
        }
    }, [map, points, gradient, minOpacity]);

    // Limpeza ao desmontar o componente
    useEffect(() => {
        return () => {
            if (heatLayerRef.current && map) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
        };
    }, [map]);

    // Ajusta o enquadramento (fitBounds) automaticamente ao carregar focos
    useEffect(() => {
        if (!map || points.length === 0) return;

        const validPoints = points.filter(
            (p) => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0
        );

        if (validPoints.length === 0) return;

        const bounds = L.latLngBounds(
            validPoints.map((p) => [p.lat, p.lng])
        );

        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 16
            });
        }
    }, [map, points]);

    return null;
};

/* ========================================
   PAGE
======================================== */

export const HeatmapPage = () => {
    const { isDark } = useTheme();

    const [loading, setLoading] = useState(false);
    const [points, setPoints] = useState<HeatmapPoint[]>([]);
    const [agents, setAgents] = useState<UserDetails[]>([]);
    const [manualDarkLayer, setManualDarkLayer] = useState<boolean | null>(null);

    // O modo escuro da camada do mapa acompanha o tema global, permitindo override manual pelo usuário
    const isDarkMapLayer = manualDarkLayer !== null ? manualDarkLayer : isDark;

    const initialFilters: DashboardFilters = {
        startDate: '',
        endDate: '',
        userId: '',
        localityCode: '',
        groupBy: 'day'
    };

    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

    const handleLayerDarknessChange = useCallback((isDarkLayer: boolean) => {
        setManualDarkLayer(isDarkLayer);
    }, []);

    /* ========================================
       LOAD AGENTS
    ======================================== */

    useEffect(() => {
        const loadAgents = async () => {
            const response = await userService.findAll({ page: 1, limit: 100 });

            if (response.success && response.users) {
                setAgents(response.users);
            }
        };

        loadAgents();
    }, []);

    /* ========================================
       FETCH HEATMAP
    ======================================== */

    const fetchHeatmapData = useCallback(
        async (params: DashboardFilters) => {
            setLoading(true);

            try {
                const response = await dashboardService.getHeatmapData(params);

                if (response.success && response.data) {
                    setPoints(response.data);
                }
            } catch (error) {
                console.error('Erro ao carregar mapa de calor:', error);
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
        const timeout = setTimeout(() => {
            fetchHeatmapData(filters);
        }, 500);

        return () => clearTimeout(timeout);
    }, [filters, fetchHeatmapData]);

    /* ========================================
       CLEAR FILTERS
    ======================================== */

    const handleClearFilters = () => {
        setFilters(initialFilters);
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
                onClearFilters={handleClearFilters}
            />

            {/* ========================================
                MAP
            ======================================== */}

            <div className="map-wrapper-container">
                {loading && (
                    <div className="map-loading-overlay">
                        <div className="map-loading-card">
                            <LoaderCircle
                                size={34}
                                className="map-loading-icon"
                            />
                            <span>Atualizando mapa...</span>
                        </div>
                    </div>
                )}

                <MapContainer
                    key={isDark ? 'map-dark' : 'map-light'}
                    center={[
                        -5.148306510400497,
                        -38.09915291438934
                    ]}
                    zoom={14}
                    className="leaflet-main-map"
                >
                    <MapResizeHandler />
                    <BaseLayerListener onLayerDarknessChange={handleLayerDarknessChange} />

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
                        <LayersControl.BaseLayer name="Satélite">
                            <TileLayer
                                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>

                        {/* HUMANITÁRIO */}
                        <LayersControl.BaseLayer name="Humanitário">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.hotosm.org/">HOT</a>'
                                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                                className="map-tiles-light"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    <HeatmapLayer
                        points={points}
                        isDarkBackground={isDarkMapLayer}
                    />
                </MapContainer>

                {/* LEGENDA DE INTENSIDADE */}
                <div className="heatmap-legend-badge">
                    <div className="heatmap-legend-title">
                        <Info size={14} />
                        <span>Densidade de Focos</span>
                    </div>
                    <div className="heatmap-legend-bar">
                        <span className="legend-label">Baixa</span>
                        <div
                            className={`legend-gradient-line ${
                                isDarkMapLayer ? 'dark-mode' : 'light-mode'
                            }`}
                        />
                        <span className="legend-label">Alta</span>
                    </div>
                </div>
            </div>
        </div>
    );
};