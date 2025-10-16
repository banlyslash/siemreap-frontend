"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import EmployeeForm from "@/components/leave/EmployeeForm";

export default function AddEmployeePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Redirect if not HR
  if (user?.role !== "hr") {
    router.push("/dashboard");
    return null;
  }
  
  const handleSuccess = () => {
    router.push("/dashboard/employees");
  };
  
  const handleCancel = () => {
    router.push("/dashboard/employees");
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Employee</h2>
            <EmployeeForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
