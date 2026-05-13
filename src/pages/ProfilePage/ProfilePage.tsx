// src/pages/ProfilePage/ProfilePage.tsx

import {
    Mail,
    Phone,
    ShieldCheck,
    Calendar,
    BadgeCheck,
    UserCircle2,
    ArrowLeft
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import './ProfilePage.css';

export const ProfilePage = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const profile = user?.profile;

    const formatRole = (role?: string) => {
        if (!role) return 'Usuário';

        switch (role.toUpperCase()) {
        case 'ADM':
        case 'ADMIN':
            return 'Administrador';

        case 'SUPERADMIN':
            return 'Super Administrador';

        case 'SUPERVISOR':
            return 'Supervisor';

        case 'AGENT':
            return 'Agente';

        default:
            return role;
        }
    };

    return (
        <div className="profile-page">
        
        <button
            className="profile-back-btn"
            onClick={() => navigate(-1)}
        >
            <ArrowLeft size={16} />
            Voltar
        </button>

        <div className="profile-card">

            <div className="profile-banner" />

            <div className="profile-header">
            <div className="profile-avatar">
                <UserCircle2 size={90} />
            </div>

            <div className="profile-main-info">
                <h1>
                {profile?.name || 'Usuário'}
                </h1>

                <span className="profile-role">
                <ShieldCheck size={14} />
                {formatRole(profile?.role)}
                </span>
            </div>
            </div>

            <div className="profile-content">

            <section className="profile-section">
                <h2>
                Informações Pessoais
                </h2>

                <div className="profile-grid">

                <div className="profile-info-card">
                    <div className="profile-info-icon">
                    <Mail size={18} />
                    </div>

                    <div>
                    <label>E-mail</label>

                    <span>
                        {profile?.email || '---'}
                    </span>
                    </div>
                </div>

                <div className="profile-info-card">
                    <div className="profile-info-icon">
                    <Phone size={18} />
                    </div>

                    <div>
                    <label>Telefone</label>

                    <span>
                        {profile?.phoneNumber || '---'}
                    </span>
                    </div>
                </div>

                <div className="profile-info-card">
                    <div className="profile-info-icon">
                    <BadgeCheck size={18} />
                    </div>

                    <div>
                    <label>Registro</label>

                    <span>
                        {profile?.registration || '---'}
                    </span>
                    </div>
                </div>

                <div className="profile-info-card">
                    <div className="profile-info-icon">
                    <Calendar size={18} />
                    </div>

                    <div>
                    <label>Criado em</label>

                    <span>
                        {profile?.createdAt
                        ? new Date(
                            profile.createdAt
                            ).toLocaleDateString(
                            'pt-BR'
                            )
                        : '---'}
                    </span>
                    </div>
                </div>

                </div>
            </section>

            <section className="profile-section">
                <h2>
                Dados do Sistema
                </h2>

                <div className="system-info-list">

                <div className="system-info-row">
                    <span>ID do Usuário</span>

                    <strong>
                    {profile?.id}
                    </strong>
                </div>

                <div className="system-info-row">
                    <span>Nível de Acesso</span>

                    <strong>
                    {profile?.accessLevel || 0}
                    </strong>
                </div>

                <div className="system-info-row">
                    <span>Status</span>

                    <strong
                    className={
                        profile?.banned
                        ? 'status-banned'
                        : 'status-active'
                    }
                    >
                    {profile?.banned
                        ? 'Bloqueado'
                        : 'Ativo'}
                    </strong>
                </div>

                </div>
            </section>

            </div>
        </div>
        </div>
    );
};