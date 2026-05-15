import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    User,
    MapPin,
    ChevronRight,
    Search
} from 'lucide-react';

import { userService } from '../../services/User.service';

import type { UserDetails } from '../../types/user';

import './AgentsActivity.css';

export const AgentsActivityPage = () => {

    const roleLabels: Record<string, string> = {
        AGENT: 'Agente',
        SUPERVISOR: 'Supervisor',
        ADM: 'Administrador',
        ADMIN: 'Administrador',
        SUPERADMIN: 'Super Administrador'
    };


    const navigate = useNavigate();

    const [users, setUsers] = useState<UserDetails[]>([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const [onlyAgents, setOnlyAgents] =
        useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            try {
                const response =    
                    await userService.findAll();

                if (
                    response.success &&
                    response.users
                ) {
                    setUsers(response.users);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesRole =
                onlyAgents
                    ? user.role === 'AGENT'
                    : true;

            return matchesSearch && matchesRole;
        });
    }, [
        users,
        searchTerm,
        onlyAgents
    ]);

    return (
        <div className="dashboard-home agents-page">

            <h2 className="agents-page-title">
                Agentes em Campo
            </h2>

            <section className="agents-filter-container">

                <div className="agents-filter-grid">

                    {/* SEARCH */}
                    <div className="agents-filter-group">

                        <label>
                            <Search size={12}/>
                            BUSCAR USUÁRIO
                        </label>

                        <input
                            type="text"
                            placeholder="Digite o nome..."
                            value={searchTerm}
                            onChange={(e)=>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {/* TOGGLE */}
                    <div className="agents-filter-group">

                        <label>
                            MOSTRAR APENAS AGENTES
                        </label>

                        <button
                            type="button"
                            className={`agents-toggle-btn ${
                                onlyAgents
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setOnlyAgents(
                                    (prev) => !prev
                                )
                            }
                        >

                            <span
                                className="agents-toggle-thumb"
                            />

                            <span className="agents-toggle-label">

                                {
                                    onlyAgents
                                        ? 'Somente agentes'
                                        : 'Todos usuários'
                                }

                            </span>

                        </button>

                    </div>

                    {/* TOTAL */}
                    <div className="agents-filter-group">

                        <label>
                            TOTAL
                        </label>

                        <span className="agents-kpi-value">

                            {
                                loading
                                    ? 'Carregando...'
                                    : `${filteredUsers.length} usuários`
                            }

                        </span>

                    </div>

                </div>

            </section>

            {
                loading ? (

                    <div className="agents-loading">
                        Carregando usuários...
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="agents-empty">
                        Nenhum usuário encontrado.
                    </div>

                ) : (

                    <div className="agents-grid">

                        {
                            filteredUsers.map((user) => (

                                <div
                                    key={user.id}
                                    className="agent-card"
                                    onClick={() =>
                                        navigate(
                                            `/agents/${user.id}`
                                        )
                                    }
                                >

                                    <div className="agent-card-info">

                                        <div className="avatar-circle">

                                            <User
                                                size={20}
                                                color="#469472"
                                            />

                                        </div>

                                        <div className="user-text">

                                            <p className="agent-name">
                                                {user.name}
                                            </p>

                                            <p className="agent-id">

                                                ID:{' '}

                                                {
                                                    user.id.substring(
                                                        0,
                                                        8
                                                    )
                                                }

                                            </p>

                                            <span
                                                className={`role-badge role-${user.role.toLowerCase()}`}
                                            >
                                                {
                                                    roleLabels[user.role]
                                                    || user.role
                                                }
                                            </span>

                                        </div>

                                    </div>

                                    <div className="agent-card-footer">

                                        <div className="agent-meta">

                                            <MapPin size={14}/>

                                            <span>

                                                {
                                                    user.banned
                                                        ? 'Usuário Bloqueado'
                                                        : 'Em atividade'
                                                }

                                            </span>

                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="arrow-icon"
                                        />

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>
    );
};