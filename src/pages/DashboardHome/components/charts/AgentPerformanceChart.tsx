import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { type AgentPerformance } from '../../../../types/dashboard';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                color: 'var(--text-main)',
                fontSize: 13,
                fontWeight: 600,
                minWidth: 120
            }}>
                <p style={{ margin: '0 0 4px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 12 }}>{label}</p>
                <p style={{ margin: 0, color: '#469472', fontWeight: 800 }}>
                    {payload[0].value} {payload[0].value === 1 ? 'visita' : 'visitas'}
                </p>
            </div>
        );
    }
    return null;
};

export const AgentPerformanceChart = ({ data }: { data: AgentPerformance[] }) => (
    <div className="card chart-card">
        <h3 className="chart-title">Desempenho por Agente (Total de Visitas)</h3>
        <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="agentName" fontSize={10} interval={0} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--card-soft)', opacity: 0.5 }} />
            <Bar dataKey="count" name="Visitas" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#469472' : '#63ab8a'} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
        </div>
    </div>
);