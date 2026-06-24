import api from '../api/client';
import type {
    GetLogsParams,
    GetLogsResponse,
    CreateLogInput,
    CreateLogResponse,
    TogglePinResponse,
    DeleteLogResponse,
} from '../types/telemetry';

export const telemetryService = {
    /**
     * Busca todos os logs de erro paginados (apenas ADM)
     */
    async getLogs(params: GetLogsParams): Promise<GetLogsResponse> {
        const { data } = await api.get<GetLogsResponse>('/telemetry/all', {
            params: {
                page: params.page,
                limit: params.limit,
            },
        });
        return data;
    },

    /**
     * Registra um novo log de erro vindo do app mobile
     */
    async createLog(input: CreateLogInput): Promise<CreateLogResponse> {
        const { data } = await api.post<CreateLogResponse>('/telemetry/log', input);
        return data;
    },

    /**
     * Alterna o estado de fixação (pinned) de um log de erro (apenas ADM)
     */
    async togglePin(id: string): Promise<TogglePinResponse> {
        const { data } = await api.patch<TogglePinResponse>(
            `/telemetry/log/togglepin/${id}`
        );
        return data;
    },

    /**
     * Remove permanentemente um log de erro (apenas ADM)
     */
    async deleteLog(id: string): Promise<DeleteLogResponse> {
        const { data } = await api.delete<DeleteLogResponse>(
            `/telemetry/log/by-id/${id}`
        );
        return data;
    },
};
