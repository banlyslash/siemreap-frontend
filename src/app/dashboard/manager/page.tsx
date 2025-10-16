"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getManagerPendingApprovals } from "@/lib/leave/mockLeaveData";
import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react";

export default function ManagerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a manager
  useEffect(() => {
    if (!loading && (!user || user.role !== "manager")) {
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

  if (!user || user.role !== "manager") {
    return null; // Will redirect in useEffect
  }

  // Get pending approvals
  const pendingApprovals = getManagerPendingApprovals(user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Pending Approvals */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Approvals
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {pendingApprovals.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/dashboard/approvals"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Review pending approvals
                </Link>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Team Members
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        5
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/dashboard/calendar"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View team calendar
                </Link>
              </div>
            </div>
          </div>

          {/* On Leave Today */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      On Leave Today
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        1
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/dashboard/request-leave"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Request leave
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Approvals
            </h2>
            <Link
              href="/dashboard/approvals"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending approvals.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingApprovals.slice(0, 5).map((request) => {
                  // Format dates
                  const startDate = new Date(request.startDate).toLocaleDateString();
                  const endDate = new Date(request.endDate).toLocaleDateString();
                  const createdDate = new Date(request.createdAt).toLocaleDateString();

                  return (
                    <li key={request.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              Employee Name
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)} Leave: {startDate} - {endDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Reject
                          </button>
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
    </div>
  );
}
