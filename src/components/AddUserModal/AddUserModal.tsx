import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/User.service';
import { useAuth } from '../../contexts/AuthContext';
import { HealthDepartmentService } from '../../services/HealthDepartment.service';
import type { HealthDepartment } from '../../types/healthDepartment';
import './AddUserModal.css';

export type RoleType = 'AGENT' | 'SUPERVISOR' | 'ADMIN';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultRole?: RoleType;
    fixedRole?: boolean;
    defaultHealthDepartment?: string;
    fixedHealthDepartment?: boolean;
}

export const AddUserModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    defaultRole = 'AGENT', 
    fixedRole = false,
    defaultHealthDepartment = '',
    fixedHealthDepartment = false
}: AddUserModalProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ADM' || user?.role === 'SUPERADMIN';
    const isSupervisor = user?.role === 'SUPERVISOR';

    const [role, setRole] = useState<RoleType>(defaultRole);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<HealthDepartment[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        registration: '',
        healthDepartment: defaultHealthDepartment,
        block: '',
        accessLevel: 0
    });

    useEffect(() => {
        if (isOpen && isAdmin) {
            HealthDepartmentService.findAll()
                .then(res => {
                    if (res.success && res.data) {
                        setDepartments(res.data);
                    }
                })
                .catch(err => console.error("Error fetching health departments:", err));
        }
    }, [isOpen, isAdmin]);

    useEffect(() => {
        if (isOpen) {
            let initialDept = defaultHealthDepartment;
            if (isSupervisor && !initialDept) {
                const hd = user?.profile?.healthDepartment;
                initialDept = typeof hd === 'object' && hd !== null ? hd.name || hd.id : (hd || '');
            }

            setRole(defaultRole);
            setFormData(prev => ({
                ...prev,
                healthDepartment: initialDept
            }));
            setError(null);
            setSuccessMessage(null);
        }
    }, [isOpen, defaultRole, defaultHealthDepartment, isSupervisor, user]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push("A senha deve conter pelo menos 8 caracteres.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("A senha deve conter pelo menos uma letra minúscula.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("A senha deve conter pelo menos uma letra maiúscula.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("A senha deve conter pelo menos um número.");
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            errors.push("A senha deve conter pelo menos um caractere especial.");
        }
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join(" "));
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let response;
            
            if (role === 'AGENT') {
                response = await userService.registerAgent({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    registration: formData.registration,
                    healthDepartment: formData.healthDepartment,
                    block: formData.block
                });
            } else if (role === 'SUPERVISOR') {
                response = await userService.registerSupervisor({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    registration: formData.registration,
                    healthDepartment: formData.healthDepartment
                });
            } else if (role === 'ADMIN') {
                const adminData: any = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    accessLevel: Number(formData.accessLevel)
                };
                response = await userService.registerAdm(adminData);
            }

            if (response && response.success) {
                setSuccessMessage("Usuário criado com sucesso!");
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    
                    let initialDept = fixedHealthDepartment ? defaultHealthDepartment : '';
                    if (isSupervisor && !initialDept) {
                        const hd = user?.profile?.healthDepartment;
                        initialDept = typeof hd === 'object' && hd !== null ? hd.name || hd.id : (hd || '');
                    }

                    // Limpar formulário mantendo os fixed fields se houver
                    setFormData({
                        name: '', email: '', password: '', phoneNumber: '',
                        registration: '', healthDepartment: initialDept, block: '', accessLevel: 5
                    });
                    setSuccessMessage(null);
                }, 1500);
            } else {
                setError("Ocorreu um erro inesperado ao criar o usuário.");
            }
        } catch (err: any) {
            console.error("Erro no cadastro de usuário:", err);
            if (err.response && err.response.data && err.response.data.message) {
                const apiMsg = err.response.data.message;
                setError(Array.isArray(apiMsg) ? apiMsg.join(" | ") : apiMsg);
            } else if (err.response && err.response.status === 400) {
                setError("Dados inválidos, email ou matrícula já podem estar em uso.");
            } else {
                setError("Erro de comunicação com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="slide-over-overlay" onClick={onClose}>
            <div className="slide-over-panel" onClick={(e) => e.stopPropagation()}>
                <div className="slide-over-header">
                    <h3>
                        Adicionar {role === 'AGENT' ? 'Agente de Saúde' : role === 'SUPERVISOR' ? 'Supervisor' : 'Administrador'}
                    </h3>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="slide-over-body">
                    {error && <div className="form-error-msg">{error}</div>}
                    {successMessage && <div className="form-success-msg">{successMessage}</div>}

                    <form id="add-user-form" onSubmit={handleSubmit}>
                        {!fixedRole && (
                            <div className="form-group">
                                <label>Perfil do Usuário</label>
                                <select 
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value as RoleType)}
                                    disabled={loading || !!successMessage}
                                >
                                    <option value="AGENT">Agente de Saúde</option>
                                    <option value="SUPERVISOR">Supervisor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="Ex: João da Silva"
                                disabled={loading || !!successMessage}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="Ex: joao@email.com"
                                disabled={loading || !!successMessage}
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <div className="form-password-wrapper">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    required 
                                    placeholder="Mínimo 8 caracteres"
                                    minLength={6}
                                    disabled={loading || !!successMessage}
                                />
                                <button
                                    type="button"
                                    className="btn-toggle-password"
                                    onClick={() => setShowPassword(p => !p)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Telefone</label>
                            <input 
                                type="tel" 
                                name="phoneNumber" 
                                value={formData.phoneNumber} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="Ex: 11999999999"
                                disabled={loading || !!successMessage}
                            />
                        </div>

                        {role !== 'ADMIN' && (
                            <>
                                <div className="form-group">
                                    <label>Matrícula</label>
                                    <input 
                                        type="text" 
                                        name="registration" 
                                        value={formData.registration} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="Ex: MAT-12345"
                                        disabled={loading || !!successMessage}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Departamento de Saúde</label>
                                    {isAdmin ? (
                                        <select
                                            name="healthDepartment"
                                            value={formData.healthDepartment}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading || !!successMessage || fixedHealthDepartment}
                                        >
                                            <option value="">Selecione um departamento...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input 
                                            type="text" 
                                            name="healthDepartment" 
                                            value={formData.healthDepartment} 
                                            onChange={handleInputChange} 
                                            required 
                                            placeholder="Ex: Secretaria Municipal de Saúde"
                                            disabled={loading || !!successMessage || fixedHealthDepartment || isSupervisor}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {role === 'AGENT' && (
                            <div className="form-group">
                                <label>Quarteirão / Bloco de Atuação</label>
                                <input 
                                    type="text" 
                                    name="block" 
                                    value={formData.block} 
                                    onChange={handleInputChange} 
                                    required 
                                    placeholder="Ex: Quadra 04, Setor Sul"
                                    disabled={loading || !!successMessage}
                                />
                            </div>
                        )}
                        {role === 'ADMIN' && (
                            <div className="form-group">
                                <label>Nível de Acesso (Access Level)</label>
                                <input 
                                    type="number" 
                                    name="accessLevel" 
                                    value={formData.accessLevel} 
                                    onChange={handleInputChange} 
                                    required 
                                    min={0}
                                    placeholder="Ex: 0"
                                    disabled={loading || !!successMessage}
                                />
                            </div>
                        )}
                    </form>
                </div>

                <div className="slide-over-footer">
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={onClose}
                        disabled={loading || !!successMessage}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="add-user-form" 
                        className="btn-submit"
                        disabled={loading || !!successMessage}
                    >
                        <Save size={18} />
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
