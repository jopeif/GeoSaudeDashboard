import React from 'react';

import { KPICard } from './KPICard';

import type {
  KPIStats
} from '../../../../types/dashboard';

import './KPISection.css';

interface KPISectionProps {
  data: KPIStats | null;
  loading: boolean;
}

export const KPISection:
React.FC<KPISectionProps> = ({
  data,
  loading
}) => {
  return (
    <div className="kpi-grid">

      <KPICard
        label="Total de Visitas"
        value={
          data?.totalVisits || 0
        }
        featured
        isLoading={loading}
        tooltip="Quantidade total de visitas registradas no período selecionado."
        tooltipSide="right"
        
      />

      <KPICard
        label="Visitas Inspecionadas"
        value={
          data?.inspectedVisits || 0
        }
        isLoading={loading}
        tooltip="Quantidade de visitas que foram concluídas e inspecionadas."
        tooltipSide="right"
      />

      <KPICard
        label="Visitas Pendentes"
        value={
          data?.pendingVisits || 0
        }
        isLoading={loading}
        tooltip="Visitas que ainda não foram concluídas ou registradas pelos agentes."
        tooltipSide="right"
      />

      <KPICard
        label="Casas com Foco"
        value={
          data?.housesWithFocus || 0
        }
        isNegative={
          Number(
            data?.housesWithFocus
          ) > 0
        }
        isLoading={loading}
        tooltip="Quantidade de imóveis onde foram encontrados focos durante as inspeções."
        tooltipSide="right"
      />

      <KPICard
        label="Taxa de Infestação"
        value={`${data?.infestationRate.toFixed(2) || "0.00"}%`}
        isLoading={loading}
        tooltip="Percentual de visitas com presença de focos em relação ao total de inspeções realizadas."
        tooltipSide="left"
      />

      <KPICard
        label="Depósitos Tratados"
        value={
          data?.treatedDeposits || 0
        }
        isLoading={loading}
        tooltip="Quantidade de depósitos que receberam tratamento preventivo ou químico."
        tooltipSide="left"
      />

      <KPICard
        label="Depósitos Eliminados"
        value={
          data?.eliminatedDeposits || 0
        }
        isLoading={loading}
        tooltip="Quantidade de depósitos removidos para eliminar possíveis criadouros."
        tooltipSide='left'
      />

      <KPICard
        label="Amostras Coletadas"
        value={
          data?.samplesCollected || 0
        }
        isLoading={loading}
        tooltip="Total de amostras coletadas durante as visitas em campo."
        tooltipSide="left"
      />

    </div>
  );
};