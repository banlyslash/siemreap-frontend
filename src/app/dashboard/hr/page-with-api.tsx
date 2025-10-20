"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GET_PENDING_APPROVALS, PROCESS_APPROVAL } from "@/lib/leave/leaveQueries";
import { AlertCircle, Calendar, CheckCircle, Clock, PieChart, Users, CalendarDays, Building } from "lucide-react";
import { PendingApprovalsResponse, ProcessApprovalResponse } from "@/lib/leave/graphqlTypes";

export default function HRDashboardPage() {
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

  // Fetch HR pending approvals
  const { data, loading: loadingApprovals, error, refetch } = useQuery<PendingApprovalsResponse>(GET_PENDING_APPROVALS, {
    skip: !user || user.role !== "hr",
    fetchPolicy: "cache-and-network"
  });

  // Process HR approval mutation
  const [processApproval, { loading: processingApproval }] = useMutation<ProcessApprovalResponse>(PROCESS_APPROVAL, {
    onCompleted: () => {
      refetch();
    }
  });

  // Handle approve/reject
  const handleApproval = async (requestId: string, approved: boolean, comments: string = "") => {
    if (!user) return;
    
    try {
      await processApproval({
        variables: {
          input: {
            requestId,
            approverId: user.id,
            approved,
            comments
          }
        }
      });
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

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

  // Get pending approvals from query data
  const pendingApprovals = data?.pendingApprovals || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.firstName} {user.lastName}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                        {loadingApprovals ? "..." : pendingApprovals.length}
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
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Employees */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Employees
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        10
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/dashboard/employees"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Manage employees
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
                        2
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
                  View calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Leave Reports */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PieChart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Leave Reports
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
                  href="/dashboard/reports"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
              {loadingApprovals ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No pending approvals.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {pendingApprovals.slice(0, 3).map((request) => {
                    // Format dates
                    const startDate = new Date(request.startDate).toLocaleDateString();
                    const endDate = new Date(request.endDate).toLocaleDateString();

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
                                {request.user.firstName} {request.user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {request.leaveType.name.charAt(0).toUpperCase() + request.leaveType.name.slice(1)} Leave: {startDate} - {endDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproval(request.id, true)}
                              disabled={processingApproval}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              onClick={() => handleApproval(request.id, false)}
                              disabled={processingApproval}
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

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                <Link
                  href="/dashboard/approvals"
                  className="p-6 flex items-center hover:bg-gray-50"
                >
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Pending Approvals
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Review and process leave requests
                    </p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/employees"
                  className="p-6 flex items-center hover:bg-gray-50"
                >
                  <div className="bg-green-100 rounded-lg p-3 mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Manage Employees
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add or update employee records
                    </p>
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
                <Link
                  href="/dashboard/holidays"
                  className="p-6 flex items-center hover:bg-gray-50"
                >
                  <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                    <CalendarDays className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Holiday Management
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure company holidays
                    </p>
                  </div>
                </Link>
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
                      View organization-wide leave
                    </p>
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
                <Link
                  href="/dashboard/reports"
                  className="p-6 flex items-center hover:bg-gray-50"
                >
                  <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                    <PieChart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Leave Reports
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate leave usage reports
                    </p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/departments"
                  className="p-6 flex items-center hover:bg-gray-50"
                >
                  <div className="bg-orange-100 rounded-lg p-3 mr-4">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Department Management
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage departments and structure
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
