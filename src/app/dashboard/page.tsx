"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        // Redirect based on user role
        switch (user.role) {
          case "employee":
            router.push("/dashboard/employee");
            break;
          case "manager":
            router.push("/dashboard/manager");
            break;
          case "hr":
            router.push("/dashboard/hr");
            break;
          default:
            router.push("/dashboard/employee");
        }
      }
    }
  }, [user, loading, router]);
  
  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
