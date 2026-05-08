import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { type RegionData } from '../../../../types/dashboard';

export const RegionChart = ({ data }: { data: RegionData[] }) => (
  <div className="card chart-card">
    <h3 className="chart-title">Visitas por Localidade</h3>

    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ left: 10, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="region"
            type="category"
            fontSize={10}
          />

          <YAxis
            type="number"
            fontSize={12}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            name="Visitas"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);