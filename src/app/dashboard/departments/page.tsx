"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import DepartmentManagement from "@/components/leave/DepartmentManagement";

export default function DepartmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not HR
  useEffect(() => {
    if (!loading && (!user || user.role !== "hr")) {
      if (!user) {
        router.push("/login");
      } else {
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "hr") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage departments and organizational structure
          </p>
        </div>

        <div className="space-y-8">
          <DepartmentManagement />
        </div>
      </div>
    </div>
  );
}
