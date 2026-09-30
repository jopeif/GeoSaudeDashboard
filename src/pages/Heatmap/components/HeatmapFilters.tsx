// src/pages/Heatmap/components/HeatmapFilters.tsx

import React from 'react';

import {
    Calendar,
    User,
    MapPin,
    BrushCleaning
} from 'lucide-react';

import type { DashboardFilters } from '../../../types/dashboard';
import type { UserDetails } from '../../../types/user';

import '../Heatmap.css';

interface HeatmapFiltersProps {
    filters: DashboardFilters;

    setFilters: React.Dispatch<
        React.SetStateAction<DashboardFilters>
    >;

    agents: UserDetails[];

    onClearFilters: () => void;
}

export const HeatmapFilters: React.FC<
    HeatmapFiltersProps
> = ({
    filters,
    setFilters,
    agents,
    onClearFilters
}) => {

    return (

        <section className="heatmap-filter-container">

            <div className="heatmap-filter-header">

                <div className="heatmap-filter-header-left">

                    <h3>
                        Filtros Geográficos
                    </h3>

                    {/* <p>
                        Refine os focos exibidos
                        no mapa em tempo real.
                    </p> */}

                </div>

            </div>

            <div className="heatmap-filter-grid">

                {/* DATA INICIAL */}

                <div className="heatmap-filter-group">

                    <label>
                        <Calendar size={12}/>
                        DATA INICIAL
                    </label>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e)=>
                            setFilters({
                                ...filters,
                                startDate:
                                    e.target.value
                            })
                        }
                    />

                </div>

                {/* DATA FINAL */}

                <div className="heatmap-filter-group">

                    <label>
                        <Calendar size={12}/>
                        DATA FINAL
                    </label>

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e)=>
                            setFilters({
                                ...filters,
                                endDate:
                                    e.target.value
                            })
                        }
                    />

                </div>

                {/* AGENTE */}

                <div className="heatmap-filter-group">

                    <label>
                        <User size={12}/>
                        AGENTE RESPONSÁVEL
                    </label>

                    <select
                        value={filters.userId}
                        onChange={(e)=>
                            setFilters({
                                ...filters,
                                userId:
                                    e.target.value
                            })
                        }
                    >

                        <option value="">
                            Todos os Agentes
                        </option>

                        {
                            agents.map(
                                (agent)=>(
                                    <option
                                        key={agent.id}
                                        value={agent.id}
                                    >
                                        {agent.name}
                                    </option>
                                )
                            )
                        }

                    </select>

                </div>

                {/* LOCALIDADE */}

                <div className="heatmap-filter-group">

                    <label>
                        <MapPin size={12}/>
                        LOCALIDADE
                    </label>

                    <input
                        type="text"
                        placeholder="Ex: LC-112"
                        value={
                            filters.localityCode
                        }
                        onChange={(e)=>
                            setFilters({
                                ...filters,
                                localityCode:
                                    e.target.value
                            })
                        }
                    />

                </div>

                {/* ACTIONS */}

                <div className="heatmap-filter-group heatmap-filter-group--actions heatmap-filter-actions">

                    <button
                        className="heatmap-btn-clear"
                        type="button"
                        onClick={
                            onClearFilters
                        }
                    >
                        <BrushCleaning size={16}/>
                        Limpar filtros
                    </button>

                </div>

            </div>

        </section>

    );
};