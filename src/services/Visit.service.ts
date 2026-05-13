import api from '../api/client';
import { type AgentHistoryPaginatedResponse, type CreateNewVisitDTOInput, type CreateNewVisitDTOOutput, type GetAgentHistoryParams } from '../types/visit';

export const visitService = {
    /**
     * Registra uma nova ficha de visita de campo
     */
    async create(visitData: CreateNewVisitDTOInput): Promise<CreateNewVisitDTOOutput> {
        const { data } = await api.post<CreateNewVisitDTOOutput>('/visit/create', visitData);
        return data;
    },

    /**
     * Busca uma visita específica
     */
    async findById(id: string): Promise<any> {
        const { data } = await api.get(`/visit/by-id/${id}/`);
        return data;
    },

    /**
     * Lista histórico de visitas de um usuário (agente)
     */
    async getHistoryByAgent(userId: string): Promise<any> {
        const { data } = await api.get(`/visit/by-user/${userId}/`);
        return data;
    },

    async getHistoryByAgentPaginated(params: GetAgentHistoryParams): Promise<AgentHistoryPaginatedResponse> {
        const { userId, page, limit } = params;
        
        try {
            // A rota utiliza query params para a paginação
            const { data } = await api.get<AgentHistoryPaginatedResponse>(
                `/visit/history/${userId}`, 
                {
                    params: {
                        page,
                        limit
                    }
                }
            );
            
            return data;
        } catch (error) {
            console.error(`Erro ao buscar histórico paginado do agente ${userId}:`, error);
            
            // Retorno de fallback em caso de erro para evitar quebra do componente
            return {
                success: false,
                data: [],
                meta: {
                    totalItems: 0,
                    itemCount: 0,
                    itemsPerPage: limit,
                    totalPages: 0,
                    currentPage: page
                }
            };
        }
    },

    /**
     * Atualiza dados de uma visita registrada
     */
    async update(id: string, visitData: Partial<CreateNewVisitDTOInput>): Promise<CreateNewVisitDTOOutput> {
        const { data } = await api.put<CreateNewVisitDTOOutput>(`/visit/by-id/${id}/`, visitData);
        return data;
    },

    /**
     * Exclui um registro de visita
     */
    async delete(id: string): Promise<{ success: boolean }> {
        const { data } = await api.delete<{ success: boolean }>(`/visit/by-id/${id}/`);
        return data;
    }


};