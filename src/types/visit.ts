export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "VACANT LOT" | "STRATEGIC POINT" | "HEALTH FACILITY" | "SCHOOL" | "OTHER";
export type VisitType = "ROUTINE" | "RECOVERY" | "LIRAA" | "BLOCKING";
export type PendingReason = "NONE" | "RESIDENT REFUSED" | "PROPERTY CLOSED" | "ABSENT" | "ABANDONED PROPERTY" | "OTHER";
export type DepositType = "A1" | "A2" | "B" | "C" | "D1" | "D2" | "E";
export type LarvicideType = "NONE" | "BTI" | "PYRIPROXYFEN" | "DIFLUBENZURON" | "TEMEPHOS" | "OTHER";

export interface CreateNewVisitDTOInput {
    visitDate: string;
    localityCode: string;
    streetName: string;
    number: string;
    blockSide?: string;
    complement?: string;
    propertyType: PropertyType;
    residentName?: string;
    phone?: string;
    entryTime?: string;
    visitType: VisitType;
    inspected: boolean;
    pendingReason?: PendingReason;

    depositsWithFocus: boolean;
    depositType?: DepositType;
    larvicideUsed?: LarvicideType;
    treatedDeposits: number;
    eliminatedDeposits: number;

    depositsA1: number;
    depositsA2: number;
    depositsB: number;
    depositsC: number;
    depositsD1: number;
    depositsD2: number;
    depositsE: number;

    treatmentApplied: boolean;
    treatmentLarvicideType?: LarvicideType;
    larvicideAmount?: number;
    perifocalDeposits: number;
    adulticideLoads: number;

    sampleCollected: boolean;
    sampleCode?: string;
    tubeCount: number;

    notes?: string;

    latitude?: number;
    longitude?: number;

    userId: string;
}

export interface CreateNewVisitDTOOutput {
    success: boolean;
    status_code: number;
    message?: string;
    id?: string;
}

export type FindVisitsByUserIdDTOOutput = {
    success: boolean,
    message?: string,
    visitForm?: {
        id: string;
        visitDate: Date;
        localityCode: string;
        streetName: string;
        number: string;
        blockSide: string | undefined;
        complement: string | undefined;
        propertyType: "RESIDENTIAL" | "COMMERCIAL" | "VACANT_LOT" | "STRATEGIC_POINT" | "HEALTH_FACILITY" | "SCHOOL" | "OTHER";
        residentName: string | undefined;
        phone: string | undefined;
        entryTime: string | undefined;
        visitType: "ROUTINE" | "RECOVERY" | "LIRAA" | "BLOCKING";
        inspected: boolean;
        pendingReason: "NONE" | "REFUSED" | "CLOSED" | "ABSENT" | "ABANDONED" | "OTHER" | undefined;
        depositsWithFocus: boolean;
        depositType: "A1" | "A2" | "B" | "C" | "D1" | "D2" | "E" | undefined;
        larvicideUsed: "NONE" | "BTI" | "PYRIPROXYFEN" | "DIFLUBENZURON" | "TEMEPHOS" | "OTHER" | undefined;
        treatedDeposits: number;
        eliminatedDeposits: number;
        depositsA1: number;
        depositsA2: number;
        depositsB: number;
        depositsC: number;
        depositsD1: number;
        depositsD2: number;
        depositsE: number;
        treatmentApplied: boolean;
        treatmentLarvicideType: "NONE" | "BTI" | "PYRIPROXYFEN" | "DIFLUBENZURON" | "TEMEPHOS" | "OTHER" | undefined;
        larvicideAmount: number | undefined;
        perifocalDeposits: number;
        adulticideLoads: number;
        sampleCollected: boolean;
        sampleCode: string | undefined;
        tubeCount: number;
        notes: string | undefined;
        latitude: number | undefined;
        longitude: number | undefined;
        createdAt: Date;
        userId: string;
    }[]
}
export type FindVisitByIdDTOOutput = {
    success: boolean,
    message?: string,
    visitForm?: {
        id: string;
        visitDate: Date;
        localityCode: string;
        streetName: string;
        number: string;
        blockSide: string | undefined;
        complement: string | undefined;
        propertyType: "RESIDENTIAL" | "COMMERCIAL" | "VACANT_LOT" | "STRATEGIC_POINT" | "HEALTH_FACILITY" | "SCHOOL" | "OTHER";
        residentName: string | undefined;
        phone: string | undefined;
        entryTime: string | undefined;
        visitType: "ROUTINE" | "RECOVERY" | "LIRAA" | "BLOCKING";
        inspected: boolean;
        pendingReason: "NONE" | "REFUSED" | "CLOSED" | "ABSENT" | "ABANDONED" | "OTHER" | undefined;
        depositsWithFocus: boolean;
        depositType: "A1" | "A2" | "B" | "C" | "D1" | "D2" | "E" | undefined;
        larvicideUsed: "NONE" | "BTI" | "PYRIPROXYFEN" | "DIFLUBENZURON" | "TEMEPHOS" | "OTHER" | undefined;
        treatedDeposits: number;
        eliminatedDeposits: number;
        depositsA1: number;
        depositsA2: number;
        depositsB: number;
        depositsC: number;
        depositsD1: number;
        depositsD2: number;
        depositsE: number;
        treatmentApplied: boolean;
        treatmentLarvicideType: "NONE" | "BTI" | "PYRIPROXYFEN" | "DIFLUBENZURON" | "TEMEPHOS" | "OTHER" | undefined;
        larvicideAmount: number | undefined;
        perifocalDeposits: number;
        adulticideLoads: number;
        sampleCollected: boolean;
        sampleCode: string | undefined;
        tubeCount: number;
        notes: string | undefined;
        latitude: number | undefined;
        longitude: number | undefined;
        createdAt: Date;
        userId: string;
    }

    
}

export interface GetAgentHistoryParams {
    userId: string;
    page: number;
    limit: number;
}

// Versão "leve" da visita para a listagem lateral
export interface VisitHistoryShallowItem {
    id: string;
    visitDate: string;
    streetName: string;
    number: string;
    localityCode: string;
    visitType: string;
    propertyType: string;
    depositsWithFocus: boolean;
    entryTime?: string;
    notes?: string;
}

// Resposta da API com metadados de paginação
export interface AgentHistoryPaginatedResponse {
    success: boolean;
    data: VisitHistoryShallowItem[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    }
}