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