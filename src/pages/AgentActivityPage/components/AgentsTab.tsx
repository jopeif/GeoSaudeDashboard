import { useEffect, useMemo, useState } from "react";

import { Search } from "lucide-react";

import { userService } from "../../../services/User.service";

import { AgentCard } from "./AgentCard";

import type {
    UserDetails
} from "../../../types/user";

import "./AgentsTab.css";

type RoleFilter =
    | "ALL"
    | "AGENT"
    | "SUPERVISOR"
    | "ADM";

type StatusFilter =
    | "ALL"
    | "ACTIVE"
    | "BANNED";

interface AgentsTabProps {
    refreshTrigger?: number;
}

export const AgentsTab = ({ refreshTrigger = 0 }: AgentsTabProps) => {

    const [users, setUsers] =
        useState<UserDetails[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState<RoleFilter>("ALL");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ACTIVE");

    useEffect(() => {

        fetchUsers();

    }, [refreshTrigger]);

    const fetchUsers = async () => {

        setLoading(true);

        try {

            const response =
                await userService.findAll({
                    page: 1,
                    limit: 1000
                });

            if (
                response.success &&
                response.users
            ) {

                setUsers(response.users);

            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const filteredUsers =
        useMemo(() => {

            return users.filter(user => {

                const search =
                    searchTerm.toLowerCase();

                const matchesSearch =

                    (user.name ?? "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (user.email ?? "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (user.registration ?? "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (user.block ?? "")
                        .toLowerCase()
                        .includes(search);

                const matchesRole =

                    roleFilter === "ALL"

                    ||

                    user.role === roleFilter;

                const matchesStatus =

                    statusFilter === "ALL"

                    ||

                    (
                        statusFilter === "ACTIVE"
                        && !user.banned
                    )

                    ||

                    (
                        statusFilter === "BANNED"
                        && user.banned
                    );

                return (

                    matchesSearch &&
                    matchesRole &&
                    matchesStatus

                );

            });

        }, [

            users,
            searchTerm,
            roleFilter,
            statusFilter

        ]);

    return (

        <div className="agents-tab">

            <section className="agents-filters">

                <div className="agents-search">

                    <Search size={16} />

                    <input
                        type="text"
                        placeholder="Buscar por nome, email, matrícula ou bloco..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="agents-filter-row">

                    <div className="agents-status-filter">

                        <button
                            className={
                                statusFilter === "ACTIVE"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "ACTIVE"
                                )
                            }
                        >
                            Ativos
                        </button>

                        <button
                            className={
                                statusFilter === "BANNED"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "BANNED"
                                )
                            }
                        >
                            Bloqueados
                        </button>

                        <button
                            className={
                                statusFilter === "ALL"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "ALL"
                                )
                            }
                        >
                            Todos
                        </button>

                    </div>

                    <div className="agents-role-filter">

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(
                                    e.target.value as RoleFilter
                                )
                            }
                        >

                            <option value="ALL">
                                Todos os cargos
                            </option>

                            <option value="AGENT">
                                Agentes
                            </option>

                            <option value="SUPERVISOR">
                                Supervisores
                            </option>

                            <option value="ADM">
                                Administradores
                            </option>

                        </select>

                    </div>

                    <div className="agents-total">

                        {filteredUsers.length}
                        {" "}
                        usuários

                    </div>

                </div>

            </section>

            {

                loading

                ?

                <div className="agents-loading">

                    Carregando usuários...

                </div>

                :

                filteredUsers.length === 0

                ?

                <div className="agents-empty">

                    Nenhum usuário encontrado.

                </div>

                :

                <div className="agents-grid">

                    {

                        filteredUsers.map(user => (

                            <AgentCard
                                key={user.id}
                                user={user}
                            />

                        ))

                    }

                </div>

            }

        </div>

    );

};