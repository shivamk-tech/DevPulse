export interface createMoniterData  {
    name: string;
    url : string; 
    method : "GET" | "HEAD";
    interval: number;
    timeout: number;
}

export interface Moniters {
    id: string;
    name: string;
    method: "GET" | "HEAD";
    interval: number;
    timeout:number;
    is_active: boolean;
    updated_at: string;
    created_at: string
}

