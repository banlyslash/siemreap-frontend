"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { useAuth } from "@/lib/auth/AuthContext";
import { LeaveRequestStatus } from "@/lib/leave/types";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

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
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format datetime helper
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
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

export default function LeaveRequestDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (user && user.role !== "manager" && user.role !== "hr") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { loading, error, data, refetch } = useQuery(GET_LEAVE_REQUEST, {
    variables: { id: requestId },
    skip: !requestId,
  });

  // Mutations for approval/rejection
  const [approveLeaveRequest, { loading: approveLoading }] = useMutation(APPROVE_LEAVE_REQUEST, {
    onCompleted: () => {
      refetch();
    }
  });

  const [rejectLeaveRequest, { loading: rejectLoading }] = useMutation(REJECT_LEAVE_REQUEST, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleSubmitDecision = (comment: string, approved: boolean) => {
    if (!requestId) return;

    if (approved) {
      approveLeaveRequest({
        variables: {
          id: requestId,
          comment: comment || undefined
        }
      });
    } else {
      rejectLeaveRequest({
        variables: {
          id: requestId,
          comment: comment
        }
      });
    }

    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view this page</p>
          <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-lg">
          Error loading leave request: {error.message}
        </div>
      </div>
    );
  }

  const leaveRequest = data?.leaveRequest;
  if (!leaveRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Leave request not found</p>
          <Link href="/dashboard/approvals" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Approvals
          </Link>
        </div>
      </div>
    );
  }

  const canApprove = (user.role === "manager" && leaveRequest.status === LeaveRequestStatus.PENDING) ||
    (user.role === "hr" && leaveRequest.status === LeaveRequestStatus.MANAGER_APPROVED);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDecision}
        title={`${user.role === "manager" ? "Manager" : "HR"} Approval Decision`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard/approvals"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Approvals
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Leave Request Details</h1>
          </div>
          <StatusBadge status={leaveRequest.status} />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Request Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and status of the leave request
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Employee</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${leaveRequest.user.firstName} ${leaveRequest.user.lastName}`}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {leaveRequest.user.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Leave Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${leaveRequest.leaveType.color}20`, // 20% opacity
                      color: leaveRequest.leaveType.color 
                    }}
                  >
                    {leaveRequest.leaveType.name}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Leave Period</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(leaveRequest.startDate)} - {formatDate(leaveRequest.endDate)}
                  {leaveRequest.halfDay && <span className="text-xs text-gray-500 block">Half day</span>}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Reason</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {leaveRequest.reason || "No reason provided"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDateTime(leaveRequest.createdAt)}
                </dd>
              </div>
              
              {leaveRequest.manager && (
                <>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Manager Decision</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        <StatusBadge status={
                          leaveRequest.status === LeaveRequestStatus.MANAGER_REJECTED 
                            ? LeaveRequestStatus.MANAGER_REJECTED 
                            : LeaveRequestStatus.MANAGER_APPROVED
                        } />
                        <span className="ml-2">
                          by {`${leaveRequest.manager.firstName} ${leaveRequest.manager.lastName}`}
                        </span>
                      </div>
                      {leaveRequest.managerComment && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {leaveRequest.managerComment}
                        </div>
                      )}
                      {leaveRequest.managerActionAt && (
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDateTime(leaveRequest.managerActionAt)}
                        </div>
                      )}
                    </dd>
                  </div>
                </>
              )}
              
              {leaveRequest.hr && (
                <>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">HR Decision</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        <StatusBadge status={
                          leaveRequest.status === LeaveRequestStatus.HR_REJECTED 
                            ? LeaveRequestStatus.HR_REJECTED 
                            : LeaveRequestStatus.HR_APPROVED
                        } />
                        <span className="ml-2">
                          by {`${leaveRequest.hr.firstName} ${leaveRequest.hr.lastName}`}
                        </span>
                      </div>
                      {leaveRequest.hrComment && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {leaveRequest.hrComment}
                        </div>
                      )}
                      {leaveRequest.hrActionAt && (
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDateTime(leaveRequest.hrActionAt)}
                        </div>
                      )}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
          
          {canApprove && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  disabled={approveLoading || rejectLoading}
                >
                  Make Decision
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
