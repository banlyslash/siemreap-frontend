"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery } from "@apollo/client/react";
import { GET_USER_QUERY } from "@/lib/graphql/queries/user";
import EmployeeEditFormWithAPI from "@/components/leave/EmployeeEditFormWithAPI";
import LeaveBalanceInitModal from "@/components/leave/LeaveBalanceInitModal";
import { GetUserDetailedResponse } from "@/lib/leave/graphqlTypes";
import { PlusCircle } from "lucide-react";


export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLeaveBalanceModalOpen, setIsLeaveBalanceModalOpen] = useState(false);
  
  const { data, loading, error, refetch } = useQuery<GetUserDetailedResponse>(GET_USER_QUERY, {
    variables: { id: params.id },
    fetchPolicy: "cache-and-network",
  });
  
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
  
  const employee = data?.user;

  if (error || !employee) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-600 text-center">
              <p>{error?.message || "Employee not found"}</p>
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Employee Edit Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Employee: {employee.firstName} {employee.lastName}</h2>
            <EmployeeEditFormWithAPI 
              employee={employee}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
        
        {/* Leave Balances Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Leave Balances</h2>
              <button
                onClick={() => setIsLeaveBalanceModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Initialize Balance
              </button>
            </div>
            
            {/* Display existing leave balances */}
            {employee.leaveBalances && employee.leaveBalances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employee.leaveBalances.map((balance) => (
                      <tr key={balance.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{balance.leaveType.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.allocated}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.used}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{balance.remaining}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No leave balances found. Initialize a leave balance to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Leave Balance Initialization Modal */}
      <LeaveBalanceInitModal
        userId={params.id}
        isOpen={isLeaveBalanceModalOpen}
        onClose={() => setIsLeaveBalanceModalOpen(false)}
        onSuccess={() => {
          // Refetch user data to get updated leave balances
          refetch();
          setIsLeaveBalanceModalOpen(false);
        }}
      />
    </div>
  );
}

