import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const FocusFoundChart = ({ data }: { data: any[] }) => (
  <div className="card chart-card">
    <h3 className="chart-title">Quantidade de Focos Encontrados</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" fontSize={11} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" name="Focos" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);