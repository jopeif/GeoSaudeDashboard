// src/pages/Heatmap/components/HeatmapFilters.tsx
import React from 'react';
import { Filter, User, Calendar } from 'lucide-react';

interface FiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
    onApply: () => void;
}

export const HeatmapFilters: React.FC<FiltersProps> = ({ filters, setFilters, onApply }) => {
    return (
        <div className="heatmap-filters-bar">
        <div className="filter-group">
            <Calendar size={16} />
            <input 
            type="date" 
            value={filters.startDate} 
            onChange={e => setFilters({...filters, startDate: e.target.value})} 
            />
            <span>até</span>
            <input 
            type="date" 
            value={filters.endDate} 
            onChange={e => setFilters({...filters, endDate: e.target.value})} 
            />
        </div>

        <div className="filter-group">
            <User size={16} />
            <select value={filters.userId} onChange={e => setFilters({...filters, userId: e.target.value})}>
            <option value="">Todos os Agentes</option>
            {/* Mapear agentes aqui */}
            </select>
        </div>

        <button className="btn-apply-filters" onClick={onApply}>
            <Filter size={16} /> Aplicar Filtros
        </button>
        </div>
    );
};