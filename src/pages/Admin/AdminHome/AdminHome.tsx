import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Plus,
    ArrowUpDown
} from "lucide-react";



import type {
    HealthDepartment
} from "../../../types/healthDepartment";

import "./AdminHome.css";
import { HealthDepartmentService } from "../../../services/HealthDepartment.service";
import { CreateHealthDepartmentModal } from "./components/CreateHealthDepartmentModal";
import { AddUserModal, type RoleType } from "../../../components/AddUserModal/AddUserModal";
import { UserPlus, ShieldAlert } from "lucide-react";

type SortField =
    | "name"
    | "city"
    | "state";

export const AdminHome = () => {

    const [healthDepartments, setHealthDepartments] =
        useState<HealthDepartment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [sortField, setSortField] =
        useState<SortField>("name");

    const [sortAsc, setSortAsc] =
        useState(true);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [creating, setCreating] =
    useState(false);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [modalRole, setModalRole] = useState<RoleType>('ADMIN');
    const [modalDept, setModalDept] = useState('');
    const [modalDeptFixed, setModalDeptFixed] = useState(false);

    const handleOpenAddUserRole = (role: RoleType) => {
        setModalRole(role);
        setModalDept('');
        setModalDeptFixed(false);
        setIsAddUserOpen(true);
    };

    const handleOpenAddDeptUser = (role: RoleType, deptName: string) => {
        setModalRole(role);
        setModalDept(deptName);
        setModalDeptFixed(true);
        setIsAddUserOpen(true);
    };

    const [formData, setFormData] =
        useState({
            name: "",
            city: "",
            state: "",
            primarySupervisor: {
                name: "",
                email: "",
                phoneNumber: "",
                password: ""
            }
        });
    
    const resetForm = () => {

        setFormData({

            name: "",

            city: "",

            state: "",

            primarySupervisor: {

                name: "",

                email: "",

                phoneNumber: "",

                password: ""

            }

        });

};

const handleCreateHealthDepartment =
    async () => {

        try {

            setCreating(true);

            const response =
                await HealthDepartmentService.create(
                    formData
                );

            if (response.success) {

                setShowCreateModal(false);

                resetForm();

                fetchHealthDepartments();

            }

        } finally {

            setCreating(false);

        }

    };

    const fetchHealthDepartments =
        async () => {

            setLoading(true);

            try {

                const response =
                    await HealthDepartmentService.findAll();

                if (
                    response.success &&
                    response.data
                ) {

                    setHealthDepartments(
                        response.data
                    );

                }

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        fetchHealthDepartments();

    }, []);

    const filteredDepartments =
        useMemo(() => {

            let result =
                [...healthDepartments];

            result =
                result.filter(
                    department => {

                        const matchesSearch =

                            department.name
                                .toLowerCase()
                                .includes(
                                    searchTerm.toLowerCase()
                                )

                            ||

                            department.city
                                .toLowerCase()
                                .includes(
                                    searchTerm.toLowerCase()
                                );

                        const matchesStatus =

                            statusFilter

                                ?

                                department.status === statusFilter

                                :

                                true;

                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );

            result.sort((a, b) => {

                const compare =

                    a[sortField]
                        .toString()
                        .localeCompare(
                            b[sortField].toString()
                        );

                return sortAsc

                    ?

                    compare

                    :

                    compare * -1;

            });

            return result;

        }, [

            healthDepartments,

            searchTerm,

            statusFilter,

            sortField,

            sortAsc

        ]);

    const toggleSort =
        (
            field: SortField
        ) => {

            if (
                field === sortField
            ) {

                setSortAsc(
                    prev => !prev
                );

                return;

            }

            setSortField(field);

            setSortAsc(true);

        };

    return (
        <div className="admin-page">

            {/* RESUMO */}

            <section className="admin-summary">

                <div className="summary-card">

                    <span>Total</span>

                    <strong>
                        {healthDepartments.length}
                    </strong>

                </div>

                <div className="summary-card">

                    <span>Ativas</span>

                    <strong>

                        {
                            healthDepartments.filter(
                                x => x.status === "ACTIVE"
                            ).length
                        }

                    </strong>

                </div>

                <div className="summary-card">

                    <span>Inativas</span>

                    <strong>

                        {
                            healthDepartments.filter(
                                x => x.status === "INACTIVE"
                            ).length
                        }

                    </strong>

                </div>

            </section>

            {/* FILTROS */}

            <section className="admin-toolbar">

                <div className="admin-toolbar-left">

                    <div className="admin-search">

                        <Search size={16} />

                        <input
                            placeholder="Buscar por nome ou cidade..."
                            value={searchTerm}
                            onChange={e =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={e =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todas
                        </option>

                        <option value="ACTIVE">
                            Ativas
                        </option>

                        <option value="INACTIVE">
                            Inativas
                        </option>

                    </select>

                </div>

                <div className="admin-toolbar-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        className="admin-users-create-btn"
                        onClick={() => handleOpenAddUserRole('ADMIN')}
                        style={{ background: 'var(--text-main)', color: 'var(--card-bg)' }}
                    >
                        <ShieldAlert size={18} />
                        Novo Admin
                    </button>

                    <button
                        className="admin-users-create-btn"
                        onClick={() => handleOpenAddUserRole('SUPERVISOR')}
                    >
                        <UserPlus size={18} />
                        Novo Supervisor
                    </button>

                    <button
                        className="admin-users-create-btn"
                        onClick={() => handleOpenAddUserRole('AGENT')}
                    >
                        <UserPlus size={18} />
                        Novo Agente
                    </button>

                    <button
                        className="admin-users-create-btn"
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                    >
                        <Plus size={18} />
                        Nova Secretaria
                    </button>
                </div>

            </section>

            {/* TABELA */}

            <section className="admin-table-card">

                {

                    loading ?

                        <div className="admin-loading">

                            Carregando secretarias...

                        </div>

                        :

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th
                                        onClick={() =>
                                            toggleSort("name")
                                        }
                                    >

                                        Nome

                                        <ArrowUpDown size={14} />

                                    </th>

                                    <th
                                        onClick={() =>
                                            toggleSort("city")
                                        }
                                    >

                                        Cidade

                                        <ArrowUpDown size={14} />

                                    </th>

                                    <th
                                        onClick={() =>
                                            toggleSort("state")
                                        }
                                    >

                                        Estado

                                        <ArrowUpDown size={14} />

                                    </th>

                                    <th>

                                        Supervisor Principal

                                    </th>

                                    <th>

                                        Status

                                    </th>

                                    <th>

                                        Ações

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredDepartments.map(
                                        department => (

                                            <tr
                                                key={
                                                    department.id
                                                }
                                            >

                                                <td>

                                                    {
                                                        department.name
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        department.city
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        department.state
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        department.primarySupervisor
                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${
                                                            department.status === "ACTIVE"
                                                                ? "active"
                                                                : "inactive"
                                                        }`}
                                                    >

                                                        {
                                                            department.status === "ACTIVE"
                                                                ? "Ativa"
                                                                : "Inativa"
                                                        }

                                                    </span>

                                                </td>

                                                <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                                                    <button 
                                                        className="table-action-btn"
                                                        onClick={() => handleOpenAddDeptUser('SUPERVISOR', department.id)}
                                                        title="Adicionar Supervisor"
                                                    >
                                                        <UserPlus size={14} />
                                                        Sup.
                                                    </button>
                                                    <button 
                                                        className="table-action-btn"
                                                        onClick={() => handleOpenAddDeptUser('AGENT', department.id)}
                                                        title="Adicionar Agente"
                                                    >
                                                        <UserPlus size={14} />
                                                        Agente
                                                    </button>

                                                    <button className="table-action-btn" style={{ marginLeft: 'auto' }}>

                                                        {
                                                            department.status === "ACTIVE"
                                                                ? "Inativar"
                                                                : "Ativar"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                }

                            </tbody>

                        </table>

                }

            </section>

            {

                showCreateModal &&

                <CreateHealthDepartmentModal
                    open={showCreateModal}
                    creating={creating}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => {

                        setShowCreateModal(false);

                        resetForm();

                    }}
                    onSubmit={handleCreateHealthDepartment}
                />

            }

            <AddUserModal 
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onSuccess={() => fetchHealthDepartments()}
                defaultRole={modalRole}
                fixedRole={true}
                defaultHealthDepartment={modalDept}
                fixedHealthDepartment={modalDeptFixed}
            />

        </div>
    );

};