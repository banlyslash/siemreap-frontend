"use client";

import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GET_LEAVE_BALANCES } from "@/lib/leave/leaveQueries";
import { LeaveType } from "@/lib/leave/types";
import { LeaveBalanceResponse } from "@/lib/leave/graphqlTypes";

// Leave type color mapping
const leaveTypeColors: Record<LeaveType, { bg: string; text: string; border: string }> = {
  annual: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  sick: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  personal: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  unpaid: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  other: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// Leave type display names
const leaveTypeNames: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
  unpaid: "Unpaid Leave",
  other: "Other Leave",
};

export default function LeaveBalanceCard() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  
  if (!user) {
    return null;
  }

  // Fetch leave balances for the current user
  const { loading, error, data } = useQuery<LeaveBalanceResponse>(GET_LEAVE_BALANCES, {
    variables: { 
      userId: user.id,
      year: currentYear
    },
    fetchPolicy: "cache-and-network"
  });

  if (loading && !data) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h2>
        <p className="text-red-500">Error loading leave balances: {error.message}</p>
      </div>
    );
  }

  const leaveBalance = data?.leaveBalances;
  
  if (!leaveBalance) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h2>
        <p className="text-gray-500">No leave balance information available.</p>
      </div>
    );
  }

  // Get all leave types with balances
  const leaveTypes = Object.keys(leaveBalance.balances) as LeaveType[];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Leave Balance</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your current leave entitlements for {leaveBalance.year}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaveTypes.map((type) => {
            const balance = leaveBalance.balances[type];
            if (!balance) return null;
            
            const colors = leaveTypeColors[type];
            const percentage = Math.round((balance.used / balance.entitled) * 100);
            
            return (
              <div
                key={type}
                className={`border ${colors.border} rounded-lg overflow-hidden`}
              >
                <div className={`${colors.bg} px-4 py-2`}>
                  <h3 className={`text-sm font-medium ${colors.text}`}>
                    {leaveTypeNames[type]}
                  </h3>
                </div>
                
                <div className="px-4 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Used</span>
                    <span className="text-sm font-medium text-gray-900">
                      {balance.used} / {balance.entitled} days
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <span className="block text-sm text-gray-500">Pending</span>
                      <span className="block mt-1 text-lg font-medium text-gray-900">
                        {balance.pending}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Remaining</span>
                      <span className="block mt-1 text-lg font-medium text-gray-900">
                        {balance.remaining}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
