import { useEffect, useState, useCallback } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, Home, CheckCircle, AlertTriangle, Droplet } from 'lucide-react';
import { dashboardService } from '../../../services/Dashboard.service';
import type { DashboardFilters, EvolutionData, KPIStats } from '../../../types/dashboard';
import "./AgentPerformanceStats.css"

interface AgentPerformanceStatsProps {
    filters: DashboardFilters;
}

export const AgentPerformanceStats = ({ filters }: AgentPerformanceStatsProps) => {
    const [kpis, setKpis] = useState<KPIStats | null>(null);
    const [evolution, setEvolution] = useState<EvolutionData[]>([]);
    const [loading, setLoading] = useState(false);

    const loadStats = useCallback(async () => {
        setLoading(true);
        try {
            // Chamadas paralelas para otimizar o carregamento
            const [kpiRes, chartRes] = await Promise.all([
                dashboardService.getKPIs(filters),
                dashboardService.getCharts(filters)
            ]);

            if (kpiRes.success) setKpis(kpiRes.data);
            if (chartRes.success) setEvolution(chartRes.charts.evolution);
        } catch (error) {
            console.error("Erro ao carregar estatísticas do agente:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (loading) return <div className="chart-placeholder skeleton">Carregando métricas...</div>;

    return (
        <div className="agent-stats-wrapper">
            {/* LINHA DE KPIS RÁPIDOS */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon-bg gray"><Home size={20} /></div>
                    <div className="kpi-content">
                        <label>TOTAL VISITAS</label>
                        <span>{kpis?.totalVisits || 0}</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-bg green"><CheckCircle size={20} /></div>
                    <div className="kpi-content">
                        <label>INSPECIONADAS</label>
                        <span>{kpis?.inspectedVisits || 0}</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-bg yellow"><AlertTriangle size={20} /></div>
                    <div className="kpi-content">
                        <label>PENDENTES</label>
                        <span>{kpis?.pendingVisits || 0}</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-bg red"><Droplet size={20} /></div>
                    <div className="kpi-content">
                        <label>FOCOS</label>
                        <span>{kpis?.housesWithFocus || 0}</span>
                    </div>
                </div>
            </div>

            {/* GRÁFICO DE EVOLUÇÃO */}
            <div className="chart-card-full">
                <div className="chart-title">
                    <TrendingUp size={18} /> EVOLUÇÃO DE TRABALHO NO PERÍODO
                </div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={evolution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="label" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#64748b'}} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#64748b'}} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            />
                            <Legend iconType="circle" />
                            <Line 
                                name="Visitas" 
                                type="monotone" 
                                dataKey="visits" 
                                stroke="#469472" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#469472' }}
                                activeDot={{ r: 6 }} 
                            />
                            <Line 
                                name="Focos" 
                                type="monotone" 
                                dataKey="focuses" 
                                stroke="#ef4444" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#ef4444' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};