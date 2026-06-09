import api from '../api/client';
import type { 
  DashboardFilters, 
  KPIResponse, 
  ChartsResponse, 
  HeatmapParams,
  AgentRouteParams
} from '../types/dashboard';

export const dashboardService = {
  /**
   * Busca os indicadores (KPIs) com base nos filtros
   */
  async getKPIs(filters: DashboardFilters): Promise<KPIResponse> {
    const params: any = { ...filters };
    if (params.userId) {
      params.agentId = params.userId;
      delete params.userId;
    }
    const { data } = await api.get<KPIResponse>('/dashboard/kpis', { params });
    return data;
  },

  /**
   * Busca os dados dos gráficos com base nos filtros
   */
  async getCharts(filters: DashboardFilters): Promise<ChartsResponse> {
    const params: any = { groupBy: 'day', ...filters }; 
    if (params.userId) {
      params.agentId = params.userId;
      delete params.userId;
    }
    const { data } = await api.get<ChartsResponse>('/dashboard/charts', { params });
    return data;
  },

  async getHeatmapData(params: HeatmapParams) {
    const { data } = await api.get('/dashboard/heatmap', { params });
    return data;  
  },

  async getAgentRoute(params: AgentRouteParams) {
    const { data } = await api.get('/dashboard/agent-route', {params})
    return data
  }
};