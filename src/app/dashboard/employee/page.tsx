"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import LeaveBalanceCardWithAPI from "@/components/leave/LeaveBalanceCardWithAPI";
import { useQuery } from "@apollo/client/react";
import { GET_LEAVE_REQUESTS } from "@/lib/leave/leaveQueries";
import { Calendar, CalendarDays, Clock, FileText, Plus } from "lucide-react";
import { LeaveRequestStatus } from "@/lib/leave/types";
import { GetLeaveRequestsResponse } from "@/lib/leave/graphqlTypes";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  const {
    data: leaveRequestsData,
    loading: loadingRequests,
    error: errorRequests,
  } = useQuery<GetLeaveRequestsResponse>(GET_LEAVE_REQUESTS, {
    variables: { userId: user.id },
    skip: !user,
    fetchPolicy: "cache-and-network",
  });

  const recentRequests = useMemo(() => {
    const requests = leaveRequestsData?.leaveRequests ?? [];
    return [...requests]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [leaveRequestsData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                Employee Dashboard
              </p>
            </div>
          </div>
          <Separator className="mt-6" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Leave Balance */}
          <div>
            <LeaveBalanceCardWithAPI />
          </div>

          {/* Recent Requests and Quick Actions */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Recent Requests</CardTitle>
                  <CardDescription>Your latest leave requests</CardDescription>
                </div>
                <Link
                  href="/dashboard/leave-history"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-gray-200">
                  {loadingRequests ? (
                  <div className="p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : errorRequests ? (
                  <div className="p-6 text-center text-red-500">
                    Failed to load leave requests: {errorRequests.message}
                  </div>
                ) : recentRequests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No recent leave requests.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentRequests.map((request) => {
                      const startDate = new Date(request.startDate).toLocaleDateString();
                      const endDate = new Date(request.endDate).toLocaleDateString();
                      const createdDate = new Date(request.createdAt).toLocaleDateString();
                      const statusValue = request.status as LeaveRequestStatus;

                      let statusVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
                      if (
                        statusValue === LeaveRequestStatus.MANAGER_APPROVED ||
                        statusValue === LeaveRequestStatus.HR_APPROVED
                      ) {
                        statusVariant = "default";
                      } else if (
                        statusValue === LeaveRequestStatus.MANAGER_REJECTED ||
                        statusValue === LeaveRequestStatus.HR_REJECTED
                      ) {
                        statusVariant = "destructive";
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
                                  {request.leaveType.name.charAt(0).toUpperCase() + request.leaveType.name.slice(1)} Leave
                                </p>
                                <p className="text-sm text-gray-500">
                                  {startDate} - {endDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant={statusVariant}>
                                {statusValue.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Badge>
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
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your leave requests</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-gray-200">
                  <div className="divide-y divide-gray-200">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
