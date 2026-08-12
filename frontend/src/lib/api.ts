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

let isRefreshing = false;

/**
 * Called when a session is unrecoverable — the access token was rejected and
 * refreshing it also failed.
 *
 * This layer reports the fact; it does not act on it. Previously this file did
 * `window.location.href = "/login"`, which meant the HTTP client owned a
 * routing rule: any 401 anywhere hard-navigated to /login, full page reload,
 * even for an anonymous visitor reading the public landing page. AuthProvider
 * registers a handler here, flips its status, and the mounted guard decides
 * what that means for the route the user is actually on.
 */
type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

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

            // Report, don't navigate. The provider marks the session dead and
            // the active guard redirects if the current route requires auth.
            onUnauthorized?.();

            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false

        }
    }
);

