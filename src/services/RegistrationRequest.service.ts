import api from "../api/client";
import type { AcceptRegistrationRequestResponse, RegistrationRequestsResponse, RejectRegistrationRequestResponse } from "../types/registrationRequest";

export const registrationRequestService = {
    async findAll(): Promise<RegistrationRequestsResponse> {
        const { data } = await api.get<RegistrationRequestsResponse>('/registration-request/');
        return data;
    },

    async accept(requestId:string):Promise<AcceptRegistrationRequestResponse>{
        const {data} = await api.post<AcceptRegistrationRequestResponse>('/registration-request/accept', {requestId})
        return data
    },
    async reject(requestId:string):Promise<RejectRegistrationRequestResponse>{
        
        const {data} = await api.post<RejectRegistrationRequestResponse>('/registration-request/reject', {requestId})
        return data
    }
}