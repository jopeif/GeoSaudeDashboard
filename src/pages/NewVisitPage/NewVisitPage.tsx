import { useForm } from 'react-hook-form';
import { LocationPicker } from './components/LocationPicker';
import { visitService } from '../../services/Visit.service';
import { MapPin, Navigation, Beaker, ClipboardList } from 'lucide-react';
import type { CreateNewVisitDTOInput } from '../../types/visit';
import './NewVisit.css';

export const NewVisitPage = () => {
    // Busca o ID do usuário diretamente do localStorage seguindo o padrão do authService
    const userId = localStorage.getItem('@App:userId') || "";

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateNewVisitDTOInput>({
        defaultValues: {
            userId,
            visitDate: new Date().toISOString().split('T')[0],
            inspected: true,
            visitType: "ROUTINE",
            propertyType: "RESIDENTIAL",
            pendingReason: "NONE",
            depositsWithFocus: false,
            treatmentApplied: false,
            sampleCollected: false,
            larvicideUsed: "NONE",
            treatmentLarvicideType: "NONE",
            depositsA1: 0, depositsA2: 0, depositsB: 0, depositsC: 0, 
            depositsD1: 0, depositsD2: 0, depositsE: 0,
            treatedDeposits: 0, eliminatedDeposits: 0,
            tubeCount: 0, adulticideLoads: 0, perifocalDeposits: 0,
            larvicideAmount: 0
        }
    });

    const onSubmit = async (data: CreateNewVisitDTOInput) => {
        try {
            const response = await visitService.create(data);
            if (response.success) {
                alert("Visita registrada com sucesso!");
                reset(); // Limpa o formulário após o sucesso
            } else {
                alert(`Erro: ${response.message}`);
            }
        } catch (error) {
            alert("Erro crítico ao salvar visita.");
        }
    };

    // Observadores de estado para lógica condicional de campos
    const isInspected = watch("inspected");
    const hasFocus = watch("depositsWithFocus");
    const isTreated = watch("treatmentApplied");
    const isSampled = watch("sampleCollected");

    return (
        <div className="dashboard-home">
            <h2 className="page-title">Nova Visita de Campo</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="visit-form">
                
                {/* SEÇÃO 1: LOCALIZAÇÃO E MAPA */}
                <div className="form-section">
                    <h3 className="section-title"><MapPin size={18} /> Localização Geográfica</h3>
                    <div className="section-grid-map">
                        <div className="input-group-grid">
                            <div className="filter-group">
                                <label>LOCALIDADE</label>
                                <input {...register("localityCode", { required: true })} placeholder="Ex: TAB-021" />
                            </div>
                            <div className="filter-group">
                                <label>LOGRADOURO</label>
                                <input {...register("streetName", { required: true })} placeholder="Nome da rua" />
                            </div>
                            <div className="filter-group">
                                <label>NÚMERO</label>
                                <input {...register("number", { required: true })} />
                            </div>
                            <div className="filter-group">
                                <label>DATA DA VISITA</label>
                                <input type="date" {...register("visitDate", { required: true })} />
                            </div>
                        </div>
                        <LocationPicker onLocationSelect={(lat, lng) => {
                            setValue("latitude", lat);
                            setValue("longitude", lng);
                        }} />
                    </div>
                </div>

                {/* SEÇÃO 2: DADOS DA VISITA */}
                <div className="form-section">
                    <h3 className="section-title"><ClipboardList size={18} /> Dados da Inspeção</h3>
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>TIPO DE IMÓVEL</label>
                            <select {...register("propertyType")}>
                                <option value="RESIDENTIAL">Residencial</option>
                                <option value="COMMERCIAL">Comercial</option>
                                <option value="VACANT LOT">Terreno Baldio</option>
                                <option value="STRATEGIC POINT">Ponto Estratégico</option>
                                <option value="HEALTH FACILITY">Unidade de Saúde</option>
                                <option value="SCHOOL">Escola</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>TIPO DE VISITA</label>
                            <select {...register("visitType")}>
                                <option value="ROUTINE">Rotina</option>
                                <option value="RECOVERY">Recuperação</option>
                                <option value="LIRAA">LIRAa</option>
                                <option value="BLOCKING">Bloqueio</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>FOI INSPECIONADO?</label>
                            <select {...register("inspected", { setValueAs: v => v === "true" })}>
                                <option value="true">Sim</option>
                                <option value="false">Não (Pendente)</option>
                            </select>
                        </div>
                        {!isInspected && (
                            <div className="filter-group">
                                <label>MOTIVO PENDÊNCIA</label>
                                <select {...register("pendingReason")}>
                                    <option value="NONE">Nenhum</option>
                                    <option value="RESIDENT REFUSED">Recusado</option>
                                    <option value="PROPERTY CLOSED">Fechado</option>
                                    <option value="ABSENT">Ausente</option>
                                    <option value="ABANDONED PROPERTY">Abandonado</option>
                                    <option value="OTHER">Outro</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEÇÃO 3: DEPÓSITOS E FOCOS */}
                <div className="form-section">
                    <h3 className="section-title"><Navigation size={18} /> Depósitos e Larvário</h3>
                    <div className="deposit-counter-grid">
                        {['A1', 'A2', 'B', 'C', 'D1', 'D2', 'E'].map(type => (
                            <div className="filter-group" key={type}>
                                <label>DEP. {type}</label>
                                <input type="number" {...register(`deposits${type}` as any, { valueAsNumber: true })} />
                            </div>
                        ))}
                    </div>
                    
                    <div className="checkbox-logic-group" style={{marginTop: '20px'}}>
                        <div className="filter-group">
                            <label>FOCO ENCONTRADO?</label>
                            <input type="checkbox" {...register("depositsWithFocus")} />
                        </div>
                        {hasFocus && (
                            <div className="filter-group">
                                <label>TIPO DE DEPÓSITO COM FOCO</label>
                                <select {...register("depositType")}>
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D1">D1</option>
                                    <option value="D2">D2</option>
                                    <option value="E">E</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEÇÃO 4: TRATAMENTO E AMOSTRAS */}
                <div className="form-section">
                    <h3 className="section-title"><Beaker size={18} /> Laboratório e Tratamento</h3>
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>AMOSTRA COLETADA?</label>
                            <input type="checkbox" {...register("sampleCollected")} />
                        </div>
                        {isSampled && (
                            <>
                                <div className="filter-group">
                                    <label>CÓDIGO DA AMOSTRA</label>
                                    <input {...register("sampleCode")} placeholder="Ex: PE-TAB-20" />
                                </div>
                                <div className="filter-group">
                                    <label>QTD TUBOS</label>
                                    <input type="number" {...register("tubeCount", { valueAsNumber: true })} />
                                </div>
                            </>
                        )}
                        <div className="filter-group">
                            <label>TRATAMENTO APLICADO?</label>
                            <input type="checkbox" {...register("treatmentApplied")} />
                        </div>
                        {isTreated && (
                            <div className="filter-group">
                                <label>LARVICIDA</label>
                                <select {...register("treatmentLarvicideType")}>
                                    <option value="BTI">BTI</option>
                                    <option value="PYRIPROXYFEN">Pyriproxyfen</option>
                                    <option value="DIFLUBENZURON">Diflubenzuron</option>
                                    <option value="TEMEPHOS">Temephos</option>
                                    <option value="OTHER">Outro</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions-footer">
                    <button type="submit" className="btn-apply">Salvar Registro de Visita</button>
                </div>
            </form>
        </div>
    );
};