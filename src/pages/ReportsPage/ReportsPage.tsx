// pages/reports/ReportsPage.tsx

import {
    useEffect,
    useState
} from "react";

import "./ReportsPage.css";

import api from "../../api/client";
import { userService } from "../../services/User.service";
import type { UserDetails } from "../../types/user";

type ReportType =
    "daily" | "weekly";

type ReportFormat =
    "pdf" | "xlsx";

export default function ReportsPage() {

    const [
        reportType,
        setReportType
    ] = useState<ReportType>(
        "daily"
    );

    const [date, setDate] =
        useState("");

    const [
        startDate,
        setStartDate
    ] = useState("");

    const [
        endDate,
        setEndDate
    ] = useState("");

    const [
        localityCode,
        setLocalityCode
    ] = useState("");

    const [userId, setUserId] =
        useState("");

    const [format, setFormat] =
        useState<ReportFormat>(
            "pdf"
        );

    const [agents, setAgents] =
        useState<UserDetails[]>([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        const loadAgents = async () => {
        const response =
            await userService.findAll({page:1, limit:1000});

        if (
            response.success &&
            response.users
        ) {
            setAgents(response.users);
        }
        };

        loadAgents();
    }, []);

    async function handleGenerate() {

        try {

            setLoading(true);

            const endpoint =
                reportType ===
                "daily"
                    ? "/report/daily"
                    : "/report/weekly";

            const params =
                reportType ===
                "daily"
                    ? {

                        date,

                        localityCode:
                            localityCode || undefined,

                        userId:
                            userId || undefined,

                        format
                    }
                    : {

                        startDate,

                        endDate,

                        localityCode:
                            localityCode || undefined,

                        userId:
                            userId || undefined,

                        format
                    };

            const response =
                await api.get(
                    endpoint,
                    {
                        params,

                        responseType:
                            "blob"
                    }
                );

            const contentType =
                response.headers[
                    "content-type"
                ];

            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            typeof contentType ===
                            "string"
                                ? contentType
                                : undefined
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const a =
                document.createElement(
                    "a"
                );

            a.href = url;

            a.download =
                reportType ===
                "daily"
                    ? `daily-report.${format}`
                    : `weekly-report.${format}`;

            document.body.appendChild(
                a
            );

            a.click();

            a.remove();

            window.URL.revokeObjectURL(
                url
            );

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Erro ao gerar relatório"
            );

        } finally {

            setLoading(false);
        }
    }

    const isDisabled =
        loading ||
        (
            reportType ===
            "daily"
                ? !date
                : !startDate ||
                  !endDate
        );

    return (

        <div className="reports-page">

            <div className="reports-card">

                <div className="reports-header">

                    <h1>
                        Emissão de Relatórios
                    </h1>

                    <p>
                        Gere relatórios
                        diários ou
                        semanais
                    </p>

                </div>

                <div className="report-type-selector">

                    <button
                        className={
                            reportType ===
                            "daily"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setReportType(
                                "daily"
                            )
                        }
                    >
                        Diário
                    </button>

                    <button
                        className={
                            reportType ===
                            "weekly"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setReportType(
                                "weekly"
                            )
                        }
                    >
                        Semanal
                    </button>

                </div>

                {
                    reportType ===
                    "daily" ? (

                        <div className="form-group">

                            <label>
                                Data
                            </label>

                            <input
                                type="date"
                                value={
                                    date
                                }
                                onChange={e =>
                                    setDate(
                                        e
                                            .target
                                            .value
                                    )
                                }
                            />

                        </div>

                    ) : (

                        <div className="date-grid">

                            <div className="form-group">

                                <label>
                                    Data Inicial
                                </label>

                                <input
                                    type="date"
                                    value={
                                        startDate
                                    }
                                    onChange={e =>
                                        setStartDate(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Data Final
                                </label>

                                <input
                                    type="date"
                                    value={
                                        endDate
                                    }
                                    onChange={e =>
                                        setEndDate(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                />

                            </div>

                        </div>

                    )
                }

                <div className="form-group">

                    <label>
                        Código da Localidade
                    </label>

                    <input
                        type="text"
                        value={
                            localityCode
                        }
                        onChange={e =>
                            setLocalityCode(
                                e.target
                                    .value
                            )
                        }
                        placeholder="Opcional"
                    />

                </div>

                <div className="form-group">

                    <label>
                        AGENTE
                    </label>

                    <select
                        value={userId}
                        onChange={(e)=>
                            setUserId( e.target.value )
                        }
                    >

                        <option value="">
                            Todos os Agentes
                        </option>

                        {
                            agents.map(
                                (agent)=>(
                                    <option
                                        key={agent.id}
                                        value={agent.id}
                                    >
                                        {agent.name}
                                    </option>
                                )
                            )
                        }

                    </select>

                </div>

                <div className="form-group">

                    <label>
                        Formato
                    </label>

                    <select
                        value={
                            format
                        }
                        onChange={e =>
                            setFormat(
                                e.target
                                    .value as ReportFormat
                            )
                        }
                    >

                        <option value="pdf">
                            PDF
                        </option>

                        <option value="xlsx">
                            XLSX
                        </option>

                    </select>

                </div>

                <button
                    className="generate-button"
                    onClick={
                        handleGenerate
                    }
                    disabled={
                        isDisabled
                    }
                >

                    {
                        loading
                            ? "Gerando..."
                            : `Gerar Relatório ${
                                reportType ===
                                "daily"
                                    ? "Diário"
                                    : "Semanal"
                            }`
                    }

                </button>

            </div>

        </div>
    );
}