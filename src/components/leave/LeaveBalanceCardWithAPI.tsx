"use client";

import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GET_LEAVE_BALANCES } from "@/lib/leave/leaveQueries";
import { LeaveType } from "@/lib/leave/types";
import { LeaveBalancesResponse } from "@/lib/leave/graphqlTypes";

// Leave type color mapping - using actual leave type names from API
const leaveTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  "Annual Leave": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Sick Leave": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "Personal Leave": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Bereavement Leave": {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  "Maternity Leave": {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  "Paternity Leave": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "Study Leave": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

// Default colors for unknown leave types
const defaultColors = {
  bg: "bg-green-50",
  text: "text-green-700",
  border: "border-green-200",
};

export default function LeaveBalanceCard() {
  const { user } = useAuth();
  
  // Fetch leave balances for the current user
  const { loading, error, data } = useQuery<LeaveBalancesResponse>(GET_LEAVE_BALANCES, {
    variables: { 
      userId: user?.id,
      year: new Date().getFullYear()
    },
    fetchPolicy: "cache-and-network",
    skip: !user
  });
  
  if (!user) {
    return null;
  }

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

  const leaveBalances = data?.leaveBalances || [];
  
  if (leaveBalances.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h2>
        <p className="text-gray-500">No leave balance information available.</p>
      </div>
    );
  }

  // Get the current year from the first leave balance entry
  const currentYear = leaveBalances.length > 0 ? leaveBalances[0].year : new Date().getFullYear();
  
  // Create a map of leave types to their balances
  const leaveBalanceMap = leaveBalances.reduce((acc, balance) => {
    acc[balance.leaveType.name] = {
      entitled: balance.allocated,
      used: balance.used,
      remaining: balance.remaining,
      pending: 0 // This might need to be calculated or fetched separately
    };
    return acc;
  }, {} as Record<string, { entitled: number; used: number; remaining: number; pending: number }>);
  
  // Get all leave types with balances
  const leaveTypes = Object.keys(leaveBalanceMap) as LeaveType['name'][];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Leave Balance</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your current leave entitlements for {currentYear}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {leaveTypes.map((type) => {
            const balance = leaveBalanceMap[type];
            if (!balance) return null;
            
            const colors = leaveTypeColors[type] || defaultColors;
            const percentage = Math.round((balance.used / balance.entitled) * 100);
            
            return (
              <div
                key={type}
                className={`border ${colors.border} rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${colors.bg} ${colors.border} border-2 mr-3`}></div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {type}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{percentage}% used</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Allocated</p>
                    <p className="text-lg font-semibold text-gray-900">{balance.entitled}</p>
                    <p className="text-xs text-gray-400">days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Used</p>
                    <p className="text-lg font-semibold text-gray-900">{balance.used}</p>
                    <p className="text-xs text-gray-400">days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Pending</p>
                    <p className="text-lg font-semibold text-orange-600">{balance.pending}</p>
                    <p className="text-xs text-gray-400">days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className="text-lg font-semibold text-blue-600">{balance.remaining}</p>
                    <p className="text-xs text-gray-400">days</p>
                  </div>
                </div>
                
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
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
