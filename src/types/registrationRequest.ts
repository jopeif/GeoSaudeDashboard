export interface RegistrationRequests {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    role: "AGENT" | "SUPERVISOR",
    registration: string,
    block: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    decisionMadeOn: string,
    decisionMadeBy: string,
    createdAt: string
}

export interface RegistrationRequestsResponse {
    success: boolean;
    registrationRequest?: RegistrationRequests[];
    message?: string
}

export interface AcceptRegistrationRequestResponse {
    success:boolean;
    id?:string;
    message?:string
}
export interface RejectRegistrationRequestResponse {
    success:boolean;
    id?:string;
    message?:string
}