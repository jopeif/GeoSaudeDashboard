import {
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';

import './AdminPanelSelector.css';

interface AdminPanelSelectorProps {
    onSupervisor: () => void;
    onAdmin: () => void;
}

export const AdminPanelSelector = ({
    onSupervisor,
    onAdmin
}: AdminPanelSelectorProps) => {
    return (
        <div className="panel-selector-overlay">

        <div className="panel-selector-card">

            <span className="panel-selector-badge">
            Acesso Administrativo
            </span>

            <h2 className="panel-selector-title">
            Escolha o ambiente
            </h2>

            <p className="panel-selector-subtitle">
            Seu perfil possui privilégios administrativos.
            Escolha qual painel deseja acessar.
            </p>

            <div className="panel-selector-options">

            <button
                className="panel-option-btn"
                onClick={onSupervisor}
            >
                <div className="panel-option-icon">
                <Activity size={20} />
                </div>

                <div className="panel-option-content">
                <strong>
                    Painel de Supervisão
                </strong>

                <span>
                    Monitoramento epidemiológico
                </span>
                </div>

                <ChevronRight size={18} />
            </button>


            <button
                className="panel-option-btn primary"
                onClick={onAdmin}
            >
                <div className="panel-option-icon">
                <Shield size={20} />
                </div>

                <div className="panel-option-content">
                <strong>
                    Painel Administrativo
                </strong>

                <span>
                    Gestão avançada do sistema
                </span>
                </div>

                <ChevronRight size={18} />
            </button>

            </div>

        </div>

        </div>
    );
};