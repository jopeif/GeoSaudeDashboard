import React from 'react';
import { KPICard } from './KPICard';
import type { KPIStats } from '../../../../types/dashboard';
import './KPISection.css'

interface KPISectionProps {
  data: KPIStats | null;
  loading: boolean;
}

export const KPISection: React.FC<KPISectionProps> = ({ data, loading }) => {
  return (
    <div className="kpi-grid">
      <KPICard 
        label="Total de Visitas" 
        value={data?.totalVisits || 0} 
        featured 
        isLoading={loading} 
      />
      <KPICard 
        label="Visitas Inspecionadas" 
        value={data?.inspectedVisits || 0} 
        isLoading={loading} 
      />
      <KPICard 
        label="Visitas Pendentes" 
        value={data?.pendingVisits || 0} 
        isLoading={loading} 
      />
      <KPICard 
        label="Casas com Foco" 
        value={data?.housesWithFocus || 0} 
        isNegative={Number(data?.housesWithFocus) > 0}
        isLoading={loading} 
      />
      <KPICard 
        label="Taxa de Infestação" 
        value={`${data?.infestationRate.toFixed(2) || "0.00"}%`} 
        isLoading={loading} 
      />
      <KPICard 
        label="Depósitos Tratados" 
        value={data?.treatedDeposits || 0} 
        isLoading={loading} 
      />
      <KPICard 
        label="Depósitos Eliminados" 
        value={data?.eliminatedDeposits || 0} 
        isLoading={loading} 
      />
      <KPICard 
        label="Amostras Coletadas" 
        value={data?.samplesCollected || 0} 
        isLoading={loading} 
      />
    </div>
  );
};