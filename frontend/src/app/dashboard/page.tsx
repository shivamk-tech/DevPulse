"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth/auth.service";
import { api } from "@/lib/api"

export default function DashboardPage() {
  useEffect(() => {
    authService
      .me()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

      
  }, []);

  useEffect(() => {
  api.post("/auth/refresh/")
    .then((res) => {
      console.log("Refresh Success", res.data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

  return <div>Dashboard</div>;
}