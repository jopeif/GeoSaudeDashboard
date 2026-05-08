import api from '../api/client';
import type { FindAllUsersResponse, FindUserByIdResponse } from '../types/user';

export const userService = {
  async findAll(): Promise<FindAllUsersResponse> {
    const { data } = await api.get<FindAllUsersResponse>('/user/');
    return data;
  },

  async findById(id: string): Promise<FindUserByIdResponse> {
    const { data } = await api.get<FindUserByIdResponse>(`/user/by-id/${id}`);
    return data;
  }
};