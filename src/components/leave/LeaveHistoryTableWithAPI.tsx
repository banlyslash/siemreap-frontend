"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { LeaveRequest, LeaveStatus, LeaveType } from "@/lib/leave/types";
import { GET_LEAVE_REQUESTS } from "@/lib/leave/leaveQueries";
import { LeaveRequestsResponse } from "@/lib/leave/graphqlTypes";
import { useAuth } from "@/lib/auth/AuthContext";

// Status badge component
const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved_by_manager":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved_by_manager":
        return "Manager Approved";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
};

// Leave type badge component
const LeaveTypeBadge = ({ type }: { type: LeaveType }) => {
  const getTypeColor = () => {
    switch (type) {
      case "annual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      case "other":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = () => {
    switch (type) {
      case "annual":
        return "Annual";
      case "sick":
        return "Sick";
      case "personal":
        return "Personal";
      case "unpaid":
        return "Unpaid";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}
    >
      {getTypeText()}
    </span>
  );
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function LeaveHistoryTable() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<LeaveStatus | "all">("all");
  
  if (!user) {
    return <div>Please log in to view your leave history.</div>;
  }

  // Fetch leave requests for the current user
  const { loading, error, data } = useQuery<LeaveRequestsResponse>(GET_LEAVE_REQUESTS, {
    variables: { employeeId: user.id },
    fetchPolicy: "cache-and-network"
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Error</p>
        <p>Failed to load leave history: {error.message}</p>
      </div>
    );
  }

  const leaveRequests = data?.leaveRequests || [];

  // Filter leave requests based on selected filter
  const filteredRequests = filter === "all" 
    ? leaveRequests 
    : leaveRequests.filter((request: LeaveRequest) => request.status === filter);

  // Sort leave requests by date (newest first)
  const sortedRequests = [...filteredRequests].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
          Leave History
        </h2>
        <div className="flex space-x-3">
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as LeaveStatus | "all")}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved_by_manager">Manager Approved</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Link
            href="/dashboard/request-leave"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Request Leave
          </Link>
        </div>
      </div>

      {sortedRequests.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          No leave requests found.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Requested
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Leave Period
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRequests.map((request: LeaveRequest) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      {(request.halfDayStart || request.halfDayEnd) && (
                        <span className="text-xs text-gray-400 block">
                          {request.halfDayStart && "½ day start"}
                          {request.halfDayStart && request.halfDayEnd && ", "}
                          {request.halfDayEnd && "½ day end"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LeaveTypeBadge type={request.leaveType.name} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
