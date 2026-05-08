import api from '../api/client';
import type { 
  DashboardFilters, 
  KPIResponse, 
  ChartsResponse, 
  HeatmapParams
} from '../types/dashboard';

export const dashboardService = {
  /**
   * Busca os indicadores (KPIs) com base nos filtros
   */
  async getKPIs(filters: DashboardFilters): Promise<KPIResponse> {
    const { data } = await api.get<KPIResponse>('/dashboard/kpis', {
      params: filters,
    });
    return data;
  },

  /**
   * Busca os dados dos gráficos com base nos filtros
   */
  async getCharts(filters: DashboardFilters): Promise<ChartsResponse> {
    const { data } = await api.get<ChartsResponse>('/dashboard/charts', {
      params: filters,
    });
    return data;
  },

  async getHeatmapData(params: HeatmapParams) {
    const { data } = await api.get('/dashboard/heatmap', { params });
    return data;  
  }
};