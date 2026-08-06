import axios from "axios";
import { HOST } from '@/config/host'
import { error } from "console";
import { promise } from "zod";
import { InternalAxiosRequestConfig } from "axios";

if (!HOST.backend) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined ")
}

export const api = axios.create({
    baseURL: HOST.api,

    headers: {
        "Content-Type": "application/json"
    },

    withCredentials: true
})

let isRefreshing = false;

type FailedRequest = {
    resolve: () => void;
    reject: (error: unknown) => void;
};

interface RetryAxiosConfigRequest extends InternalAxiosRequestConfig {
    
}

let failedQueue: FailedRequest[] = [];


function processQueue(error?: unknown) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
}

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }
        
        const originalRequest = error.config

        if(originalRequest._retry){
            return Promise.reject(error);
        }



    }
);

