"use client"

import { useQuery } from "@tanstack/react-query"

import { monitorServices } from "@/services/monitor/monitors.service"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMonitorData } from "@/types/monitor";
import { Monitor } from "@/types/monitor";

export function useMonitor() {
    return useQuery({
        queryKey: ["monitors"],
        queryFn: () => monitorServices.getAll()
    });
}

export function useUpdateMonitor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<createMonitorData> }) => monitorServices.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["monitors"] }),
    })
}

export function useDeleteMonitor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => monitorServices.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["monitors"] }),
    })
}