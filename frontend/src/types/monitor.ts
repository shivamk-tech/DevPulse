export interface createMonitorData {
    name: string;
    url: string;
    method: "GET" | "HEAD";
    interval: number;
    timeout: number;
}

export interface Monitor {
    id: string;
    name: string;
    url: string;
    method: "GET" | "HEAD";
    interval: number;
    timeout: number;
    is_active: boolean;
    updated_at: string;
    created_at: string
}

export interface MonitorStats {
    total_checks: number;
    successful_checks: number;
    failed_checks: number;
    uptime_percentage: number;
    average_response_time: number | null;
    min_response_time: number | null;
    max_response_time: number | null;
    last_checked_at: string | null;
}

export interface CheckResult {
    id: number
    status_code: number | null
    response_time: number | null
    success: boolean
    error: string | null
    checked_at: string
}