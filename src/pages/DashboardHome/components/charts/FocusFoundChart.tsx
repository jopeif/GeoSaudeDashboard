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

const formatDateLabel = (
  value: string,
  periodType?: 'day' | 'week' | 'month'
) => {
  if (!value) return '';

  // Se já tiver barras, validamos se precisa expandir o ano ou se já está ok
  if (value.includes('/')) {
    const parts = value.split('/');
    // Caso receba "13/05", assume o ano atual ou mantém como está
    if (parts.length === 2) return `${value}/${new Date().getFullYear()}`;
    return value;
  }

  const parts = value.split('-');

  // MONTH: YYYY-MM -> 01/MM/YYYY
  if (periodType === 'month' && parts.length === 2) {
    const [year, month] = parts;
    return `01/${month}/${year}`;
  }

  // DAY/WEEK: YYYY-MM-DD -> DD/MM/YYYY
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return value;
};

export const FocusFoundChart = ({
  data,
  periodType
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
              tickFormatter={(value) =>
                formatDateLabel(value, periodType)
              }
              stroke="#64748b"
            />

            <YAxis fontSize={12} stroke="#64748b" />

            <Tooltip
              labelFormatter={(label) =>
                formatDateLabel(String(label), periodType)
              }
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