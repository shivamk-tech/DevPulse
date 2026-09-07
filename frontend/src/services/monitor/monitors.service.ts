import { createMonitorData } from "@/types/monitor"
import { api } from "@/lib/api"
import { Monitor } from "@/types/monitor"
import { MonitorStats } from "@/types/monitor"

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
    },

    toggle(id: string) {
        return api.post<Monitor>(`/monitors/${id}/toggle/`)
    },  

    async stats(id : string){
        const response = await api.get<MonitorStats>(`/monitors/${id}/stats/`)
        return response.data
    },

    async checks(id: string) {
        const response = await api.get(`/monitors/${id}/checks/`)
        return response.data
    }
}

