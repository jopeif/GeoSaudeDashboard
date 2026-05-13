import { useEffect, useState, useCallback } from 'react';
import { MapPin, Calendar, Clock, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { visitService } from '../../../services/Visit.service';
import type { VisitHistoryShallowItem, AgentHistoryPaginatedResponse } from '../../../types/visit';
import './AgentVisitHistory.css';

interface AgentVisitHistoryProps {
    userId: string;
}

export const AgentVisitHistory = ({ userId }: AgentVisitHistoryProps) => {
    const [visits, setVisits] = useState<VisitHistoryShallowItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    // Estados de Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchHistory = useCallback(async (page: number, isNewSearch: boolean = false) => {
        if (isNewSearch) setLoading(true);
        else setLoadingMore(true);

        try {
            const response: AgentHistoryPaginatedResponse = await visitService.getHistoryByAgentPaginated   ({
                userId,
                page,
                limit: 10 // Retornando apenas 10 por vez para performance
            });

            if (response.success) {
                if (isNewSearch) {
                    setVisits(response.data);
                } else {
                    setVisits(prev => [...prev, ...response.data]);
                }
                
                setTotalCount(response.meta.totalItems);
                setHasMore(response.meta.currentPage < response.meta.totalPages);
            }
        } catch (error) {
            console.error("Erro ao carregar histórico de visitas:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId]);

    // Reinicia a busca se o userId mudar
    useEffect(() => {
        setCurrentPage(1);
        fetchHistory(1, true);
    }, [userId, fetchHistory]);

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchHistory(nextPage);
    };

    if (loading) return <div className="history-loader">Carregando histórico...</div>;

    return (
        <aside className="agent-history-sidebar">
            <div className="history-header">
                <h3>Histórico de Visitas</h3>
                <span className="count-tag">{totalCount} registros</span>
            </div>

            <div className="history-list">
                {visits.length === 0 ? (
                    <div className="empty-history">
                        <p>Nenhuma visita encontrada para este agente.</p>
                    </div>
                ) : (
                    <>
                        {visits.map((visit) => (
                            <Link to={`/visit/${visit.id}`} key={visit.id} className="history-link">
                                <div className={`history-item ${visit.depositsWithFocus ? 'has-focus' : ''}`}>
                                    <div className="history-status-icon">
                                        {visit.depositsWithFocus ? 
                                            <AlertCircle size={16} color="#ef4444" /> : 
                                            <CheckCircle2 size={16} color="#10b981" />
                                        }
                                    </div>
                                    
                                    <div className="history-details">
                                        <div className="history-main-info">
                                            <span className="history-street">{visit.streetName}, {visit.number}</span>
                                            <span className="history-date">
                                                <Calendar size={10} /> {new Date(visit.visitDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        
                                        <div className="history-meta">
                                            <span className="history-locality">
                                                <MapPin size={10} /> {visit.localityCode}
                                            </span>
                                            {visit.entryTime && (
                                                <span className="history-time">
                                                    <Clock size={10} /> {visit.entryTime}
                                                </span>
                                            )}
                                        </div>

                                        <div className="history-tags">
                                            <span className="type-tag">{visit.visitType}</span>
                                            <span className="prop-tag">{visit.propertyType.replace('_', ' ')}</span>
                                        </div>

                                        {visit.notes && (
                                            <p className="history-notes">{visit.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {hasMore && (
                            <button 
                                className="btn-load-more" 
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Carregando..." : (
                                    <>Ver mais <ChevronDown size={14} /></>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};