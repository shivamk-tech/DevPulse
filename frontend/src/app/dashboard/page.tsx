"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth/auth.service";

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

  return <div>Dashboard</div>;
}