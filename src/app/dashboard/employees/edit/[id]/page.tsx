"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { mockUsers } from "@/lib/auth/mockUsers";
import EmployeeForm from "@/components/leave/EmployeeForm";
import { User } from "@/lib/auth/types";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not HR
  if (user?.role !== "hr") {
    router.push("/dashboard");
    return null;
  }
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchEmployee = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundEmployee = mockUsers.find(u => u.id === params.id);
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          setError("Employee not found");
        }
      } catch (error) {
        setError("Failed to load employee data");
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [params.id]);
  
  const handleSuccess = () => {
    router.push("/dashboard/employees");
  };
  
  const handleCancel = () => {
    router.push("/dashboard/employees");
  };
  
  if (loading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !employee) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-600 text-center">
              <p>{error || "Employee not found"}</p>
              <button
                onClick={() => router.push("/dashboard/employees")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Employees
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Employee: {employee.name}</h2>
            <EmployeeForm 
              employee={employee}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
