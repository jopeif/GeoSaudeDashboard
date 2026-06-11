export interface UserDetails {
    id: string;
    name: string;
    email: string;
    role: "ADM" | "AGENT" | "SUPERVISOR";
    phoneNumber: string;
    banned: boolean;
    createdAt: string; 
    registration?: string;
    block?: string;
    accessLevel?: number;
    healthDepartment?: any;
}

export interface FindAllUsersResponse {
    success: boolean;
    users?: UserDetails[];
    message?: string;
}

export interface FindUserByIdResponse {
    success: boolean;
    user?: UserDetails;
    message?: string;
}
export interface BanUserResponse {
    success: boolean;
    message?: string;
}

export interface AgentRegisterParams{
    name: string;
    email: string;
    phoneNumber: string;
    password:string;
    registration: string;
    block: string;
    healthDepartment?: string;
}
export interface SupervisorRegisterParams{
    name: string;
    email: string;
    phoneNumber: string;
    password:string;
    registration?: string;
    healthDepartment?: string;
}
export interface AdmRegisterParams{
    name: string;
    email: string;
    phoneNumber: string;
    password:string;
    accessLevel?: number;
}

export interface UserRegisterReturn{
    success:boolean;
    message?: string;
    id?:string
}