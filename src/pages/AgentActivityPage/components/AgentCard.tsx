import { useNavigate } from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ChevronRight,
    Shield
} from "lucide-react";

import type { UserDetails } from "../../../types/user";

import "./AgentCard.css";

interface AgentCardProps {
    user: UserDetails;
}

export const AgentCard = ({
    user
}: AgentCardProps) => {

    const navigate = useNavigate();

    const roleLabels = {
        AGENT: "Agente",
        SUPERVISOR: "Supervisor",
        ADM: "Administrador"
    };

    return (

        <div
            className="agent-card"
            onClick={() =>
                navigate(`/agent/${user.id}`)
            }
        >

            <div className="agent-card-header">

                <div className="agent-avatar">

                    <User size={22}/>

                </div>

                <div className="agent-header-text">

                    <h3>

                        {user.name}

                    </h3>

                    <span
                        className={`agent-role role-${user.role.toLowerCase()}`}
                    >

                        {
                            roleLabels[user.role]
                        }

                    </span>

                </div>

            </div>

            <div className="agent-card-content">

                <div>

                    <Mail size={15}/>

                    <span>

                        {user.email}

                    </span>

                </div>

                <div>

                    <Phone size={15}/>

                    <span>

                        {user.phoneNumber}

                    </span>

                </div>

                {

                    user.registration &&

                    <div>

                        <Shield size={15}/>

                        <span>

                            {user.registration}

                        </span>

                    </div>

                }

                {

                    user.block &&

                    <div>

                        <MapPin size={15}/>

                        <span>

                            Bloco {user.block}

                        </span>

                    </div>

                }

                <div>

                    <Calendar size={15}/>

                    <span>

                        {

                            new Date(
                                user.createdAt
                            ).toLocaleDateString(
                                "pt-BR"
                            )

                        }

                    </span>

                </div>

            </div>

            <div className="agent-card-footer">

                <span
                    className={
                        user.banned
                            ? "agent-status banned"
                            : "agent-status active"
                    }
                >

                    {

                        user.banned
                            ? "Bloqueado"
                            : "Em atividade"

                    }

                </span>

                <ChevronRight
                    size={18}
                    className="agent-arrow"
                />

            </div>

        </div>

    );

};