"use client"

import { useQuery } from "@tanstack/react-query"

import { monitorServices } from "@/services/monitor/monitors.service"

export function useMonitor(){
    return useQuery({
        queryKey: ["monitors"],
        queryFn : () => monitorServices.getAll()
    });
}

