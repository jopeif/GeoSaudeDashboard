import { useForm } from "react-hook-form";

import { LocationPicker } from "./components/LocationPicker";

import { visitService } from "../../services/Visit.service";

import {
    MapPin,
    Navigation,
    Beaker,
    ClipboardList
} from "lucide-react";

import type {
    CreateNewVisitDTOInput
} from "../../types/visit";

import "./NewVisit.css";

export const NewVisitPage = () => {

    const userId =
        localStorage.getItem(
            "@App:userId"
        ) || "";

    const defaultValues: CreateNewVisitDTOInput = {

        userId,

        visitDate:
            new Date()
                .toISOString()
                .split("T")[0],

        localityCode: "",

        streetName: "",

        number: "",

        blockSide: undefined,

        complement: undefined,

        propertyType:
            "RESIDENTIAL",

        residentName: undefined,

        phone: undefined,

        entryTime: undefined,

        visitType:
            "ROUTINE",

        inspected: true,

        pendingReason:
            "NONE",

        depositsWithFocus:
            false,

        depositType:
            undefined,

        larvicideUsed:
            "NONE",

        treatedDeposits: 0,

        eliminatedDeposits: 0,

        depositsA1: 0,

        depositsA2: 0,

        depositsB: 0,

        depositsC: 0,

        depositsD1: 0,

        depositsD2: 0,

        depositsE: 0,

        treatmentApplied:
            false,

        treatmentLarvicideType:
            "NONE",

        larvicideAmount: 0,

        perifocalDeposits: 0,

        adulticideLoads: 0,

        sampleCollected:
            false,

        sampleCode:
            undefined,

        tubeCount: 0,

        notes:
            undefined,

        latitude:
            undefined,

        longitude:
            undefined
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset
    } = useForm<CreateNewVisitDTOInput>({
        defaultValues
    });

    const isInspected =
        watch("inspected");

    const hasFocus =
        watch(
            "depositsWithFocus"
        );

    const isTreated =
        watch(
            "treatmentApplied"
        );

    const isSampled =
        watch(
            "sampleCollected"
        );

    const onSubmit = async (
        data: CreateNewVisitDTOInput
    ) => {

        const sanitizedData: CreateNewVisitDTOInput = {

            ...data,

            blockSide:
                data.blockSide || undefined,

            complement:
                data.complement || undefined,

            residentName:
                data.residentName || undefined,

            phone:
                data.phone || undefined,

            entryTime:
                data.entryTime || undefined,

            notes:
                data.notes || undefined,

            sampleCode:
                data.sampleCode || undefined,

            depositType:
                data.depositsWithFocus
                    ? data.depositType
                    : undefined,

            pendingReason:
                !data.inspected
                    ? data.pendingReason
                    : undefined,

            treatmentLarvicideType:
                data.treatmentApplied
                    ? data.treatmentLarvicideType
                    : undefined,

            larvicideAmount:
                data.treatmentApplied
                    ? data.larvicideAmount
                    : undefined,

            tubeCount:
                data.sampleCollected
                    ? data.tubeCount
                    : 0,

            latitude:
                data.latitude || undefined,

            longitude:
                data.longitude || undefined
        };

        try {

            const response =
                await visitService.create(
                    sanitizedData
                );

            if (
                response.success
            ) {

                alert(
                    "Visita registrada com sucesso!"
                );

                reset(
                    defaultValues
                );

                return;
            }

            alert(
                response.message ||
                "Erro ao salvar visita."
            );

        } catch (error: any) {

            console.error(
                error
            );

            alert(
                error?.response
                    ?.data?.message ||
                "Erro crítico ao salvar visita."
            );
        }
    };

    return (

        <div className="new-visit-page">

            <h2 className="new-visit-page-title">
                Nova Visita de Campo
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="new-visit-form"
            >

                {/* =========================
                    LOCALIZAÇÃO
                ========================= */}

                <div className="new-visit-section">

                    <h3 className="new-visit-section-title">
                        <MapPin size={18} />
                        Localização Geográfica
                    </h3>

                    <div className="new-visit-map-grid">

                        <div className="new-visit-input-column">

                            <div className="new-visit-field">

                                <label>
                                    LOCALIDADE
                                </label>

                                <input
                                    {...register(
                                        "localityCode",
                                        {
                                            required: true
                                        }
                                    )}
                                    placeholder="Ex: TAB-021"
                                />

                            </div>

                            <div className="new-visit-field">

                                <label>
                                    LOGRADOURO
                                </label>

                                <input
                                    {...register(
                                        "streetName",
                                        {
                                            required: true
                                        }
                                    )}
                                    placeholder="Nome da rua"
                                />

                            </div>

                            <div className="new-visit-field">

                                <label>
                                    NÚMERO
                                </label>

                                <input
                                    {...register(
                                        "number",
                                        {
                                            required: true
                                        }
                                    )}
                                />

                            </div>

                            <div className="new-visit-field">

                                <label>
                                    DATA DA VISITA
                                </label>

                                <input
                                    type="date"
                                    {...register(
                                        "visitDate",
                                        {
                                            required: true
                                        }
                                    )}
                                />

                            </div>

                            <div className="new-visit-field">

                                <label>
                                    COMPLEMENTO
                                </label>

                                <input
                                    {...register(
                                        "complement"
                                    )}
                                    placeholder="Opcional"
                                />

                            </div>

                            <div className="new-visit-field">

                                <label>
                                    LADO DO QUARTEIRÃO
                                </label>

                                <input
                                    {...register(
                                        "blockSide"
                                    )}
                                    placeholder="Opcional"
                                />

                            </div>

                        </div>

                        <LocationPicker
                            onLocationSelect={(
                                lat,
                                lng
                            ) => {

                                setValue(
                                    "latitude",
                                    lat
                                );

                                setValue(
                                    "longitude",
                                    lng
                                );
                            }}
                        />

                    </div>

                </div>

                {/* =========================
                    INSPEÇÃO
                ========================= */}

                <div className="new-visit-section">

                    <h3 className="new-visit-section-title">
                        <ClipboardList size={18} />
                        Dados da Inspeção
                    </h3>

                    <div className="new-visit-grid">

                        <div className="new-visit-field">

                            <label>
                                TIPO DE IMÓVEL
                            </label>

                            <select
                                {...register(
                                    "propertyType"
                                )}
                            >

                                <option value="RESIDENTIAL">
                                    Residencial
                                </option>

                                <option value="COMMERCIAL">
                                    Comercial
                                </option>

                                <option value="VACANT LOT">
                                    Terreno Baldio
                                </option>

                                <option value="STRATEGIC POINT">
                                    Ponto Estratégico
                                </option>

                                <option value="HEALTH FACILITY">
                                    Unidade de Saúde
                                </option>

                                <option value="SCHOOL">
                                    Escola
                                </option>

                                <option value="OTHER">
                                    Outro
                                </option>

                            </select>

                        </div>

                        <div className="new-visit-field">

                            <label>
                                TIPO DE VISITA
                            </label>

                            <select
                                {...register(
                                    "visitType"
                                )}
                            >

                                <option value="ROUTINE">
                                    Rotina
                                </option>

                                <option value="RECOVERY">
                                    Recuperação
                                </option>

                                <option value="LIRAA">
                                    LIRAa
                                </option>

                                <option value="BLOCKING">
                                    Bloqueio
                                </option>

                            </select>

                        </div>

                        <div className="new-visit-field">

                            <label>
                                INSPECIONADO?
                            </label>

                            <select
                                value={
                                    isInspected
                                        ? "true"
                                        : "false"
                                }
                                onChange={e =>
                                    setValue(
                                        "inspected",
                                        e.target.value ===
                                        "true"
                                    )
                                }
                            >

                                <option value="true">
                                    Sim
                                </option>

                                <option value="false">
                                    Não
                                </option>

                            </select>

                        </div>

                        {!isInspected && (

                            <div className="new-visit-field">

                                <label>
                                    MOTIVO PENDÊNCIA
                                </label>

                                <select
                                    {...register(
                                        "pendingReason"
                                    )}
                                >

                                    <option value="NONE">
                                        Nenhum
                                    </option>

                                    <option value="RESIDENT REFUSED">
                                        Recusado
                                    </option>

                                    <option value="PROPERTY CLOSED">
                                        Fechado
                                    </option>

                                    <option value="ABSENT">
                                        Ausente
                                    </option>

                                    <option value="ABANDONED PROPERTY">
                                        Abandonado
                                    </option>

                                    <option value="OTHER">
                                        Outro
                                    </option>

                                </select>

                            </div>

                        )}

                    </div>

                </div>

                {/* =========================
                    DEPÓSITOS
                ========================= */}

                <div className="new-visit-section">

                    <h3 className="new-visit-section-title">
                        <Navigation size={18} />
                        Depósitos e Larvário
                    </h3>

                    <div className="new-visit-deposit-grid">

                        {[
                            "A1",
                            "A2",
                            "B",
                            "C",
                            "D1",
                            "D2",
                            "E"
                        ].map(type => (

                            <div
                                className="new-visit-field"
                                key={type}
                            >

                                <label>
                                    DEP. {type}
                                </label>

                                <input
                                    type="number"
                                    {...register(
                                        `deposits${type}` as keyof CreateNewVisitDTOInput,
                                        {
                                            valueAsNumber: true
                                        }
                                    )}
                                />

                            </div>

                        ))}

                    </div>

                    <div className="new-visit-checkbox-group">

                        <div className="new-visit-field">

                            <label>
                                FOCO ENCONTRADO?
                            </label>

                            <input
                                type="checkbox"
                                {...register(
                                    "depositsWithFocus"
                                )}
                            />

                        </div>

                        {hasFocus && (

                            <div className="new-visit-field">

                                <label>
                                    TIPO DO FOCO
                                </label>

                                <select
                                    {...register(
                                        "depositType"
                                    )}
                                >

                                    <option value="A1">
                                        A1
                                    </option>

                                    <option value="A2">
                                        A2
                                    </option>

                                    <option value="B">
                                        B
                                    </option>

                                    <option value="C">
                                        C
                                    </option>

                                    <option value="D1">
                                        D1
                                    </option>

                                    <option value="D2">
                                        D2
                                    </option>

                                    <option value="E">
                                        E
                                    </option>

                                </select>

                            </div>

                        )}

                    </div>

                </div>

                {/* =========================
                    LABORATÓRIO
                ========================= */}

                <div className="new-visit-section">

                    <h3 className="new-visit-section-title">
                        <Beaker size={18} />
                        Laboratório e Tratamento
                    </h3>

                    <div className="new-visit-grid">

                        <div className="new-visit-field">

                            <label>
                                AMOSTRA COLETADA?
                            </label>

                            <input
                                type="checkbox"
                                {...register(
                                    "sampleCollected"
                                )}
                            />

                        </div>

                        {isSampled && (

                            <>
                                <div className="new-visit-field">

                                    <label>
                                        CÓDIGO DA AMOSTRA
                                    </label>

                                    <input
                                        {...register(
                                            "sampleCode"
                                        )}
                                    />

                                </div>

                                <div className="new-visit-field">

                                    <label>
                                        QTD TUBOS
                                    </label>

                                    <input
                                        type="number"
                                        {...register(
                                            "tubeCount",
                                            {
                                                valueAsNumber: true
                                            }
                                        )}
                                    />

                                </div>
                            </>

                        )}

                        <div className="new-visit-field">

                            <label>
                                TRATAMENTO APLICADO?
                            </label>

                            <input
                                type="checkbox"
                                {...register(
                                    "treatmentApplied"
                                )}
                            />

                        </div>

                        {isTreated && (

                            <>
                                <div className="new-visit-field">

                                    <label>
                                        LARVICIDA
                                    </label>

                                    <select
                                        {...register(
                                            "treatmentLarvicideType"
                                        )}
                                    >

                                        <option value="BTI">
                                            BTI
                                        </option>

                                        <option value="PYRIPROXYFEN">
                                            Pyriproxyfen
                                        </option>

                                        <option value="DIFLUBENZURON">
                                            Diflubenzuron
                                        </option>

                                        <option value="TEMEPHOS">
                                            Temephos
                                        </option>

                                        <option value="OTHER">
                                            Outro
                                        </option>

                                    </select>

                                </div>

                                <div className="new-visit-field">

                                    <label>
                                        QUANTIDADE
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(
                                            "larvicideAmount",
                                            {
                                                valueAsNumber: true
                                            }
                                        )}
                                    />

                                </div>
                            </>

                        )}

                    </div>

                </div>

                {/* =========================
                    OBSERVAÇÕES
                ========================= */}

                <div className="new-visit-section">

                    <h3 className="new-visit-section-title">
                        Observações
                    </h3>

                    <div className="new-visit-field">

                        <label>
                            NOTAS
                        </label>

                        <textarea
                            rows={5}
                            {...register(
                                "notes"
                            )}
                            placeholder="Observações adicionais..."
                        />

                    </div>

                </div>

                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="new-visit-actions">

                    <button
                        type="submit"
                        className="new-visit-submit-btn"
                    >
                        Salvar Registro de Visita
                    </button>

                </div>

            </form>

        </div>
    );
};