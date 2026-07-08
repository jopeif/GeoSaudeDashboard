import { useEffect, useState, useCallback, useRef } from 'react';
import {
    ArrowLeft,
    AlertTriangle,
    Pin,
    PinOff,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Smartphone,
    RefreshCw,
    User,
    Mail,
    Phone,
    Shield,
    Hash,
    Copy,
    X,
    Terminal,
    ExternalLink,
    Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { telemetryService } from '../../../services/Telemetry.service';
import { userService } from '../../../services/User.service';
import type { TelemetryLog, TelemetryMeta } from '../../../types/telemetry';
import type { UserDetails } from '../../../types/user';

import './LogsPage.css';

/* ========================================
   INTERFACES
======================================== */

interface ToastState {
    visible: boolean;
    message: string;
}

/* ========================================
   COMPONENT
======================================== */

export const LogsPage = () => {

    const navigate = useNavigate();

    const [logs, setLogs] =
        useState<TelemetryLog[]>([]);

    const [meta, setMeta] =
        useState<TelemetryMeta | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [toast, setToast] =
        useState<ToastState>({
            visible: false,
            message: '',
        });

    const [logToDelete, setLogToDelete] =
        useState<string | null>(null);

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const [pinningId, setPinningId] =
        useState<string | null>(null);

    interface ErrorPopoverState {
        id: string;
        error: string;
        top: number;
        left: number;
    }

    interface UserPopoverState {
        user: UserDetails;
        top: number;
        left: number;
    }

    const [errorPopover, setErrorPopover] =
        useState<ErrorPopoverState | null>(null);

    const [copiedErrorId, setCopiedErrorId] =
        useState<string | null>(null);

    const [userPopover, setUserPopover] =
        useState<UserPopoverState | null>(null);

    /*
        Cache de perfis de usuário em memória.
        Persiste entre trocas de página — o mesmo userId
        nunca é buscado duas vezes na sessão.
        null = buscado, mas usuário não encontrado/erro.
    */
    const userCache =
        useRef<Map<string, UserDetails | null>>(
            new Map()
        );

    /*
        Mapa de perfis resolvidos para a UI.
        Separado do cache para forçar re-render.
    */
    const [resolvedUsers, setResolvedUsers] =
        useState<Record<string, UserDetails | null>>({});

    const [resolvingUsers, setResolvingUsers] =
        useState(false);

    const LIMIT = 20;

    /* ========================================
       TOAST
    ======================================== */

    const showToast = (message: string) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 3500);
    };

    /* ========================================
       ERROR POPOVER
    ======================================== */

    const handleOpenError = (
        e: React.MouseEvent<HTMLButtonElement>,
        logId: string,
        errorText: string
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setErrorPopover({
            id: logId,
            error: errorText,
            top: rect.bottom + 8,
            left: rect.left,
        });
    };

    const handleCloseError = () => {
        setErrorPopover(null);
    };

    const handleCopyError = async (errorText: string, logId: string) => {
        try {
            await navigator.clipboard.writeText(errorText);
            setCopiedErrorId(logId);
            setTimeout(() => setCopiedErrorId(null), 1500);
        } catch {
            showToast('Não foi possível copiar o texto.');
        }
    };

    /* ========================================
       RESOLVE USER PROFILES
    ======================================== */

    const resolveUserProfiles = useCallback(
        async (logsToResolve: TelemetryLog[]) => {

            /*
                Filtra apenas userIds não-nulos que ainda
                não estejam no cache.
            */
            const uncachedIds = [
                ...new Set(
                    logsToResolve
                        .map(l => l.userId)
                        .filter((id): id is string =>
                            id !== null &&
                            !userCache.current.has(id)
                        )
                )
            ];

            if (uncachedIds.length === 0) {
                /*
                    Todos já estão em cache — apenas
                    sincroniza o estado de UI.
                */
                const snapshot: Record<string, UserDetails | null> = {};
                userCache.current.forEach((user, id) => {
                    snapshot[id] = user;
                });
                setResolvedUsers(snapshot);
                return;
            }

            setResolvingUsers(true);

            /*
                Busca em paralelo com Promise.allSettled —
                uma falha individual não cancela as demais.
            */
            const results = await Promise.allSettled(
                uncachedIds.map(id =>
                    userService.findById(id)
                )
            );

            results.forEach((result, index) => {
                const id = uncachedIds[index];
                if (
                    result.status === 'fulfilled' &&
                    result.value.success &&
                    result.value.user
                ) {
                    userCache.current.set(
                        id,
                        result.value.user
                    );
                } else {
                    /*
                        Marca como null para não tentar
                        buscar novamente nesta sessão.
                    */
                    userCache.current.set(id, null);
                }
            });

            /* Atualiza o estado de UI com o cache completo */
            const snapshot: Record<string, UserDetails | null> = {};
            userCache.current.forEach((user, id) => {
                snapshot[id] = user;
            });
            setResolvedUsers(snapshot);
            setResolvingUsers(false);
        },
        []
    );

    /* ========================================
       SORT HELPER
    ======================================== */

    /*
        Pinsável no topo: logs com pinned === true vêm
        primeiro; dentro de cada grupo a ordem original
        (vinda da API) é preservada.
    */
    const sortLogs = (list: TelemetryLog[]) =>
        [...list].sort((a, b) => {
            if (a.pinned === b.pinned) return 0;
            return a.pinned ? -1 : 1;
        });

    /* ========================================
       FETCH LOGS
    ======================================== */

    const fetchLogs = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await telemetryService.getLogs({
                page,
                limit: LIMIT,
            });

            if (response.success) {
                setLogs(sortLogs(response.data));
                setMeta(response.meta);
                /* Resolve perfis de usuário após carregar os logs */
                await resolveUserProfiles(response.data);
            } else {
                setError(
                    response.message ||
                    'Erro ao carregar os logs. Tente novamente.'
                );
            }

        } catch (err: unknown) {
            const status =
                (err as { response?: { status?: number } })
                    ?.response?.status;

            if (status === 403) {
                setError('Você não tem permissão para acessar os logs de telemetria.');
            } else if (status === 401) {
                setError('Sessão expirada. Faça login novamente.');
            } else {
                setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
            }

        } finally {
            setLoading(false);
        }
    }, [resolveUserProfiles]);

    useEffect(() => {
        fetchLogs(currentPage);
    }, [currentPage, fetchLogs]);

    /* ========================================
       HANDLERS — PIN / UNPIN
    ======================================== */

    const handlePin = async (log: TelemetryLog) => {
        if (pinningId) return;
        setPinningId(log.id);
        try {
            const response = await telemetryService.togglePin(log.id);
            if (response.success) {
                setLogs(prev =>
                    sortLogs(
                        prev.map(l =>
                            l.id === log.id
                                ? { ...l, pinned: response.currentState }
                                : l
                        )
                    )
                );
                showToast(
                    response.currentState
                        ? 'Log fixado com sucesso.'
                        : 'Log desafixado com sucesso.'
                );
            } else {
                showToast('Não foi possível alterar o estado do log.');
            }
        } catch {
            showToast('Erro ao comunicar com o servidor. Tente novamente.');
        } finally {
            setPinningId(null);
        }
    };

    /* ========================================
       HANDLERS — DELETE
    ======================================== */

    const handleDeleteClick = (logId: string) => {
        setLogToDelete(logId);
    };

    const handleCancelDelete = () => {
        setLogToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!logToDelete) return;
        setDeletingId(logToDelete);
        try {
            const response = await telemetryService.deleteLog(logToDelete);
            if (response.success) {
                setLogs(prev => prev.filter(l => l.id !== logToDelete));
                if (meta) {
                    setMeta(prev =>
                        prev ? { ...prev, totalItems: prev.totalItems - 1 } : prev
                    );
                }
                showToast('Log removido com sucesso.');
            } else {
                showToast('Não foi possível remover o log.');
            }
        } catch {
            showToast('Erro ao comunicar com o servidor. Tente novamente.');
        } finally {
            setDeletingId(null);
            setLogToDelete(null);
        }
    };

    /* ========================================
       PAGINATION
    ======================================== */

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (meta && currentPage < meta.totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    /* ========================================
       HELPERS
    ======================================== */

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateError = (err: string, maxLen = 80) => {
        return err.length > maxLen
            ? err.slice(0, maxLen) + '...'
            : err;
    };

    /* ========================================
       USER POPOVER
    ======================================== */

    const handleOpenUserPopover = (
        e: React.MouseEvent<HTMLButtonElement>,
        user: UserDetails
    ) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setUserPopover({
            user,
            top: rect.bottom + 8,
            left: rect.left,
        });
    };

    const handleCloseUserPopover = () => {
        setUserPopover(null);
    };

    const roleLabel = (role: string) => {
        const map: Record<string, string> = {
            AGENT: 'Agente de Campo',
            SUPERVISOR: 'Supervisor',
            ADM: 'Administrador',
            SUPERADMIN: 'Super Admin',
        };
        return map[role] ?? role;
    };

    /*
        Retorna o botão clicável de usuário, um skeleton durante
        a resolução, ou o ID truncado como fallback.
    */
    const renderUserCell = (userId: string | null) => {

        if (!userId) {
            return (
                <span className="log-user-anonymous">
                    Anônimo
                </span>
            );
        }

        if (resolvingUsers && !(userId in resolvedUsers)) {
            return (
                <span className="log-user-skeleton" />
            );
        }

        const user = resolvedUsers[userId];

        if (user) {
            return (
                <button
                    className="log-user-btn"
                    onClick={(e) => handleOpenUserPopover(e, user)}
                    title="Ver perfil completo do usuário"
                    id={`log-user-btn-${userId}`}
                >
                    <div className="log-user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="log-user-name-text">{user.name}</span>
                    <ExternalLink size={11} className="log-user-btn-icon" />
                </button>
            );
        }

        /* Fallback: ID truncado (usuário não encontrado) */
        return (
            <span className="log-user-id" title={userId}>
                {userId.slice(0, 8) + '...'}
            </span>
        );
    };

    /* ========================================
       RENDER
    ======================================== */

    return (
        <div className="logs-page">

            {/* TOAST */}
            {toast.visible && (
                <div className="logs-toast">
                    <AlertTriangle size={16} />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* HEADER */}
            <div className="logs-header">

                <div className="logs-header-left">

                    <button
                        className="logs-back-btn"
                        onClick={() => navigate('/admin')}
                        id="logs-back-button"
                    >
                        <ArrowLeft size={18} />
                        Voltar
                    </button>

                    <div className="logs-title-block">

                        <div className="logs-title-row">
                            <AlertTriangle
                                size={22}
                                className="logs-title-icon"
                            />
                            <h2 className="logs-title">
                                Logs de Telemetria
                            </h2>
                        </div>

                        <p className="logs-subtitle">
                            Registros de erros enviados pelo aplicativo mobile
                        </p>

                    </div>

                </div>

                <button
                    className="logs-refresh-btn"
                    onClick={() => fetchLogs(currentPage)}
                    disabled={loading}
                    id="logs-refresh-button"
                    title="Recarregar"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'logs-spin' : ''}
                    />
                    Recarregar
                </button>

            </div>

            {/* META BAR */}
            {meta && !loading && !error && (
                <div className="logs-meta-bar">
                    <span className="logs-meta-total">
                        <strong>{meta.totalItems}</strong> logs encontrados
                    </span>
                    <span className="logs-meta-page">
                        Página {meta.currentPage} de {meta.totalPages}
                    </span>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="logs-error-state">
                    <AlertTriangle size={32} />
                    <p>{error}</p>
                    <button
                        className="logs-retry-btn"
                        onClick={() => fetchLogs(currentPage)}
                        id="logs-retry-button"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* LOADING */}
            {loading && !error && (
                <div className="logs-loading-state">
                    <div className="logs-loading-spinner" />
                    <span>Carregando logs...</span>
                </div>
            )}

            {/* TABLE */}
            {!loading && !error && logs.length > 0 && (
                <div className="logs-table-card">
                    <table className="logs-table">

                        <thead>
                            <tr>
                                <th>Dispositivo</th>
                                <th>Modelo</th>
                                <th>Android</th>
                                <th>Erro</th>
                                <th>Usuário</th>
                                <th>Data</th>
                                <th>Fixado</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className={log.pinned ? 'log-row pinned' : 'log-row'}
                                >

                                    {/* DISPOSITIVO */}
                                    <td>
                                        <div className="log-device-cell">
                                            <div className="log-device-icon">
                                                <Smartphone size={14} />
                                            </div>
                                            <span className="log-device-vendor">
                                                {log.vendor}
                                            </span>
                                        </div>
                                    </td>

                                    {/* MODELO */}
                                    <td>
                                        <span className="log-device-model">
                                            {log.deviceModel || '—'}
                                        </span>
                                    </td>

                                    {/* ANDROID */}
                                    <td>
                                        <span className="log-android-badge">
                                            Android {log.androidVersion}
                                        </span>
                                    </td>

                                    {/* ERRO */}
                                    <td>
                                        <div className="log-error-cell">
                                            {/* DESKTOP: texto truncado + botão ícone */}
                                            <span
                                                className="log-error-text"
                                                title={log.error}
                                            >
                                                {truncateError(log.error)}
                                            </span>
                                            <button
                                                className="log-error-expand-btn"
                                                onClick={(e) => handleOpenError(e, log.id, log.error)}
                                                title="Ver erro completo"
                                                id={`log-error-expand-${log.id}`}
                                            >
                                                <Terminal size={13} />
                                            </button>

                                            {/* MOBILE: botão único */}
                                            <button
                                                className="log-error-mobile-btn"
                                                onClick={(e) => handleOpenError(e, log.id, log.error)}
                                                id={`log-error-mobile-${log.id}`}
                                            >
                                                <Terminal size={13} />
                                                Exibir erro
                                            </button>
                                        </div>
                                    </td>

                                    {/* USUÁRIO */}
                                    <td>
                                        {renderUserCell(log.userId)}
                                    </td>

                                    {/* DATA */}
                                    <td>
                                        <span className="log-date">
                                            {formatDate(log.createdAt)}
                                        </span>
                                    </td>

                                    {/* FIXADO */}
                                    <td>
                                        <span className={`log-pinned-badge ${log.pinned ? 'is-pinned' : ''}`}>
                                            {log.pinned ? 'Fixado' : '—'}
                                        </span>
                                    </td>

                                    {/* AÇÕES */}
                                    <td>
                                        <div className="log-actions">

                                            <button
                                                className={`log-action-btn pin-btn ${log.pinned ? 'is-active' : ''}`}
                                                onClick={() => handlePin(log)}
                                                disabled={pinningId === log.id}
                                                title={log.pinned ? 'Desafixar log' : 'Fixar log'}
                                                id={`log-pin-${log.id}`}
                                            >
                                                {pinningId === log.id ? (
                                                    <span className="log-btn-spinner" />
                                                ) : log.pinned ? (
                                                    <PinOff size={14} />
                                                ) : (
                                                    <Pin size={14} />
                                                )}
                                            </button>

                                            <button
                                                className="log-action-btn delete-btn"
                                                onClick={() => handleDeleteClick(log.id)}
                                                disabled={deletingId === log.id}
                                                title="Excluir log permanentemente"
                                                id={`log-delete-${log.id}`}
                                            >
                                                {deletingId === log.id ? (
                                                    <span className="log-btn-spinner log-btn-spinner--danger" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && logs.length === 0 && (
                <div className="logs-empty-state">
                    <AlertTriangle size={40} />
                    <h3>Nenhum log encontrado</h3>
                    <p>Não há registros de erro no momento.</p>
                </div>
            )}

            {/* PAGINATION */}
            {meta && meta.totalPages > 1 && !loading && !error && (
                <div className="logs-pagination">

                    <button
                        className="logs-pagination-btn"
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1}
                        id="logs-prev-page-button"
                    >
                        <ChevronLeft size={16} />
                        Anterior
                    </button>

                    <div className="logs-pagination-pages">
                        {Array.from(
                            { length: Math.min(meta.totalPages, 5) },
                            (_, i) => {
                                const startPage =
                                    Math.max(1,
                                        Math.min(
                                            currentPage - 2,
                                            meta.totalPages - 4
                                        )
                                    );
                                const page = startPage + i;
                                return (
                                    <button
                                        key={page}
                                        className={`logs-page-btn ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                        id={`logs-page-${page}-button`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                        )}
                    </div>

                    <button
                        className="logs-pagination-btn"
                        onClick={handleNextPage}
                        disabled={currentPage >= (meta?.totalPages ?? 1)}
                        id="logs-next-page-button"
                    >
                        Próxima
                        <ChevronRight size={16} />
                    </button>

                </div>
            )}

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {logToDelete && (
                <div
                    className="logs-confirm-overlay"
                    onClick={handleCancelDelete}
                >
                    <div
                        className="logs-confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Confirmar exclusão</h3>
                        <p>
                            Tem certeza que deseja remover este log de telemetria?
                            Esta ação é <strong>permanente</strong> e não pode ser desfeita.
                        </p>
                        <div className="logs-confirm-actions">
                            <button
                                className="logs-btn-cancel"
                                onClick={handleCancelDelete}
                                disabled={deletingId !== null}
                                id="logs-delete-cancel-button"
                            >
                                Cancelar
                            </button>
                            <button
                                className="logs-btn-confirm-delete"
                                onClick={handleConfirmDelete}
                                disabled={deletingId !== null}
                                id="logs-delete-confirm-button"
                            >
                                {deletingId !== null ? 'Removendo...' : 'Remover'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POPOVER DE ERRO COMPLETO (fora da tabela para evitar clipping) */}
            {errorPopover && (
                <>
                    <div
                        className="log-error-overlay"
                        onClick={handleCloseError}
                    />
                    <div
                        className="log-error-popover"
                        style={{
                            top: errorPopover.top,
                            left: errorPopover.left,
                        }}
                    >
                        <div className="log-error-popover-header">
                            <span className="log-error-popover-title">
                                <Terminal size={14} />
                                Erro completo
                            </span>
                            <button
                                className="log-error-close-btn"
                                onClick={handleCloseError}
                                title="Fechar"
                                id={`log-error-close-${errorPopover.id}`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <pre className="log-error-popover-body">
                            {errorPopover.error}
                        </pre>
                        <div className="log-error-popover-footer">
                            <button
                                className={`log-error-copy-btn ${copiedErrorId === errorPopover.id ? 'copied' : ''}`}
                                onClick={() => handleCopyError(errorPopover.error, errorPopover.id)}
                                id={`log-error-copy-${errorPopover.id}`}
                            >
                                <Copy size={13} />
                                {copiedErrorId === errorPopover.id ? 'Copiado!' : 'Copiar erro'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* POPOVER DE PERFIL DO USUÁRIO */}
            {userPopover && (
                <>
                    <div
                        className="log-error-overlay"
                        onClick={handleCloseUserPopover}
                    />
                    <div
                        className="log-user-popover"
                        style={{
                            top: userPopover.top,
                            left: userPopover.left,
                        }}
                    >
                        {/* Header com avatar + nome */}
                        <div className="log-user-popover-header">
                            <div className="log-user-popover-avatar">
                                {userPopover.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="log-user-popover-identity">
                                <span className="log-user-popover-name">
                                    {userPopover.user.name}
                                </span>
                                <span
                                    className={`log-user-popover-role log-user-role--${userPopover.user.role.toLowerCase()}`}
                                >
                                    {roleLabel(userPopover.user.role)}
                                </span>
                            </div>
                            <button
                                className="log-error-close-btn"
                                onClick={handleCloseUserPopover}
                                title="Fechar"
                                id="log-user-popover-close"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Campos do perfil */}
                        <div className="log-user-popover-body">

                            <div className="log-user-popover-row">
                                <span className="log-user-popover-label">
                                    <Mail size={13} />
                                    E-mail
                                </span>
                                <span className="log-user-popover-value">
                                    {userPopover.user.email}
                                </span>
                            </div>

                            <div className="log-user-popover-row">
                                <span className="log-user-popover-label">
                                    <Phone size={13} />
                                    Telefone
                                </span>
                                <span className="log-user-popover-value">
                                    {userPopover.user.phoneNumber || '—'}
                                </span>
                            </div>

                            {userPopover.user.registration && (
                                <div className="log-user-popover-row">
                                    <span className="log-user-popover-label">
                                        <Hash size={13} />
                                        Matrícula
                                    </span>
                                    <span className="log-user-popover-value">
                                        {userPopover.user.registration}
                                    </span>
                                </div>
                            )}

                            {userPopover.user.block && (
                                <div className="log-user-popover-row">
                                    <span className="log-user-popover-label">
                                        <Shield size={13} />
                                        Setor / Quadra
                                    </span>
                                    <span className="log-user-popover-value">
                                        {userPopover.user.block}
                                    </span>
                                </div>
                            )}

                            {(() => {
                                const dept = userPopover.user.healthDepartment;
                                const deptId = userPopover.user.healthDepartmentId;

                                /* Objeto populado com name */
                                if (dept && typeof dept === 'object' && dept.name) {
                                    return (
                                        <div className="log-user-popover-row">
                                            <span className="log-user-popover-label">
                                                <Building2 size={13} />
                                                Secretaria
                                            </span>
                                            <span className="log-user-popover-value">
                                                {dept.name}
                                                {dept.city && (
                                                    <span className="log-user-popover-city">
                                                        {dept.city}
                                                        {dept.state ? ` — ${dept.state}` : ''}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                }

                                /* Apenas UUID como string ou healthDepartmentId avulso */
                                const rawId =
                                    (typeof dept === 'string' && dept) ||
                                    deptId ||
                                    null;

                                if (rawId) {
                                    return (
                                        <div className="log-user-popover-row">
                                            <span className="log-user-popover-label">
                                                <Building2 size={13} />
                                                Secretaria
                                            </span>
                                            <span className="log-user-popover-value log-user-popover-id" title={rawId}>
                                                {rawId.slice(0, 8)}...
                                            </span>
                                        </div>
                                    );
                                }

                                return null;
                            })()}

                            <div className="log-user-popover-row">
                                <span className="log-user-popover-label">
                                    <User size={13} />
                                    ID
                                </span>
                                <span className="log-user-popover-value log-user-popover-id">
                                    {userPopover.user.id}
                                </span>
                            </div>

                        </div>

                        {/* Footer com badge de situação */}
                        <div className="log-user-popover-footer">
                            <span
                                className={`log-user-popover-status ${
                                    userPopover.user.banned
                                        ? 'is-banned'
                                        : 'is-active'
                                }`}
                            >
                                {userPopover.user.banned ? 'Conta suspensa' : 'Conta ativa'}
                            </span>
                            <span className="log-user-popover-since">
                                Desde {new Date(userPopover.user.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                    </div>
                </>
            )}

        </div>
    );
};