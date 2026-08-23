import { createMonitorData } from "@/types/monitor"
import { api } from "@/lib/api"
import { Monitor } from "@/types/monitor"


export const monitorServices = {
    Create(data: createMonitorData) {
        return api.post<Monitor>("/monitors/", data)
    },

    getAll() {
        return api.get<Monitor[]>("/monitors/")
    },
    update(id: string, data: Partial<createMonitorData>) {
        return api.patch<Monitor>(`/monitors/${id}/`, data)
    },

    delete(id: string) {
        return api.delete<void>(`/monitors/${id}/`)

        
        
    }
}

