import api from '../api/client';
import type { AdmRegisterParams, AgentRegisterParams, BanUserResponse, FindAllUsersResponse, FindUserByIdResponse, SupervisorRegisterParams, UserRegisterReturn } from '../types/user';

export const userService = {
  async findAll(input:{page:number, limit:number}): Promise<FindAllUsersResponse> {
    const { data } = await api.get<FindAllUsersResponse>('/user', {
      params: {
        page: input.page,
        limit: input.limit,
      },
    });
    return data;
  },

  async findById(id: string): Promise<FindUserByIdResponse> {
    const { data } = await api.get<FindUserByIdResponse>(`/user/by-id/${id}`);
    return data;
  },

  async ban(id:string): Promise<BanUserResponse>{
    const { data } = await api.patch<BanUserResponse>(`/user/toggle-ban/${id}`)
    return data
  },

  async registerAgent(input:AgentRegisterParams):Promise<UserRegisterReturn>{
    const { data } = await api.post<UserRegisterReturn>('/user/agent/register', input)
    return data
  },
  async registerSupervisor(input:SupervisorRegisterParams):Promise<UserRegisterReturn>{
    const { data } = await api.post<UserRegisterReturn>('/user/supervisor/register', input)
    return data
  },
  async registerAdm(input:AdmRegisterParams):Promise<UserRegisterReturn>{
    const { data } = await api.post<UserRegisterReturn>('/user/adm/register', input)
    return data 
  },
};