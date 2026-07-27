import axios from "axios";
import { error } from "node:console";

if(![process.env.NEXT_PUBLIC_API_URL]) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined ")
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    headers:{
        "Content-Type":"application/json"
    },

    withCredentials:true
})