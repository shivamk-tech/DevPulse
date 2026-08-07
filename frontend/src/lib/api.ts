import axios, { InternalAxiosRequestConfig } from "axios";
import { HOST } from '@/config/host'


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

let isRedirecting = false
let isRefreshing = false;

type FailedRequest = {
    resolve: () => void;
    reject: (error: unknown) => void;
};

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
}

let failedQueue: FailedRequest[] = [];

const AUTH_ENDPOINT = [
    "/auth/refresh/",
    "/auth/login",
    "/auth/signup/"
]

function isAuthEndpoint(url?: string) {
    if (!url) {
        return false;
    }

    return AUTH_ENDPOINT.some((endpoint) => url.includes(endpoint))
}

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

    (response) => response,

    async (error) => {

        if (!error.config) {
            return Promise.reject(error);
        }

        const originalRequest = error.config as RetryAxiosRequestConfig

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isAuthEndpoint(originalRequest.url)) {
            return Promise.reject(error);
        }



        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {

                failedQueue.push({
                    resolve,
                    reject
                })

            }).then(() => {
                return api(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            await api.post("/auth/refresh/");

            processQueue();

            return api(originalRequest);

        } catch (refreshError) {

            processQueue(refreshError);

            if (!isRedirecting) {
                isRedirecting = true
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false
            isRedirecting = false

        }
    }
);

