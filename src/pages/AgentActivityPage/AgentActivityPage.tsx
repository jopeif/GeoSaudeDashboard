import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";

import { AgentsTab } from "./components/AgentsTab";
import { RegistrationRequestsTab } from "./components/RegistrationRequestsTab";
import { AddUserModal, type RoleType } from "../../components/AddUserModal/AddUserModal";

import "./AgentsActivity.css";

type TabType = "agents" | "requests";

export const AgentsActivityPage = () => {

    const [activeTab, setActiveTab] =
        useState<TabType>("agents");
    
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [modalRole, setModalRole] = useState<RoleType>('AGENT');
    const [refreshCounter, setRefreshCounter] = useState(0);

    const handleOpenAddUser = (role: RoleType) => {
        setModalRole(role);
        setIsAddUserOpen(true);
    };

    const handleUserAdded = () => {
        setRefreshCounter(prev => prev + 1);
    };

    return (
        <div className="dashboard-home agents-page">

            <div className="agents-header">

                <h2 className="agents-page-title">
                    Agentes
                </h2>

                <div className="agents-header-actions">
                    <div className="agents-tabs">

                        <button
                            className={
                                activeTab === "agents"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveTab("agents")
                            }
                        >
                            Agentes
                        </button>

                        <button
                            className={
                                activeTab === "requests"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveTab("requests")
                            }
                        >
                            Solicitações de cadastro
                        </button>

                    </div>

                    <div className="agents-actions-group" style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            className="btn-add-agent btn-add-supervisor"
                            onClick={() => handleOpenAddUser('SUPERVISOR')}
                        >
                            <ShieldCheck size={18} />
                            Criar Supervisor
                        </button>
                        <button 
                            className="btn-add-agent"
                            onClick={() => handleOpenAddUser('AGENT')}
                        >
                            <Plus size={18} />
                            Criar Agente
                        </button>
                    </div>
                </div>

            </div>

            <div className="agents-tab-content">

                {
                    activeTab === "agents"
                        ? <AgentsTab refreshTrigger={refreshCounter} />
                        : <RegistrationRequestsTab />
                }

            </div>

            <AddUserModal 
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onSuccess={handleUserAdded}
                defaultRole={modalRole}
                fixedRole={true}
            />

        </div>
    );

};