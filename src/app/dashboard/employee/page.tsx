"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import LeaveBalanceCard from "@/components/leave/LeaveBalanceCard";
import { getEmployeeLeaveRequests } from "@/lib/leave/mockLeaveData";
import { Calendar, CalendarDays, Clock, FileText, Plus } from "lucide-react";

export default function EmployeeDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an employee
  useEffect(() => {
    if (!loading && (!user || user.role !== "employee")) {
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

  if (!user || user.role !== "employee") {
    return null; // Will redirect in useEffect
  }

  // Get recent leave requests
  const leaveRequests = getEmployeeLeaveRequests(user.id);
  const recentRequests = [...leaveRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8">
            {/* Quick actions */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                  <Link
                    href="/dashboard/request-leave"
                    className="p-6 flex items-center hover:bg-gray-50"
                  >
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Request Leave
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Submit a new leave request
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/leave-history"
                    className="p-6 flex items-center hover:bg-gray-50"
                  >
                    <div className="bg-green-100 rounded-lg p-3 mr-4">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Leave History
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        View all your leave requests
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
                  <Link
                    href="/dashboard/calendar"
                    className="p-6 flex items-center hover:bg-gray-50"
                  >
                    <div className="bg-purple-100 rounded-lg p-3 mr-4">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Leave Calendar
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        View team availability calendar
                      </p>
                    </div>
                  </Link>
                  <div className="p-6 flex items-center">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        Remaining Leave: {14} days
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Annual leave balance for {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent leave requests */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
                <Link
                  href="/dashboard/leave-history"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
              <div className="border-t border-gray-200">
                {recentRequests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No recent leave requests.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentRequests.map((request) => {
                      // Format dates
                      const startDate = new Date(request.startDate).toLocaleDateString();
                      const endDate = new Date(request.endDate).toLocaleDateString();
                      const createdDate = new Date(request.createdAt).toLocaleDateString();

                      // Status color
                      let statusColor = "text-yellow-600 bg-yellow-100";
                      if (request.status === "approved") {
                        statusColor = "text-green-600 bg-green-100";
                      } else if (request.status === "rejected") {
                        statusColor = "text-red-600 bg-red-100";
                      } else if (request.status === "approved_by_manager") {
                        statusColor = "text-blue-600 bg-blue-100";
                      }

                      return (
                        <li key={request.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <CalendarDays className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)} Leave
                                </p>
                                <p className="text-sm text-gray-500">
                                  {startDate} - {endDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {request.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                              <div className="ml-4 flex items-center text-sm text-gray-500">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <span>{createdDate}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Leave balance */}
            <LeaveBalanceCard />
          </div>
        </div>
      </div>
    </div>
  );
}
