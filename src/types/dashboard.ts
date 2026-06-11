export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  agentId?: string;
  localityCode?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface KPIStats {
  totalVisits: number;
  inspectedVisits: number;
  pendingVisits: number;
  housesWithFocus: number;
  infestationRate: number;
  treatedDeposits: number;
  eliminatedDeposits: number;
  samplesCollected: number;
  totalTubeCount: number;
  treatmentApplications: number;
}

export interface KPIResponse {
  success: boolean;
  data: KPIStats;
}

export interface ChartDataPoint {
  label: string;
  count: number;
}

export interface FocusTypeData {
  type: string;
  count: number;
}

export interface RegionData {
  region: string;
  count: number;
}

export interface AgentPerformance {
  userId: string;
  agentName: string;
  count: number;
}

export interface EvolutionData {
  label: string;
  visits: number;
  focuses: number;
}

export interface ChartsResponse {
  success: boolean;
  charts: {
    visitsPerPeriod: ChartDataPoint[];
    focusFoundPerPeriod: ChartDataPoint[];
    focusTypes: FocusTypeData[];
    visitsByRegion: RegionData[];
    performanceByAgent: AgentPerformance[];
    evolution: EvolutionData[];
  };
}

export interface HeatmapParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  localityCode?: string;
  minLat?: number;
  minLng?: number;
  maxLat?: number;
  maxLng?: number;
}
export interface AgentRouteParams {
  agentId: string
  startDate?: string;
  endDate?: string;
  localityCode?: string;
  minLat?: number;
  minLng?: number;
  maxLat?: number;
  maxLng?: number;
}