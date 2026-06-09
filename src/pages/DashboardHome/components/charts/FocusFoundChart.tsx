import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface FocusFoundChartProps {
  data: any[];
  periodType?: 'day' | 'week' | 'month';
}

/* ========================================
   DATE FORMATTER ROBUSTO
======================================== */

const formatDateLabel = (value: string) => {
  if (!value) return '';

  if (value.includes('/')) return value;

  const datePart = value.split('T')[0];
  const parts = datePart.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
  
  return value;
};

export const FocusFoundChart = ({
  data
}: FocusFoundChartProps) => {
  return (
    <div className="card chart-card">
      <h3 className="chart-title">
        Quantidade de Focos Encontrados
      </h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="label"
              fontSize={11}
              tickMargin={10}
              tickFormatter={(value) => formatDateLabel(value)}
              stroke="#64748b"
            />

            <YAxis fontSize={12} stroke="#64748b" />

            <Tooltip
              labelFormatter={(label) => formatDateLabel(String(label))}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />

            <Bar
              dataKey="count"
              name="Focos"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};