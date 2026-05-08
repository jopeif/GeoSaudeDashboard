import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type FocusTypeData } from '../../../../types/dashboard';

const COLORS = ['#469472', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const FocusTypesChart = ({ data }: { data: FocusTypeData[] }) => (
  <div className="card chart-card">
    <h3 className="chart-title">Tipos de Depósitos/Focos</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);