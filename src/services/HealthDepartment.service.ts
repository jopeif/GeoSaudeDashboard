import api from "../api/client";
import type { CreateHealthDepartmentInput, CreateHealthDepartmentOutput, FindAllHealthDepartmentOutput, FindAllHealthDepartmentPaginatedOutput } from "../types/healthDepartment";

export const HealthDepartmentService = {

    async create(input:CreateHealthDepartmentInput):Promise<CreateHealthDepartmentOutput>{
        const { data } = await api.post<CreateHealthDepartmentOutput>("/health-department/new", input)
        return data
    },

    async findAll():Promise<FindAllHealthDepartmentOutput>{
        const { data } = await api.get<FindAllHealthDepartmentOutput>("/health-department/all")
        return data
    },

    async findAllPaginated(input:{page:number, limit:number}):Promise<FindAllHealthDepartmentPaginatedOutput>{
        const {data} = await api.get<FindAllHealthDepartmentPaginatedOutput>("/health-department/all/paginated", {
            params: {
                p: input.page,
                limit: input.limit
            }
        })
        return data
    },

    async setInactive(healthDepartmentId:string){
        healthDepartmentId
        throw new Error("Method not implemented")
    },

    async setActive(healthDepartmentId:string){
        healthDepartmentId
        throw new Error("Method not implemented")
    },

    async changePrimarySupervisor(healthDepartmentId:string, supervisorId:string){
        healthDepartmentId
        supervisorId
        throw new Error("Method not implemented")
    },
}