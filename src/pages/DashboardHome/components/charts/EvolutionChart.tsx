import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { EvolutionData } from '../../../../types/dashboard';

interface EvolutionChartProps {
  data: EvolutionData[];
  periodType?: 'day' | 'week' | 'month';
}

export const EvolutionChart = ({ data, periodType }: EvolutionChartProps) => {
  
  // Função simples para tornar a data mais legível no gráfico
  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return '';
    if (periodType === 'month') {
      // Ex: 2024-05 -> Mai/24
      const date = new Date(tickItem + "-02"); // Add day to avoid timezone shift
      return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    }
    if (periodType === 'day') {
      // Ex: 2024-05-07 -> 07/05
      const [ month, day] = tickItem.split('-');
      return `${day}/${month}`;
    }
    return tickItem; // Para 'week' mantemos o padrão da API ou formatamos conforme necessário
  };

  return (
    <div className="card chart-card">
      <h3 className="chart-title">Evolução de Visitas e Focos</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              fontSize={11} 
              tickMargin={10} 
              tickFormatter={formatXAxis}
              stroke="#64748b"
            />
            <YAxis fontSize={11} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
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
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};