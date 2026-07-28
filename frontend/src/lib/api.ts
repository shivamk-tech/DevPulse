import axios from "axios";
import { error } from "node:console";
import { HOST } from '@/config/host'

if(!HOST.backend) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined ")
}

export const api = axios.create({
    baseURL:HOST.api,

    headers:{
        "Content-Type":"application/json"
    },

    withCredentials:true
})