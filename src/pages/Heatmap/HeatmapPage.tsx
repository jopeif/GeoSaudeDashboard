import { useEffect, useState, useCallback } from 'react';
import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import { Filter, Calendar, User, MapPin } from 'lucide-react';

import { dashboardService } from '../../services/Dashboard.service';
import { userService } from '../../services/User.service';
import type { UserDetails } from '../../types/user';
import type { DashboardFilters } from '../../types/dashboard';

import './Heatmap.css';

// Componente para corrigir o tamanho do mapa e gerenciar a camada de calor
const HeatmapLayer = ({ points }: { points: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    // Corrige o bug dos blocos cinzas forçando o recalculo do tamanho
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    if (!points || points.length === 0) return;

    // Formata pontos para [lat, lng, weight]
    const heatPoints = points.map(p => [p.lat, p.lng, p.weight || 1]);
    
    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

export const HeatmapPage = () => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [agents, setAgents] = useState<UserDetails[]>([]);

  const initialFilters: DashboardFilters = {
    startDate: '',
    endDate: '',
    userId: '',
    localityCode: '',
    groupBy: 'day' // Mantido para compatibilidade de tipos
  };

  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  // Busca lista de agentes para o select
  useEffect(() => {
    const loadAgents = async () => {
      const response = await userService.findAll();
      if (response.success && response.users) {
        setAgents(response.users);
      }
    };
    loadAgents();
  }, []);

  const fetchHeatmapData = useCallback(async (params: DashboardFilters) => {
    setLoading(true);
    try {
      const response = await dashboardService.getHeatmapData(params);
      if (response.success) {
        setPoints(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar mapa de calor:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeatmapData(filters);
  }, []);

  const handleApplyFilters = () => {
    fetchHeatmapData(filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    fetchHeatmapData(initialFilters);
  };

  return (
    <div className="dashboard-home"> {/* Reutilizando classe do dashboard para consistência */}
      <h2 className="page-title">Mapa de Calor Epidemiológico</h2>
      
      <section className="filter-container">
        <div className="filter-title"><Filter size={16} /> Filtros de Análise Geográfica</div>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label><Calendar size={12}/> DATA INICIAL</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>

          <div className="filter-group">
            <label><Calendar size={12}/> DATA FINAL</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          <div className="filter-group">
            <label><User size={12}/> AGENTE RESPONÁVEL</label>
            <select 
              value={filters.userId} 
              onChange={(e) => setFilters({...filters, userId: e.target.value})}
            >
              <option value="">Todos os Agentes</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><MapPin size={12}/> LOCALIDADE</label>
            <input 
              type="text" 
              placeholder="Ex: LC-112"
              value={filters.localityCode}
              onChange={(e) => setFilters({...filters, localityCode: e.target.value})}
            />
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={handleApplyFilters}>
              {loading ? 'Carregando...' : 'Atualizar Mapa'}
            </button>
            <button className="btn-clear" onClick={handleClearFilters}>Limpar</button>
          </div>
        </div>
      </section>

      <div className="map-wrapper-container">
        <MapContainer 
          center={[-5.148306510400497, -38.09915291438934]} 
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

          <HeatmapLayer points={points} />
        </MapContainer>
      </div>
    </div>
  );
};