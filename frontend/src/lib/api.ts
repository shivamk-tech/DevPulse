import axios from "axios";
import { HOST } from '@/config/host'
import { error } from "console";
import { promise } from "zod";

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

let isRefreshing = false;

type FaildRequest = {
    resolve: () => void;
    reject: (error: unknown) => void; 
};

let failedRequest: FaildRequest[] = [];

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

