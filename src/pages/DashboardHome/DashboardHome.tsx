import { useEffect, useMemo, useState } from 'react';


import { dashboardService } from '../../services/Dashboard.service';
import { userService } from '../../services/User.service';
import {DashboardFiltersComponent} from "./components/filters/DashboardFilters"
import type {
  KPIStats,
  DashboardFilters,
  ChartsResponse
} from '../../types/dashboard';

import type { UserDetails } from '../../types/user';

import { KPISection } from './components/KPI/KPISection';

import { EvolutionChart } from './components/charts/EvolutionChart';
import { FocusTypesChart } from './components/charts/FocusTypesChart';
import { FocusFoundChart } from './components/charts/FocusFoundChart';
import { RegionChart } from './components/charts/RegionChart';
import { AgentPerformanceChart } from './components/charts/AgentPerformanceChart';

import "./DashboardHome.css"

export const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  const [kpiData, setKpiData] =
    useState<KPIStats | null>(null);

  const [chartData, setChartData] =
    useState<ChartsResponse['charts'] | null>(null);

  const [agents, setAgents] =
    useState<UserDetails[]>([]);

  const initialFilters = useMemo<DashboardFilters>(
    () => ({
      startDate: '',
      endDate: '',
      userId: '',
      localityCode: '',
      groupBy: 'day'
    }),
    []
  );

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);

  useEffect(() => {
    const loadAgents = async () => {
      const response =
        await userService.findAll();

      if (
        response.success &&
        response.users
      ) {
        setAgents(response.users);
      }
    };

    loadAgents();
  }, []);

  const fetchDashboardData = async (
    params: DashboardFilters
  ) => {
    setLoading(true);

    try {
      const [kpiRes, chartRes] =
        await Promise.all([
          dashboardService.getKPIs(params),
          dashboardService.getCharts(params)
        ]);

      if (kpiRes.success) {
        setKpiData(kpiRes.data);
      }

      if (chartRes.success) {
        setChartData(chartRes.charts);
      }
    } catch (error) {
      console.error(
        'Erro ao carregar dashboard:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Debounce:
    espera o usuário terminar
    de alterar filtros antes
    de fazer a request
  */
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDashboardData(filters);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters]);

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="dashboard-home">
      <h2 className="page-title">
        Painel de Supervisão
      </h2>

      <DashboardFiltersComponent
        filters={filters}
        setFilters={setFilters}
        agents={agents}
        onClearFilters={handleClearFilters}
    />

      <KPISection
        data={kpiData}
        loading={loading}
      />

      {chartData && (
        <div className="dashboard-content-layout">

          {/* PRINCIPAL */}
          <div className="main-charts-column">

            <EvolutionChart
              data={
                chartData.evolution
              }
              periodType={
                filters.groupBy
              }
            />

            <div
              style={{
                gap: '24px'
              }}
            >
              <AgentPerformanceChart
                data={
                  chartData.performanceByAgent
                }
              />
            </div>

            <div className="double-chart-grid">

              <RegionChart
                data={
                  chartData.visitsByRegion
                }
              />

              <FocusFoundChart
                data={
                  chartData.focusFoundPerPeriod
                }
              />

            </div>
          </div>

          {/* LATERAL */}
          <div className="side-charts-column">

            <FocusTypesChart
              data={
                chartData.focusTypes
              }
            />

            <div className="chart-card">
              <h3 className="chart-title">
                Resumo de Campo
              </h3>

              <div className="summary-list">

                <div className="summary-item">
                  <span>
                    Taxa de Foco:
                  </span>

                  <strong>
                    {
                      kpiData?.infestationRate
                    }
                    %
                  </strong>
                </div>

                <div className="summary-item">
                  <span>
                    Amostras/Visita:
                  </span>

                  <strong>
                    {kpiData
                      ? (
                          kpiData.samplesCollected /
                          kpiData.totalVisits
                        ).toFixed(
                          2
                        )
                      : 0}
                  </strong>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};