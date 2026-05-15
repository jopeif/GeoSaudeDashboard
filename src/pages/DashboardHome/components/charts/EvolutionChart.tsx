import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import type { EvolutionData } from '../../../../types/dashboard';

interface EvolutionChartProps {
  data: EvolutionData[];
  periodType?: 'day' | 'week' | 'month';
}

export const EvolutionChart = ({
  data,
  periodType
}: EvolutionChartProps) => {


  const formatXAxis = (
    tickItem: string
  ) => {

    if (!tickItem) {
      return '';
    }

    /* =========================
       MONTH
       2026-05 -> 05/26
    ========================= */

    if (periodType === 'month') {

      const [year, month] =
        tickItem.split('-');

      return `${month}/${year.slice(2)}`;
    }

    /* =========================
       DAY
       2026-05-13 -> 13/05/2026
    ========================= */

    if (periodType === 'day') {

      const [year, month, day] =
        tickItem.split('-');

      return `${day}/${month}/${year}`;
    }

    /* =========================
       WEEK
    ========================= */

    return tickItem;
  };

  return (
    <div className="card chart-card">

      <h3 className="chart-title">
        Evolução de Visitas e Focos
      </h3>

      <div
        style={{
          width: '100%',
          height: 350
        }}
      >
        <ResponsiveContainer>
          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="label"
              fontSize={11}
              tickMargin={10}
              tickFormatter={formatXAxis}
              stroke="#64748b"
            />

            <YAxis
              fontSize={11}
              stroke="#64748b"
            />

            <Tooltip
              labelFormatter={(label) =>
                formatXAxis(String(label))
              }
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
            />

            {/* VISITAS */}
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

            {/* FOCOS */}
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
              activeDot={{
                r: 6
              }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};