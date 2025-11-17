"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { PendingApprovalsResponse } from "@/lib/leave/graphqlTypes";
import { 
  GET_PENDING_APPROVALS, 
  GET_LEAVE_REQUEST
} from "@/lib/leave/leaveQueries";
import {
  APPROVE_LEAVE_REQUEST,
  REJECT_LEAVE_REQUEST
} from "@/lib/leave/leaveQueries";
import { LeaveRequestStatus } from "@/lib/leave/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { CheckCircle, XCircle, Eye } from "lucide-react";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case LeaveRequestStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case LeaveRequestStatus.MANAGER_APPROVED:
        return "bg-blue-100 text-blue-800";
      case LeaveRequestStatus.HR_APPROVED:
        return "bg-green-100 text-green-800";
      case LeaveRequestStatus.MANAGER_REJECTED:
      case LeaveRequestStatus.HR_REJECTED:
        return "bg-red-100 text-red-800";
      case LeaveRequestStatus.CANCELLED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case LeaveRequestStatus.PENDING:
        return "Pending";
      case LeaveRequestStatus.MANAGER_APPROVED:
        return "Manager Approved";
      case LeaveRequestStatus.HR_APPROVED:
        return "Approved";
      case LeaveRequestStatus.MANAGER_REJECTED:
        return "Manager Rejected";
      case LeaveRequestStatus.HR_REJECTED:
        return "HR Rejected";
      case LeaveRequestStatus.CANCELLED:
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
const LeaveTypeBadge = ({ type, color }: { type: string; color: string }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${color}20`, // 20% opacity
        color: color 
      }}
    >
      {type}
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

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string, approved: boolean) => void;
  title: string;
}

const CommentModal = ({ isOpen, onClose, onSubmit, title }: CommentModalProps) => {
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comments (optional for approval, required for rejection)
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any comments about this decision"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            onClick={() => {
              if (!comment.trim()) {
                alert("Please provide a comment for rejection");
                return;
              }
              onSubmit(comment, false);
              setComment("");
            }}
          >
            Reject
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            onClick={() => {
              onSubmit(comment, true);
              setComment("");
            }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LeaveApprovalTableWithAPI() {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
  
  if (!user) {
    return <div>Please log in to view leave approvals.</div>;
  }

  // Get leave requests based on user role
  // Both manager and HR use GET_PENDING_APPROVALS for consistency
  const { loading, error, data, refetch } = useQuery<PendingApprovalsResponse>(
    GET_PENDING_APPROVALS
  );

  // Mutations for approval/rejection
  const [approveLeaveRequest, { loading: approveLoading }] = useMutation(APPROVE_LEAVE_REQUEST);

  const [rejectLeaveRequest, { loading: rejectLoading }] = useMutation(REJECT_LEAVE_REQUEST);

  // Handle single approval or rejection
  const handleAction = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleSubmitDecision = async (comment: string, approved: boolean) => {
    if (!selectedRequestId) return;

    try {
      if (approved) {
        await approveLeaveRequest({
          variables: {
            id: selectedRequestId,
            comment: comment || undefined
          }
        });
      } else {
        await rejectLeaveRequest({
          variables: {
            id: selectedRequestId,
            comment: comment
          }
        });
      }
      
      // Refetch after single action completes
      await refetch();
    } catch (error) {
      console.error("Error processing request:", error);
    }

    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  // Handle bulk selection
  const toggleSelectRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  const toggleSelectAll = (requests: any[]) => {
    if (selectedRequests.size === requests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(requests.map(r => r.id)));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedRequests.size === 0) return;
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const handleBulkSubmit = async (comment: string, approved: boolean) => {
    const requestIds = Array.from(selectedRequests);
    
    try {
      // Process all requests in parallel to avoid flashing
      const promises = requestIds.map(id => {
        if (approved) {
          return approveLeaveRequest({
            variables: {
              id,
              comment: comment || undefined
            }
          });
        } else {
          return rejectLeaveRequest({
            variables: {
              id,
              comment: comment
            }
          });
        }
      });

      // Wait for all mutations to complete
      await Promise.all(promises);
      
      // Only refetch once after all mutations are done
      await refetch();
    } catch (error) {
      console.error("Error processing bulk action:", error);
    }

    setIsBulkModalOpen(false);
    setBulkAction(null);
    setSelectedRequests(new Set());
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading leave requests: {error.message}
      </div>
    );
  }

  // Get all pending approvals
  const leaveRequests = data?.pendingApprovals || [];

  return (
    <div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDecision}
        title={`${user.role === "manager" ? "Manager" : "HR"} Approval Decision`}
      />

      <CommentModal
        isOpen={isBulkModalOpen}
        onClose={() => {
          setIsBulkModalOpen(false);
          setBulkAction(null);
        }}
        onSubmit={handleBulkSubmit}
        title={`Bulk ${bulkAction === 'approve' ? 'Approve' : 'Reject'} (${selectedRequests.size} requests)`}
      />

      <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {user.role === "manager" ? "Manager Approvals" : "HR Approvals"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and process leave requests
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedRequests.size > 0 && user.role === "manager" && (
            <>
              <button
                onClick={() => handleBulkAction('approve')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve ({selectedRequests.size})
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject ({selectedRequests.size})
              </button>
            </>
          )}
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View Calendar
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {leaveRequests.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          No pending leave requests to approve.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {user.role === "manager" && (
                    <th scope="col" className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRequests.size === leaveRequests.length && leaveRequests.length > 0}
                        onChange={() => toggleSelectAll(leaveRequests)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                  )}
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request: any) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    {user.role === "manager" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRequests.has(request.id)}
                          onChange={() => toggleSelectRequest(request.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">
                            {`${request.user.firstName.charAt(0)}${request.user.lastName.charAt(0)}`}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {`${request.user.firstName} ${request.user.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      {request.halfDay && (
                        <span className="text-xs text-gray-400 block">
                          Half day
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LeaveTypeBadge 
                        type={request.leaveType.name} 
                        color={request.leaveType.color} 
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {request.reason || "No reason provided"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/leave-request/${request.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        {(user.role === "manager" || request.status === "manager_approved") && (
                          <>
                            <button
                              onClick={() => handleAction(request.id)}
                              className="text-green-600 hover:text-green-900"
                              disabled={approveLoading || rejectLoading}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleAction(request.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={approveLoading || rejectLoading}
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
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
