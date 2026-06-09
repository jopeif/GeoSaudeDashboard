import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, User, Mail, Phone, 
    Calendar, Hash, Shield, MapPin, Filter 
} from 'lucide-react';

import { userService } from '../../services/User.service';
import { dashboardService } from '../../services/Dashboard.service';

import { AgentRouteMap } from './components/AgentRouteMap';
import { AgentPerformanceStats } from './components/AgentPerformanceStats';
import { AgentVisitHistory } from './components/AgentVisitHistory';

import type { UserDetails } from '../../types/user';
import type { DashboardFilters } from '../../types/dashboard';

import './AgentDetails.css';

export const AgentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [agent, setAgent] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchingRoute, setFetchingRoute] = useState(false);
    const [routePoints, setRoutePoints] = useState([]);

    const initialFilters: DashboardFilters = {
        startDate: '',
        endDate: '',
        userId: id || '',
        localityCode: '',
    };
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

    const fetchRoute = useCallback(async (params: DashboardFilters) => {
        if (!id) return;
        setFetchingRoute(true);
        try {
            const response = await dashboardService.getAgentRoute({ ...params, agentId: id });
            if (response.success) setRoutePoints(response.data);
        } catch (error) {
            console.error("Erro ao carregar rota:", error);
        } finally {
            setFetchingRoute(false);
        }
    }, [id]);

    useEffect(() => {
        const loadAgent = async () => {
            if (id) {
                try {
                    const response = await userService.findById(id);
                    setAgent(response.user || null);
                } catch (error) {
                    console.error("Erro ao carregar agente:", error);
                }
            }
            setLoading(false);
        };
        loadAgent();
    }, [id]); // fetchRoute removido daqui

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchRoute(filters);
        }, 500);
        return () => clearTimeout(timeout);
    }, [filters, fetchRoute]);

    const handleClearFilters = () => {
        setFilters(initialFilters);
        fetchRoute(initialFilters);
    };

    if (loading) return <div className="page-loader">Carregando dados do agente...</div>;
    if (!agent) return <div className="page-loader">Agente não encontrado.</div>;

    return (
        <div className="agent-details-page">
            <header className="page-header">
                <button className="btn-back" onClick={() => navigate('/agents')}>
                    <ArrowLeft size={18} /> Voltar para a lista
                </button>
            </header>
            
            <div className="agent-details-wrapper">
                {/* 1. PERFIL DO AGENTE */}
                <section className="agent-profile-card">
                    <div className="agent-profile-header">
                        <div className="avatar-wrapper">
                            <User size={32} color="var(--primary)" />
                        </div>
                        <div className="profile-title">
                            <div className="name-row">
                                <h2>{agent.name}</h2>
                                <span className={`status-pill ${agent.banned ? 'banned' : 'active'}`}>
                                    {agent.banned ? 'Inativo' : 'Ativo'}
                                </span>
                            </div>
                            <span className="role-label"><Shield size={14} /> {agent.role}</span>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <div className="info-cell">
                            <label><Mail size={12} /> E-MAIL</label>
                            <span>{agent.email}</span>
                        </div>
                        <div className="info-cell">
                            <label><Phone size={12} /> TELEFONE</label>
                            <span>{agent.phoneNumber || "---"}</span>
                        </div>
                        <div className="info-cell">
                            <label><Hash size={12} /> MATRÍCULA</label>
                            <span>{agent.registration || "---"}</span>
                        </div>
                        <div className="info-cell">
                            <label><Calendar size={12} /> DESDE</label>
                            <span>{new Date(agent.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                </section>

                <div className="details-content-layout">
                    {/* COLUNA PRINCIPAL */}
                    <main className="details-main">
                        {/* FILTROS */}
                        <section className="card filter-section">
                            <div className="card-header">
                                <h3 className="card-title"><Filter size={16} /> Filtros de Trajetória</h3>
                            </div>
                            <div className="filter-controls">
                                <div className="input-group">
                                    <label>DATA INICIAL</label>
                                    <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>DATA FINAL</label>
                                    <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>LOCALIDADE</label>
                                    <input type="text" placeholder="Ex: LC-112" value={filters.localityCode} onChange={(e) => setFilters({...filters, localityCode: e.target.value})} />
                                </div>
                                <div className="filter-buttons">
                                    {fetchingRoute && <span className="filter-loading">...</span>}
                                    <button className="btn-ghost" onClick={handleClearFilters}>Limpar</button>
                                </div>
                            </div>
                        </section>

                        <AgentPerformanceStats filters={filters} />

                        <section className="card map-section">
                            <div className="card-header">
                                <h3 className="card-title"><MapPin size={16} /> Trajetória em Campo</h3>
                            </div>
                            <div className="map-container">
                                {fetchingRoute ? (
                                    <div className="map-skeleton">Sincronizando rota...</div>
                                ) : routePoints.length > 0 ? (
                                    <AgentRouteMap points={routePoints} />
                                ) : (
                                    <div className="empty-state">Nenhum registro encontrado no período selecionado. Ajuste a data inicial e a data final e clique em “Atualizar” para tentar novamente.</div>
                                )}
                            </div>
                        </section>
                    </main>

                    {/* COLUNA LATERAL */}
                    <aside className="details-sidebar">
                        <AgentVisitHistory userId={id as string} />
                    </aside>
                </div>
            </div>
        </div>
    );
};