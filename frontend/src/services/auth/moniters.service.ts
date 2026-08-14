import { createMoniterData } from "@/types/moniter"
import { api } from "@/lib/api"
import { Moniters } from "@/types/moniter"


export const moniterServices = {
    Create(data: createMoniterData) {
        return api.post<Moniters>("/moniters", data)
    },

    getAll(){
        return api.get<Moniters[]>("/moniters")
    }
}

