"use client"

import { useQuery } from "@tanstack/react-query"

import { moniterServices } from "@/services/moniter/moniters.service"

export function useMonitor(){
    return useQuery({
        queryKey: ["monitors"],
        queryFn : () => moniterServices.getAll()
    });
}

