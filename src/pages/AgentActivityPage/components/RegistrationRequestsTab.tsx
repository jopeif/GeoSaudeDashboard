import { useEffect, useMemo, useState } from "react";

import {
    Search,
    User,
    Mail,
    Phone,
    Check,
    X,
    Calendar,
    Shield
} from "lucide-react";

import { registrationRequestService } from "../../../services/RegistrationRequest.service";

import type {
    RegistrationRequests
} from "../../../types/registrationRequest";

import "./RegistrationRequestsTab.css";

type StatusFilter =
    | "ALL"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

type RoleFilter =
    | "ALL"
    | "AGENT"
    | "SUPERVISOR";

export const RegistrationRequestsTab = () => {

    const [requests, setRequests] = useState<
        RegistrationRequests[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoadingId, setActionLoadingId] =
        useState<string | null>(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("PENDING");

    const [roleFilter, setRoleFilter] =
        useState<RoleFilter>("ALL");

    useEffect(() => {

        fetchRequests();

    }, []);

    const fetchRequests = async () => {

        setLoading(true);

        try {

            const response =
                await registrationRequestService.findAll();
            if (
                response.success &&
                response.registrationRequest
            ) {

                setRequests(
                    response.registrationRequest
                );

            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleAccept = async (
        id: string
    ) => {

        setActionLoadingId(id);

        try {

            const response =
                await registrationRequestService.accept(
                    id
                );

            if (response.success) {

                setRequests((prev) =>
                    prev.map((request) =>
                        request.id === id
                            ? {
                                ...request,
                                status: "APPROVED"
                            }
                            : request
                    )
                );

            }

        } catch (error) {

            console.error(error);

        } finally {

            setActionLoadingId(null);

        }

    };

    const handleReject = async (
        id: string
    ) => {

        setActionLoadingId(id);

        try {

            const response =
                await registrationRequestService.reject(
                    id
                );

            if (response.success) {

                setRequests((prev) =>
                    prev.map((request) =>
                        request.id === id
                            ? {
                                ...request,
                                status: "REJECTED"
                            }
                            : request
                    )
                );

            }

        } catch (error) {

            console.error(error);

        } finally {

            setActionLoadingId(null);

        }

    };

    const filteredRequests =
        useMemo(() => {

            return requests.filter(
                (request) => {

                    const search =
                        searchTerm.toLowerCase();

                    const matchesSearch =
                        request.name
                            .toLowerCase()
                            .includes(search) ||

                        request.email
                            .toLowerCase()
                            .includes(search) ||

                        request.registration
                            .toLowerCase()
                            .includes(search) ||

                        request.block
                            .toLowerCase()
                            .includes(search);

                    const matchesStatus =
                        statusFilter === "ALL"
                            ? true
                            : request.status ===
                            statusFilter;

                    const matchesRole =
                        roleFilter === "ALL"
                            ? true
                            : request.role ===
                            roleFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesRole
                    );

                }
            );

        }, [
            requests,
            searchTerm,
            statusFilter,
            roleFilter
        ]);

    const getRoleLabel = (
        role: string
    ) => {

        switch (role) {

            case "AGENT":
                return "Agente";

            case "SUPERVISOR":
                return "Supervisor";

            default:
                return role;

        }

    };

    const getStatusLabel = (
        status: string
    ) => {

        switch (status) {

            case "PENDING":
                return "Pendente";

            case "APPROVED":
                return "Aceita";

            case "REJECTED":
                return "Rejeitada";

            default:
                return status;

        }

    };

    return (

        <div className="registration-requests">

            <section className="registration-filters">

                <div className="registration-search">

                    <Search size={16} />

                    <input
                        type="text"
                        placeholder={
                            "Buscar por nome, email, bloco ou matrícula..."
                        }
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="registration-filter-row">

                    <div className="registration-status-filters">

                        <button
                            className={
                                statusFilter ===
                                    "PENDING"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "PENDING"
                                )
                            }
                        >
                            Pendentes
                        </button>

                        <button
                            className={
                                statusFilter ===
                                    "APPROVED"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "APPROVED"
                                )
                            }
                        >
                            Aceitas
                        </button>

                        <button
                            className={
                                statusFilter ===
                                    "REJECTED"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "REJECTED"
                                )
                            }
                        >
                            Rejeitadas
                        </button>

                        <button
                            className={
                                statusFilter ===
                                    "ALL"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter(
                                    "ALL"
                                )
                            }
                        >
                            Todas
                        </button>

                    </div>

                    <div className="registration-role-filter">

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(
                                    e.target
                                        .value as RoleFilter
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

                        </select>

                    </div>

                    <div className="registration-total">

                        {filteredRequests.length}
                        {" "}
                        solicitações

                    </div>

                </div>

            </section>

            {
                loading ? (

                    <div className="registration-loading">

                        Carregando solicitações...

                    </div>

                ) : filteredRequests.length === 0 ? (

                    <div className="registration-empty">

                        Nenhuma solicitação encontrada.

                    </div>

                ) : (

                    <div className="registration-grid">

                        {
                            filteredRequests.map(
                                (request) => (

                                    <div
                                        key={
                                            request.id
                                        }
                                        className="registration-card"
                                    >

                                        <div className="registration-header">

                                            <div className="registration-avatar">

                                                <User
                                                    size={
                                                        20
                                                    }
                                                />

                                            </div>

                                            <div>

                                                <h3>

                                                    {
                                                        request.name
                                                    }

                                                </h3>

                                                <span
                                                    className={`registration-status registration-status-${request.status.toLowerCase()}`}
                                                >

                                                    {
                                                        getStatusLabel(
                                                            request.status
                                                        )
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                        <div className="registration-info">

                                            <div>

                                                <Mail
                                                    size={
                                                        14
                                                    }
                                                />

                                                <span>

                                                    {
                                                        request.email
                                                    }

                                                </span>

                                            </div>

                                            <div>

                                                <Phone
                                                    size={
                                                        14
                                                    }
                                                />

                                                <span>

                                                    {
                                                        request.phoneNumber
                                                    }

                                                </span>

                                            </div>

                                            <div>

                                                <Shield
                                                    size={
                                                        14
                                                    }
                                                />

                                                <span>

                                                    {
                                                        getRoleLabel(
                                                            request.role
                                                        )
                                                    }

                                                </span>

                                            </div>

                                            <div>

                                                <Calendar
                                                    size={
                                                        14
                                                    }
                                                />

                                                <span>

                                                    {new Date(
                                                        request.createdAt
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}

                                                </span>

                                            </div>

                                        </div>

                                        <div className="registration-details">

                                            <p>

                                                <strong>
                                                    Matrícula:
                                                </strong>
                                                {" "}
                                                {
                                                    request.registration
                                                }

                                            </p>

                                            <p>

                                                <strong>
                                                    Bloco:
                                                </strong>
                                                {" "}
                                                {
                                                    request.block
                                                }

                                            </p>

                                        </div>

                                        {
                                            request.status ===
                                            "PENDING" && (

                                                <div className="registration-actions">

                                                    <button
                                                        className="reject-btn"
                                                        disabled={
                                                            actionLoadingId ===
                                                            request.id
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                request.id
                                                            )
                                                        }
                                                    >

                                                        <X
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Recusar

                                                    </button>

                                                    <button
                                                        className="accept-btn"
                                                        disabled={
                                                            actionLoadingId ===
                                                            request.id
                                                        }
                                                        onClick={() =>
                                                            handleAccept(
                                                                request.id
                                                            )
                                                        }
                                                    >

                                                        <Check
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Aceitar

                                                    </button>

                                                </div>

                                            )
                                        }

                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }

        </div>

    );

};