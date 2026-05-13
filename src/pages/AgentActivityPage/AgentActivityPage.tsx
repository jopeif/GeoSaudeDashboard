import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ChevronRight, Search } from 'lucide-react';
import { userService } from '../../services/User.service';
import type { UserDetails } from '../../types/user';
import './AgentsActivity.css';

export const AgentsActivityPage = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<UserDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            const response = await userService.findAll();
            if (response.success && response.users) {
                setAgents(response.users.filter((u) => u.role === "AGENT"));
            }
            setLoading(false);
        };
        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-home">
            <h2 className="page-title">Agentes em Campo</h2>
            
            <section className="filter-container">
                <div className="filter-grid" style={{ gridTemplateColumns: '1fr auto' }}>
                    <div className="filter-group">
                        <label><Search size={12}/> BUSCAR AGENTE</label>
                        <input 
                            type="text" 
                            placeholder="Digite o nome..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>TOTAL</label>
                        <span className="kpi-value" style={{ fontSize: '18px' }}>
                            {loading ? "Carregando..." : `${filteredAgents.length} Agentes`}
                        </span>
                    </div>
                </div>
            </section>

            <div className="agents-grid">
                {filteredAgents.map(agent => (
                    <div 
                        key={agent.id} 
                        className="agent-card" 
                        onClick={() => navigate(`/agents/${agent.id}`)} // Redirecionamento dinâmico
                    >
                        <div className="agent-card-info">
                            <div className="avatar-circle"><User size={20} color="#469472" /></div>
                            <div className="user-text">
                                <p className="agent-name">{agent.name}</p>
                                <p className="agent-id">ID: {agent.id.substring(0, 8)}</p>
                            </div>
                        </div>
                        <div className="agent-card-footer">
                            <div className="agent-meta"><MapPin size={14} /><span>Ativo</span></div>
                            <ChevronRight size={18} className="arrow-icon" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};