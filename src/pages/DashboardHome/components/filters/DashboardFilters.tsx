import {
    Calendar,
    User,
    BarChart,
    MapPin,
    BrushCleaning
} from 'lucide-react';

import type {
    DashboardFilters
} from '../../../../types/dashboard';

import type {
    UserDetails
} from '../../../../types/user';

import "./DashboardFilters.css"
interface DashboardFiltersProps {
    filters: DashboardFilters;

    setFilters: React.Dispatch<
        React.SetStateAction<DashboardFilters>
    >;

    agents: UserDetails[];

    onClearFilters: () => void;
}

export const DashboardFiltersComponent = ({
    filters,
    setFilters,
    agents,
    onClearFilters
}: DashboardFiltersProps) => {

    return (
        <section className="filter-container">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="filter-header">

                <div className="filter-header-left">

                    <h3>
                        Filtros de análise
                    </h3>

                    {/* <p>
                        Refine os dados exibidos
                        nos gráficos e indicadores.
                    </p> */}

                </div>

            </div>

            {/* ========================================
                FILTERS GRID
            ======================================== */}

            <div className="filter-grid">

                {/* ========================================
                    DATA INICIAL
                ======================================== */}

                <div className="filter-group filter-group-date">

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

                {/* ========================================
                    DATA FINAL
                ======================================== */}

                <div className="filter-group filter-group-date">

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

                {/* ========================================
                    AGENTE
                ======================================== */}

                <div className="filter-group filter-group-agent">

                    <label>
                        <User size={12}/>
                        AGENTE
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

                {/* ========================================
                    LOCALIDADE
                ======================================== */}

                <div className="filter-group filter-group-locality">

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

                {/* ========================================
                    AGRUPAMENTO
                ======================================== */}

                <div className="filter-group filter-group-groupby">

                    <label>
                        <BarChart size={12}/>
                        AGRUPAMENTO
                    </label>

                    <select
                        value={filters.groupBy}
                        onChange={(e)=>
                            setFilters({
                                ...filters,
                                groupBy:
                                    e.target
                                        .value as any
                            })
                        }
                    >

                        <option value="day">
                            Diário
                        </option>

                        <option value="week">
                            Semanal
                        </option>

                        <option value="month">
                            Mensal
                        </option>

                    </select>

                </div>

                {/* ========================================
                    ACTIONS
                ======================================== */}

                <div className="filter-actions">

                    <button
                        className="btn-clear"
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