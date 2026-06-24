export interface TelemetryLog {
    id: string;
    pinned: boolean;
    userId: string | null;
    deviceModel: string;
    vendor: string;
    androidVersion: string;
    error: string;
    createdAt: string;
}

export interface TelemetryMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface GetLogsParams {
    page: number;
    limit: number;
}

export interface GetLogsResponse {
    success: boolean;
    meta: TelemetryMeta;
    data: TelemetryLog[];
    message?: string;
}

export interface CreateLogInput {
    deviceModel: string;
    vendor: string;
    androidVersion: string;
    error: string;
    userId?: string;
}

export interface CreateLogResponse {
    success: boolean;
    message?: string;
}

export interface TogglePinResponse {
    success: boolean;
    currentState: boolean;
    message?: string;
}

export interface DeleteLogResponse {
    success: boolean;
    message?: string;
}
