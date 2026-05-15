import {
    X,
    UserPlus,
    Shield,
    UserCog,
    User
} from 'lucide-react';
import './CreateUserModal.css';

type CreateRole =
    | 'AGENT'
    | 'SUPERVISOR'
    | 'ADM';

interface CreateUserModalProps {
    open: boolean;

    creatingUser: boolean;

    createRole: CreateRole;

    formData: {
        name: string;
        email: string;
        phoneNumber: string;
        password: string;
        registration: string;
        block: string;
        accessLevel: number;
    };

    setCreateRole: (
        role: CreateRole
    ) => void;

    setFormData: React.Dispatch<
        React.SetStateAction<any>
    >;

    onClose: () => void;

    onSubmit: () => void;
}

export const CreateUserModal = ({
    open,
    creatingUser,
    createRole,
    formData,
    setCreateRole,
    setFormData,
    onClose,
    onSubmit
}: CreateUserModalProps) => {

    if (!open) {
        return null;
    }

    return (
        <div className="create-user-overlay">

            <div className="create-user-modal">

                {/* =========================
                   HEADER
                ========================= */}

                <div className="create-user-header">

                    <div>

                        <h2>
                            Criar usuário
                        </h2>

                        <p>
                            Cadastre novos usuários no sistema.
                        </p>

                    </div>

                    <button
                        className="close-modal-btn"
                        onClick={onClose}
                    >
                        <X size={18}/>
                    </button>

                </div>

                {/* =========================
                   ROLE SELECT
                ========================= */}

                <div className="role-selector">

                    <button
                        className={
                            createRole === 'AGENT'
                                ? 'role-card active'
                                : 'role-card'
                        }
                        onClick={() =>
                            setCreateRole(
                                'AGENT'
                            )
                        }
                    >
                        <User size={20}/>

                        <div>
                            <strong>
                                Agente
                            </strong>

                            <span>
                                Usuário de campo
                            </span>
                        </div>

                    </button>

                    <button
                        className={
                            createRole === 'SUPERVISOR'
                                ? 'role-card active'
                                : 'role-card'
                        }
                        onClick={() =>
                            setCreateRole(
                                'SUPERVISOR'
                            )
                        }
                    >
                        <UserCog size={20}/>

                        <div>
                            <strong>
                                Supervisor
                            </strong>

                            <span>
                                Gestão operacional
                            </span>
                        </div>

                    </button>

                    <button
                        className={
                            createRole === 'ADM'
                                ? 'role-card active'
                                : 'role-card'
                        }
                        onClick={() =>
                            setCreateRole(
                                'ADM'
                            )
                        }
                    >
                        <Shield size={20}/>

                        <div>
                            <strong>
                                Administrador
                            </strong>

                            <span>
                                Controle total
                            </span>
                        </div>

                    </button>

                </div>

                {/* =========================
                   FORM
                ========================= */}

                <div className="create-user-form">

                    <div className="input-group">
                        <label>
                            Nome
                        </label>

                        <input
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={(e)=>
                                setFormData(
                                    (prev:any) => ({
                                        ...prev,
                                        name:
                                            e.target.value
                                    })
                                )
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            Email
                        </label>

                        <input
                            placeholder="email@teste.com"
                            value={formData.email}
                            onChange={(e)=>
                                setFormData(
                                    (prev:any) => ({
                                        ...prev,
                                        email:
                                            e.target.value
                                    })
                                )
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            Telefone
                        </label>

                        <input
                            placeholder="(88) 99999-9999"
                            value={formData.phoneNumber}
                            onChange={(e)=>
                                setFormData(
                                    (prev:any) => ({
                                        ...prev,
                                        phoneNumber:
                                            e.target.value
                                    })
                                )
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={(e)=>
                                setFormData(
                                    (prev:any) => ({
                                        ...prev,
                                        password:
                                            e.target.value
                                    })
                                )
                            }
                        />
                    </div>

                    {
                        createRole === 'AGENT' || createRole === 'SUPERVISOR' && (
                            <>
                                <div className="input-group">
                                    <label>
                                        Matrícula
                                    </label>

                                    <input
                                        value={formData.registration}
                                        onChange={(e)=>
                                            setFormData(
                                                (prev:any) => ({
                                                    ...prev,
                                                    registration:
                                                        e.target.value
                                                })
                                            )
                                        }
                                    />
                                </div>
                            </>
                        )
                    }

                    {
                        createRole === 'AGENT' && (
                            <>

                                <div className="input-group">
                                    <label>
                                        Bloco
                                    </label>

                                    <input
                                        value={formData.block}
                                        onChange={(e)=>
                                            setFormData(
                                                (prev:any) => ({
                                                    ...prev,
                                                    block:
                                                        e.target.value
                                                })
                                            )
                                        }
                                    />
                                </div>
                            </>
                        )
                    }

                    {
                        createRole == 'ADM' && (
                            <div className="input-group">
                                <label>
                                    Nível de acesso
                                </label>

                                <input
                                    type="number"
                                    value={formData.accessLevel}
                                    onChange={(e)=>
                                        setFormData(
                                            (prev:any) => ({
                                                ...prev,
                                                accessLevel:
                                                    Number(
                                                        e.target.value
                                                    )
                                            })
                                        )
                                    }
                                />
                            </div>
                        )
                    }

                </div>

                {/* =========================
                   FOOTER
                ========================= */}

                <div className="create-user-footer">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="submit-user-btn"
                        onClick={onSubmit}
                        disabled={creatingUser}
                    >
                        <UserPlus size={18}/>

                        {
                            creatingUser
                                ? 'Criando...'
                                : 'Criar usuário'
                        }
                    </button>

                </div>

            </div>

        </div>
    );
};