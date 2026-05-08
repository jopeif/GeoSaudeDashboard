import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/Dashboard.service';
import type { KPIStats, DashboardFilters, ChartsResponse } from '../../types/dashboard';
import { KPISection } from './components/KPISection';
import { Filter, Calendar, User, BarChart, MapPin } from 'lucide-react';
import './DashboardHome.css';
import { EvolutionChart } from './components/charts/EvolutionChart';
import { FocusTypesChart } from './components/charts/FocusTypesChart';

export const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIStats | null>(null);
  const [chartData, setChartData] = useState<ChartsResponse['charts'] | null>(null);

  const initialFilters: DashboardFilters = {
    startDate: '',
    endDate: '',
    userId: '',
    localityCode: '', // Adicionado conforme sua API
    groupBy: 'day'
  };

  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  // A função agora recebe os filtros como argumento para garantir precisão
  const fetchDashboardData = async (params: DashboardFilters) => {
    setLoading(true);
    try {
      // Chamadas em paralelo para performance
      const [kpiRes, chartRes] = await Promise.all([
        dashboardService.getKPIs(params),
        dashboardService.getCharts(params)
      ]);
      
      if (kpiRes.success) setKpiData(kpiRes.data);
      if (chartRes.success) setChartData(chartRes.charts);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao montar a página com filtros vazios (geral)
  useEffect(() => {
    fetchDashboardData(filters);
  }, []);

  // ESTA FUNÇÃO É A CHAVE: Ela envia o estado atual 'filters' para a API
  const handleApplyFilters = () => {
    fetchDashboardData(filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    fetchDashboardData(initialFilters);
  };

  return (
    <div className="dashboard-home">
      <h2 className="page-title">Painel de Supervisão</h2>
      
      <section className="filter-container">
        <div className="filter-title"><Filter size={16} /> Filtros de Pesquisa</div>
        
        <div className="filter-grid">
          {/* DATA INICIAL */}
          <div className="filter-group">
            <label><Calendar size={12}/> DATA INICIAL</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>

          {/* DATA FINAL */}
          <div className="filter-group">
            <label><Calendar size={12}/> DATA FINAL</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          {/* ID DO USUÁRIO / AGENTE */}
          <div className="filter-group">
            <label><User size={12}/> ID DO AGENTE (UUID)</label>
            <input 
              type="text" 
              placeholder="Ex: 38b4aea1..."
              value={filters.userId}
              onChange={(e) => setFilters({...filters, userId: e.target.value})}
            />
          </div>

          {/* LOCALIDADE (localityCode) */}
          <div className="filter-group">
            <label><MapPin size={12}/> LOCALIDADE</label>
            <input 
              type="text" 
              placeholder="Ex: LC-112"
              value={filters.localityCode}
              onChange={(e) => setFilters({...filters, localityCode: e.target.value})}
            />
          </div>

          {/* AGRUPAMENTO */}
          <div className="filter-group">
            <label><BarChart size={12}/> AGRUPAMENTO</label>
            <select 
              value={filters.groupBy}
              onChange={(e) => setFilters({...filters, groupBy: e.target.value as any})}
            >
              <option value="day">Diário</option>
              <option value="week">Semanal</option>
              <option value="month">Mensal</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={handleApplyFilters}>Atualizar</button>
            <button className="btn-clear" onClick={handleClearFilters}>Limpar</button>
          </div>
        </div>
      </section>

      <KPISection data={kpiData} loading={loading} />
      {chartData && (
        <div className="charts-grid">
          <EvolutionChart data={chartData.evolution} periodType={filters.groupBy} />
          <FocusTypesChart data={chartData.focusTypes} />
          {/* Outros gráficos aqui... */}
        </div>
      )}
    </div>
  );
};