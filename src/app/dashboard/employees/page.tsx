"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import EmployeesList from "@/components/leave/EmployeesList";

export default function EmployeesPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage employee records and leave entitlements
          </p>
        </div>

        <div className="space-y-8">
          <EmployeesList />
          
          {/* Additional employee management sections can be added here */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Leave Entitlement Management</h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure leave entitlements for employees
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Annual Leave Policy</h3>
                  <p className="text-sm text-gray-500">
                    Configure annual leave entitlements by role, department, or tenure
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Sick Leave Policy</h3>
                  <p className="text-sm text-gray-500">
                    Configure sick leave entitlements and documentation requirements
                  </p>
                </div>
                <Link
                  href="/dashboard/holidays"
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="text-base font-medium text-gray-900 mb-2">Holiday Calendar</h3>
                  <p className="text-sm text-gray-500">
                    Configure company holidays and non-working days
                  </p>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Department Management</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage departments and organizational structure
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Link
                  href="/dashboard/departments"
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="text-base font-medium text-gray-900 mb-2">Departments</h3>
                  <p className="text-sm text-gray-500">
                    Add, edit, or remove departments
                  </p>
                </Link>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Reporting Structure</h3>
                  <p className="text-sm text-gray-500">
                    Configure manager-employee relationships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
