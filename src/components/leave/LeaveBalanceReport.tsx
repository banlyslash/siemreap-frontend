"use client";

import { useState } from "react";
import Link from "next/link";
import { mockLeaveBalances } from "@/lib/leave/mockLeaveData";
import { LeaveType } from "@/lib/leave/types";
import { Download } from "lucide-react";

// Leave type display names
const leaveTypeNames: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
  unpaid: "Unpaid Leave",
  other: "Other Leave",
};

export default function LeaveBalanceReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [leaveType, setLeaveType] = useState<LeaveType | "all">("all");

  // Get all leave balances
  const leaveBalances = mockLeaveBalances;

  // Filter by year
  const filteredBalances = leaveBalances.filter((balance) => balance.year === year);

  // Get all available leave types
  const availableLeaveTypes = Array.from(
    new Set(
      filteredBalances.flatMap((balance) =>
        Object.keys(balance.balances) as LeaveType[]
      )
    )
  );

  // Mock employee data
  const employeeData: Record<string, { name: string; department: string }> = {
    "user-1": { name: "John Employee", department: "Engineering" },
    "user-2": { name: "Mary Manager", department: "Engineering" },
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">Leave Balance Report</h2>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/employees"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Employees
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType | "all")}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              {availableLeaveTypes.map((type) => (
                <option key={type} value={type}>
                  {leaveTypeNames[type]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Leave Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entitled
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Used
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pending
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Remaining
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBalances.flatMap((balance) => {
                const employee = employeeData[balance.userId] || {
                  name: "Unknown Employee",
                  department: "Unknown",
                };

                return Object.entries(balance.balances)
                  .filter(
                    ([type]) => leaveType === "all" || type === leaveType
                  )
                  .map(([type, data]) => (
                    <tr key={`${balance.userId}-${type}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leaveTypeNames[type as LeaveType]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.entitled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.used}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.remaining}
                      </td>
                    </tr>
                  ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
