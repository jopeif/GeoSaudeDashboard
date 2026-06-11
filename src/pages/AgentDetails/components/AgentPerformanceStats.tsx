import { useEffect, useState, useCallback } from 'react';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

import {
    TrendingUp,
    Home,
    CheckCircle,
    AlertTriangle,
    Droplet
} from 'lucide-react';

import { dashboardService } from '../../../services/Dashboard.service';

import type {
    DashboardFilters,
    EvolutionData,
    KPIStats
} from '../../../types/dashboard';

import "./AgentPerformanceStats.css";

interface AgentPerformanceStatsProps {
    filters: DashboardFilters;
    refreshTrigger?: number;
}

export const AgentPerformanceStats = ({
    filters,
    refreshTrigger = 0
}: AgentPerformanceStatsProps) => {

    const [kpis, setKpis] =
        useState<KPIStats | null>(null);

    const [evolution, setEvolution] =
        useState<EvolutionData[]>([]);

    const [loading, setLoading] =
        useState(false);

    const formatDateLabel = (value: string) => {
        if (!value) return '';
        const datePart = value.split('T')[0];
        const parts = datePart.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
        return value;
    };

    const loadStats =
        useCallback(async () => {

            setLoading(true);

            try {

                const [
                    kpiRes,
                    chartRes
                ] = await Promise.all([
                    dashboardService.getKPIs(filters),
                    dashboardService.getCharts(filters)
                ]);

                if (kpiRes.success) {
                    setKpis(kpiRes.data);
                }

                if (chartRes.success) {
                    setEvolution(
                        chartRes.charts.evolution
                    );
                }

            } catch (error) {

                console.error(
                    "Erro ao carregar estatísticas do agente:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }, [filters]);

    useEffect(() => {

        loadStats();

    }, [loadStats, refreshTrigger]);

    if (loading) {
        return (
            <div className="agent-chart-placeholder agent-chart-skeleton">
                Carregando métricas...
            </div>
        );
    }

    return (
        <div className="agent-stats-wrapper">

            {/* =========================
                KPIs
            ========================= */}

            <div className="agent-kpi-grid">

                <div className="agent-kpi-card">

                    <div className="agent-kpi-icon-bg gray">
                        <Home size={20}/>
                    </div>

                    <div className="agent-kpi-content">

                        <label>
                            TOTAL VISITAS
                        </label>

                        <span>
                            {kpis?.totalVisits || 0}
                        </span>

                    </div>

                </div>

                <div className="agent-kpi-card">

                    <div className="agent-kpi-icon-bg green">
                        <CheckCircle size={20}/>
                    </div>

                    <div className="agent-kpi-content">

                        <label>
                            INSPECIONADAS
                        </label>

                        <span>
                            {kpis?.inspectedVisits || 0}
                        </span>

                    </div>

                </div>

                <div className="agent-kpi-card">

                    <div className="agent-kpi-icon-bg yellow">
                        <AlertTriangle size={20}/>
                    </div>

                    <div className="agent-kpi-content">

                        <label>
                            PENDENTES
                        </label>

                        <span>
                            {kpis?.pendingVisits || 0}
                        </span>

                    </div>

                </div>

                <div className="agent-kpi-card">

                    <div className="agent-kpi-icon-bg red">
                        <Droplet size={20}/>
                    </div>

                    <div className="agent-kpi-content">

                        <label>
                            FOCOS
                        </label>

                        <span>
                            {kpis?.housesWithFocus || 0}
                        </span>

                    </div>

                </div>

            </div>

            {/* =========================
                CHART
            ========================= */}

            <div className="agent-chart-card">

                <div className="agent-chart-title">

                    <TrendingUp size={18}/>

                    EVOLUÇÃO DE TRABALHO NO PERÍODO

                </div>

                <div
                    style={{
                        width: '100%',
                        height: 300
                    }}
                >

                    <ResponsiveContainer>

                        <LineChart data={evolution}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f1f5f9"
                            />

                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatDateLabel}
                                tick={{
                                    fontSize: 12,
                                    fill: '#64748b'
                                }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: '#64748b'
                                }}
                            />

                            <Tooltip
                                labelFormatter={(label) => formatDateLabel(String(label))}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow:
                                        '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />

                            <Legend iconType="circle"/>

                            <Line
                                name="Visitas"
                                type="monotone"
                                dataKey="visits"
                                stroke="#469472"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: '#469472'
                                }}
                                activeDot={{
                                    r: 6
                                }}
                            />

                            <Line
                                name="Focos"
                                type="monotone"
                                dataKey="focuses"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: '#ef4444'
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
};