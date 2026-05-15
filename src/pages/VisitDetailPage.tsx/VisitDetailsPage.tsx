import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, MapPin, Clipboard, 
    Beaker, Navigation, FileText, User, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import './VisitDetailsPage.css';
import type { FindVisitByIdDTOOutput } from '../../types/visit';
import { visitService } from '../../services/Visit.service';

const propertyTypeLabels: Record<string, string> = {
    HOUSE: 'Casa',
    APARTMENT: 'Apartamento',
    RESIDENTIAL: 'Residencial',
    COMMERCIAL: 'Comercial',
    VACANT_LOT: 'Terreno Baldio',
    OTHER: 'Outro'
};

const visitTypeLabels: Record<string, string> = {
    ROUTINE: 'Rotina',
    PENDENCY: 'Pendência',
    SPECIAL: 'Especial',
    RETURN: 'Retorno',
    SURVEY: 'Levantamento'
};

const larvicideLabels: Record<string, string> = {
    PYRIPROXYFEN: 'Piriproxifeno',
    BTI: 'BTI',
    TEMEPHOS: 'Temefós',
    OTHER: 'Outro'
};

const depositTypeLabels: Record<string, string> = {
    A1: 'Elevado',
    A2: 'Reservatório ao nível do solo',
    B: 'Móvel',
    C: 'Fixo',
    D1: 'Pneu',
    D2: 'Lixo/Sucata',
    E: 'Natural'
};

const pendingReasonLabels: Record<string, string> = {
    ABSENT:"Ausente",
    CLOSED_HOUSE: 'Imóvel fechado',
    REFUSED_ENTRY: 'Entrada recusada',
    EMPTY_PROPERTY: 'Imóvel vazio',
    OTHER: 'Outro'
};

export const VisitDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [visit, setVisit] = useState<FindVisitByIdDTOOutput['visitForm'] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisit = async () => {
            if (id) {
                try {
                    const response: FindVisitByIdDTOOutput = await visitService.findById(id);
                    if (response.success && response.visitForm) {
                        setVisit(response.visitForm);
                    }
                } catch (error) {
                    console.error("Erro ao carregar visita:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchVisit();
    }, [id]);

    if (loading) return <div className="dashboard-home"><p>Carregando detalhes da visita...</p></div>;
    if (!visit) return <div className="dashboard-home"><p>Visita não encontrada.</p></div>;

    return (
        <div className="dashboard-home">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Voltar
            </button>

            <div className="visit-header-title">
                <h2 className="page-title">Ficha de Visita Técnica</h2>
                <span className={`visit-id-tag`}>ID: {visit.id}</span>
            </div>

            <div className="visit-details-grid">
                
                {/* LOCALIZAÇÃO */}
                <section className="detail-card">
                    <h3 className="section-title"><MapPin size={18} /> Localização</h3>
                    <div className="detail-info">
                        <div className="info-row"><label>LOGRADOURO</label><span>{visit.streetName}, {visit.number}</span></div>
                        <div className="info-row"><label>LOCALIDADE</label><span>{visit.localityCode}</span></div>
                        <div className="info-row"><label>LADO DO QUARTEIRÃO</label><span>{visit.blockSide || "---"}</span></div>
                        <div className="info-row"><label>COMPLEMENTO</label><span>{visit.complement || "---"}</span></div>
                        <div className="info-row"><label>TIPO DE IMÓVEL</label><span>
                            {propertyTypeLabels[visit.propertyType] || visit.propertyType}
                        </span></div>
                    </div>
                </section>

                {/* DADOS DA INSPEÇÃO */}
                <section className="detail-card">
                    <h3 className="section-title"><Clipboard size={18} /> Inspeção</h3>
                    <div className="detail-info">
                        <div className="info-row"><label>DATA</label><span>{new Date(visit.visitDate).toLocaleDateString('pt-BR')}</span></div>
                        <div className="info-row"><label>HORA ENTRADA</label><span>{visit.entryTime || "---"}</span></div>
                        <div className="info-row"><label>TIPO DE VISITA</label><span>
                            {visitTypeLabels[visit.visitType] || visit.visitType}
                        </span></div>
                        <div className="info-row">
                            <label>STATUS</label>
                            <span className={`status-badge ${visit.inspected ? 'active' : 'banned'}`}>
                                {visit.inspected ? 'Inspecionado' : 'Pendente'}
                            </span>
                        </div>
                        {!visit.inspected && (
                            <div className="info-row"><label>MOTIVO</label><span className="text-danger">
                                {pendingReasonLabels[visit.pendingReason || ''] || visit.pendingReason}
                            </span></div>
                        )}
                    </div>
                </section>

                {/* DEPÓSITOS E FOCOS */}
                <section className="detail-card full-width">
                    <h3 className="section-title"><Navigation size={18} /> Depósitos e Focos Encontrados</h3>
                    <div className="deposits-container">
                        <div className="deposit-circles">
                            {['A1', 'A2', 'B', 'C', 'D1', 'D2', 'E'].map(type => (
                                <div key={type} className="deposit-stat">
                                    <span className="dep-val">{(visit as any)[`deposits${type}`]}</span>
                                    <span className="dep-lab">{type}</span>
                                </div>
                            ))}
                        </div>
                        <div className="focus-summary-box">
                            <div className={`focus-status ${visit.depositsWithFocus ? 'alert' : 'safe'}`}>
                                {visit.depositsWithFocus ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                                <span>
                                    {visit.depositsWithFocus
                                        ? `Foco identificado em depósito tipo ${
                                            depositTypeLabels[
                                                visit.depositType || ''
                                            ] || visit.depositType
                                        }`
                                        : 'Nenhum foco encontrado'}
                                </span>
                            </div>
                            <div className="action-stats">
                                <p><strong>Eliminados:</strong> {visit.eliminatedDeposits}</p>
                                <p><strong>Tratados:</strong> {visit.treatedDeposits}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* QUÍMICO E LABORATÓRIO */}
                <section className="detail-card">
                    <h3 className="section-title"><Beaker size={18} /> Tratamento e Amostras</h3>
                    <div className="detail-info">
                        <div className="info-row"><label>AMOSTRA COLETADA</label><span>{visit.sampleCollected ? 'SIM' : 'NÃO'}</span></div>
                        {visit.sampleCollected && (
                            <>
                                <div className="info-row"><label>CÓDIGO AMOSTRA</label><span>{visit.sampleCode}</span></div>
                                <div className="info-row"><label>TUBOS</label><span>{visit.tubeCount}</span></div>
                            </>
                        )}
                        <hr className="divider" />
                        <div className="info-row"><label>TRATAMENTO APLICADO</label><span>{visit.treatmentApplied ? 'SIM' : 'NÃO'}</span></div>
                        {visit.treatmentApplied && (
                            <>
                                <div className="info-row"><label>LARVICIDA</label><span>
                                    {larvicideLabels[
                                        visit.treatmentLarvicideType || ''
                                    ] || visit.treatmentLarvicideType}
                                </span></div>
                                <div className="info-row"><label>QUANTIDADE</label><span>{visit.larvicideAmount}g</span></div>
                            </>
                        )}
                    </div>
                </section>

                {/* NOTAS E AGENTE */}
                <section className="detail-card">
                    <h3 className="section-title"><FileText size={18} /> Observações</h3>
                    <div className="notes-container">
                        <p className="visit-notes-box">{visit.notes || "Sem observações adicionais."}</p>
                        <div className="agent-attribution">
                            <User size={14} />
                            <Link to={`/agents/${visit.userId}`}>
                                <span>Registrado por Agente ID: {visit.userId} em {new Date(visit.createdAt).toLocaleString('pt-BR')}</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};