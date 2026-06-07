export type HealthDepartment = {
    id:string,
    name:string,
    status: "ACTIVE" | "INACTIVE",
    city:string,
    state:string,
    createdAt: string,
    updatedAt:string,
    primarySupervisor:string
}

export type meta = {
    totalItems:number,
    itemCount:number,
    itemsPerPage:number,
    totalPages:number,
    currentPage:number
}

export type CreateHealthDepartmentInput = {
    name:string,
    city:string,
    state:string,
    primarySupervisor:{
        name:string,
        email:string,
        phoneNumber:string,
        password:string
    }
}

export type CreateHealthDepartmentOutput = {
    success:boolean,
    message?:string,
    healthDepartmentId?:string,
    supervisorId?:string
}

export type FindAllHealthDepartmentOutput = {
    success:boolean,
    message?:string,
    data?:HealthDepartment[]
}

export type FindAllHealthDepartmentPaginatedOutput = {
    success:boolean,
    message?:string,
    data?:HealthDepartment[],
    meta?:meta
}