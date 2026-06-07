import { X } from "lucide-react";

import type {
    CreateHealthDepartmentInput
} from "../../../../types/healthDepartment";

import "./CreateHealthDepartmentModal.css";

interface CreateHealthDepartmentModalProps {

    open: boolean;

    creating: boolean;

    formData: CreateHealthDepartmentInput;

    setFormData: React.Dispatch<
        React.SetStateAction<CreateHealthDepartmentInput>
    >;

    onClose: () => void;

    onSubmit: () => void;

}

export const CreateHealthDepartmentModal = ({
    open,
    creating,
    formData,
    setFormData,
    onClose,
    onSubmit
}: CreateHealthDepartmentModalProps) => {

    if (!open) {

        return null;

    }

    return (

        <div className="create-health-overlay">

            <div className="create-health-modal">

                <div className="create-health-header">

                    <h2>

                        Nova Secretaria

                    </h2>

                    <button
                        onClick={onClose}
                    >

                        <X size={18}/>

                    </button>

                </div>

                <div className="create-health-body">

                    <div className="input-group">

                        <label>

                            Nome da Secretaria

                        </label>

                        <input

                            value={formData.name}

                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }

                        />

                    </div>

                    <div className="input-row">

                        <div className="input-group">

                            <label>

                                Cidade

                            </label>

                            <input

                                value={formData.city}

                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        city: e.target.value
                                    }))
                                }

                            />

                        </div>

                        <div className="input-group">

                            <label>

                                Estado

                            </label>

                            <input

                                value={formData.state}

                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        state: e.target.value
                                    }))
                                }

                            />

                        </div>

                    </div>

                    <h3>

                        Supervisor Principal

                    </h3>

                    <div className="input-group">

                        <label>

                            Nome

                        </label>

                        <input

                            value={formData.primarySupervisor.name}

                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    primarySupervisor: {
                                        ...prev.primarySupervisor,
                                        name: e.target.value
                                    }
                                }))
                            }

                        />

                    </div>

                    <div className="input-group">

                        <label>

                            Email

                        </label>

                        <input

                            type="email"

                            value={formData.primarySupervisor.email}

                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    primarySupervisor: {
                                        ...prev.primarySupervisor,
                                        email: e.target.value
                                    }
                                }))
                            }

                        />

                    </div>

                    <div className="input-row">

                        <div className="input-group">

                            <label>

                                Telefone

                            </label>

                            <input

                                value={formData.primarySupervisor.phoneNumber}

                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        primarySupervisor: {
                                            ...prev.primarySupervisor,
                                            phoneNumber: e.target.value
                                        }
                                    }))
                                }

                            />

                        </div>

                        <div className="input-group">

                            <label>

                                Senha Inicial

                            </label>

                            <input

                                type="password"

                                value={formData.primarySupervisor.password}

                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        primarySupervisor: {
                                            ...prev.primarySupervisor,
                                            password: e.target.value
                                        }
                                    }))
                                }

                            />

                        </div>

                    </div>

                </div>

                <div className="create-health-footer">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >

                        Cancelar

                    </button>

                    <button
                        className="submit-btn"
                        disabled={creating}
                        onClick={onSubmit}
                    >

                        {

                            creating

                                ?

                                "Criando..."

                                :

                                "Criar Secretaria"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};