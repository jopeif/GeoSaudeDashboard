import { useEffect, useMemo, useState } from 'react';

import {
    Search,
    Plus,
    Ban,
    // Pencil,
    ArrowUpDown
} from 'lucide-react';

import { userService } from '../../../services/User.service';

import type {
    UserDetails,
    AgentRegisterParams,
    SupervisorRegisterParams,
    AdmRegisterParams
} from '../../../types/user';

import './AdminHome.css';

import { CreateUserModal } from './components/CreateUserModal';

type SortField =
    | 'name'
    | 'role';

type CreateRole =
    | 'AGENT'
    | 'SUPERVISOR'
    | 'ADM';

export const AdminHome = () => {

    const roleLabels: Record<string, string> = {
        AGENT: 'Agente',
        SUPERVISOR: 'Supervisor',
        ADM: 'Administrador',
        ADMIN: 'Administrador',
        SUPERADMIN: 'Super Admin'
    };

    const [users, setUsers] =
        useState<UserDetails[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [searchTerm, setSearchTerm] =
        useState('');

    const [roleFilter, setRoleFilter] =
        useState('');

    const [showOnlyBlocked, setShowOnlyBlocked] =
        useState(false);

    const [sortField, setSortField] =
        useState<SortField>('name');

    const [sortAsc, setSortAsc] =
        useState(true);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [creatingUser, setCreatingUser] =
        useState(false);

    const [createRole, setCreateRole] =
        useState<CreateRole>('AGENT');

    const [formData, setFormData] =
        useState({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            registration: '',
            block: '',
            accessLevel: 1
        });

    const [confirmModalOpen, setConfirmModalOpen] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState<UserDetails | null>(null);

    const [banLoading, setBanLoading] =
        useState(false);
    /* ========================================
       FETCH USERS
    ======================================== */

    const fetchUsers = async () => {

        setLoading(true);

        try {

            const response =
                await userService.findAll();

            if (
                response.success &&
                response.users
            ) {

                setUsers(
                    response.users
                );

            }

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchUsers();

    }, []);

    /* ========================================
       FILTERED USERS
    ======================================== */

    const filteredUsers =
        useMemo(() => {

            let result =
                [...users];

            result =
                result.filter(
                    (user) => {

                        const matchesSearch =
                            user.name
                                .toLowerCase()
                                .includes(
                                    searchTerm.toLowerCase()
                                ) ||
                            user.email
                                .toLowerCase()
                                .includes(
                                    searchTerm.toLowerCase()
                                );

                        const matchesRole =
                            roleFilter
                                ? user.role === roleFilter
                                : true;

                        const matchesBlocked =
                            showOnlyBlocked
                                ? user.banned
                                : true;

                        return (
                            matchesSearch &&
                            matchesRole &&
                            matchesBlocked
                        );
                    }
                );

            result.sort(
                (a, b) => {

                    const valueA =
                        a[
                            sortField
                        ]
                            .toString();

                    const valueB =
                        b[
                            sortField
                        ]
                            .toString();

                    const compare =
                        valueA.localeCompare(
                            valueB
                        );

                    return sortAsc
                        ? compare
                        : compare * -1;
                }
            );

            return result;

        }, [
            users,
            searchTerm,
            roleFilter,
            showOnlyBlocked,
            sortField,
            sortAsc
        ]);

    /* ========================================
       BAN / UNBAN
    ======================================== */

    const handleBan =
        async () => {

            if (!selectedUser) {
                return;
            }

            try {

                setBanLoading(true);

                await userService.ban(
                    selectedUser.id
                );

                setConfirmModalOpen(false);

                setSelectedUser(null);

                fetchUsers();

            } finally {

                setBanLoading(false);

            }
        };

    /* ========================================
       CREATE USER
    ======================================== */

    const resetForm =
        () => {

            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                password: '',
                registration: '',
                block: '',
                accessLevel: 1
            });

            setCreateRole(
                'AGENT'
            );
        };

    const handleCreateUser =
        async () => {

            try {

                setCreatingUser(
                    true
                );

                if (
                    createRole === 'AGENT'
                ) {

                    const payload: AgentRegisterParams = {
                        name: formData.name,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                        registration: formData.registration,
                        block: formData.block
                    };

                    await userService.registerAgent(
                        payload
                    );
                }

                if (
                    createRole === 'SUPERVISOR'
                ) {

                    const payload: SupervisorRegisterParams = {
                        name: formData.name,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                        registration: formData.registration,
                    };

                    await userService.registerSupervisor(
                        payload
                    );
                }

                if (
                    createRole === 'ADM'
                ) {

                    const payload: AdmRegisterParams = {
                        name: formData.name,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                        accessLevel: Number(
                            formData.accessLevel
                        )
                    };

                    await userService.registerAdm(
                        payload
                    );
                }

                setShowCreateModal(
                    false
                );

                resetForm();

                fetchUsers();

            } finally {

                setCreatingUser(
                    false
                );

            }
        };

    /* ========================================
       SORT
    ======================================== */

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

            setSortField(
                field
            );

            setSortAsc(
                true
            );
        };

    return (
        <div className="admin-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="admin-header">

                <h2>
                    Painel Administrativo
                </h2>

            </div>

            {/* 
            ========================================
            FILTERS
            ========================================*/}

            <section className="admin-users-filter-container">

                <div className="admin-users-filter-header">

                    <div className="admin-users-filter-header-left">

                        <h3>
                            Usuários cadastrados
                        </h3>

                        <p>
                            Gerencie permissões, acessos e status dos usuários.
                        </p>

                    </div>

                    <button
                        className="admin-users-create-btn"
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                    >
                        <Plus size={18}/>
                        Novo Usuário
                    </button>

                </div>

                <div className="admin-users-filter-grid">

                    <div className="admin-users-filter-group">

                        <label>
                            <Search size={12}/>
                            BUSCAR
                        </label>

                        <input
                            value={searchTerm}
                            onChange={(e)=>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            placeholder="Nome ou email..."
                        />

                    </div>

                    <div className="admin-users-filter-group">

                        <label>
                            CARGO
                        </label>

                        <select
                            value={roleFilter}
                            onChange={(e)=>
                                setRoleFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Todos
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

                    <div className="admin-users-filter-group">

                        <label>
                            BLOQUEADOS
                        </label>

                        <button
                            className={`admin-users-toggle-btn ${
                                showOnlyBlocked
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={()=>
                                setShowOnlyBlocked(
                                    prev => !prev
                                )
                            }
                        >
                            {
                                showOnlyBlocked
                                    ? 'Mostrando bloqueados'
                                    : 'Todos usuários'
                            }
                        </button>

                    </div>

                </div>

            </section>


            {/* ========================================
                TABLE
            ======================================== */}

            {
                loading ? (

                    <div>
                        Carregando...
                    </div>

                ) : (

                    <table
                        className="admin-table"
                    >

                        <thead>

                            <tr>

                                <th
                                    onClick={()=>
                                        toggleSort(
                                            'name'
                                        )
                                    }
                                >
                                    Nome
                                    <ArrowUpDown size={14}/>
                                </th>

                                <th>
                                    Email
                                </th>

                                <th
                                    onClick={()=>
                                        toggleSort(
                                            'role'
                                        )
                                    }
                                >
                                    Cargo
                                    <ArrowUpDown size={14}/>
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
                                filteredUsers.map(
                                    user => (

                                        <tr
                                            key={user.id}
                                        >

                                            <td>
                                                {user.name}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>

                                                <span
                                                    className={`role-badge role-${user.role.toLowerCase()}`}
                                                >
                                                    {
                                                        roleLabels[
                                                            user.role
                                                        ]
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        user.banned
                                                            ? 'blocked'
                                                            : 'active'
                                                    }`}
                                                >
                                                    {
                                                        user.banned
                                                            ? 'Bloqueado'
                                                            : 'Ativo'
                                                    }
                                                </span>

                                            </td>

                                            <td className="actions">

                                                {/* <button
                                                    className="edit-btn"
                                                >
                                                    <Pencil size={16}/>
                                                </button> */}

                                                <button
                                                    className={`ban-btn ${
                                                        user.banned
                                                            ? 'unban'
                                                            : 'ban'
                                                    }`}
                                                    onClick={() => {

                                                        setSelectedUser(user);

                                                        setConfirmModalOpen(true);
                                                    }}
                                                >
                                                    <Ban size={16}/>

                                                    <span>
                                                        {
                                                            user.banned
                                                                ? 'Desbanir'
                                                                : 'Banir'
                                                        }
                                                    </span>

                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )
                            }

                        </tbody>

                    </table>

                )
            }

            {/* ========================================
                CREATE USER MODAL
            ======================================== */}

            <CreateUserModal
                open={showCreateModal}
                creatingUser={creatingUser}
                createRole={createRole}
                formData={formData}
                setCreateRole={setCreateRole}
                setFormData={setFormData}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                onSubmit={handleCreateUser}
            />

            {
                confirmModalOpen &&
                selectedUser && (

                    <div className="confirm-overlay">

                        <div className="confirm-modal">

                            <div className="confirm-icon">
                                <Ban size={28}/>
                            </div>

                            <h3>
                                {
                                    selectedUser.banned
                                        ? 'Desbanir usuário?'
                                        : 'Banir usuário?'
                                }
                            </h3>

                            <p>
                                {
                                    selectedUser.banned
                                        ? `O usuário ${selectedUser.name} poderá acessar o sistema novamente.`
                                        : `O usuário ${selectedUser.name} perderá acesso ao sistema.`
                                }
                            </p>

                            <div className="confirm-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={() => {

                                        setConfirmModalOpen(false);

                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className={`confirm-btn ${
                                        selectedUser.banned
                                            ? 'success'
                                            : 'danger'
                                    }`}
                                    onClick={handleBan}
                                    disabled={banLoading}
                                >
                                    {
                                        banLoading
                                            ? 'Processando...'
                                            : selectedUser.banned
                                                ? 'Desbanir'
                                                : 'Banir'
                                    }
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>

        
    );
};