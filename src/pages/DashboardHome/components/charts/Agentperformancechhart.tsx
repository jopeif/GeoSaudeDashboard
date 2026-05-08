import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { type AgentPerformance } from '../../../../types/dashboard';

export const AgentPerformanceChart = ({ data }: { data: AgentPerformance[] }) => (
    <div className="card chart-card">
        <h3 className="chart-title">Desempenho por Agente (Total de Visitas)</h3>
        <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="agentName" fontSize={10} interval={0} />
            <YAxis fontSize={12} />
            <Tooltip cursor={{fill: '#f8fafc'}} />
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