"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GET_PENDING_APPROVALS, GET_TEAM_MEMBERS, GET_TEAM_ON_LEAVE_TODAY } from "@/lib/leave/leaveQueries";
import { APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { 
  PendingApprovalsResponse, 
  TeamMembersResponse, 
  TeamOnLeaveTodayResponse,
  ApproveLeaveRequestResponse,
  RejectLeaveRequestResponse
} from "@/lib/leave/graphqlTypes";
import { AlertCircle, CheckCircle, Clock, Users, XCircle } from "lucide-react";

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
  const { 
    loading: loadingApprovals, 
    error: errorApprovals, 
    data: dataApprovals, 
    refetch 
  } = useQuery<PendingApprovalsResponse>(GET_PENDING_APPROVALS);
  
  // Get team members
  const { 
    loading: loadingTeam, 
    error: errorTeam, 
    data: dataTeam 
  } = useQuery<TeamMembersResponse>(GET_TEAM_MEMBERS, {
    variables: { managerId: user.id }
  });
  
  // Get team members on leave today
  const { 
    loading: loadingOnLeave, 
    error: errorOnLeave, 
    data: dataOnLeave 
  } = useQuery<TeamOnLeaveTodayResponse>(GET_TEAM_ON_LEAVE_TODAY, {
    variables: { managerId: user.id }
  });
  
  // State for modal
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  
  // Mutations for approval/rejection
  const [approveLeaveRequest] = useMutation<ApproveLeaveRequestResponse>(APPROVE_LEAVE_REQUEST, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedRequestId(null);
    }
  });

  const [rejectLeaveRequest] = useMutation<RejectLeaveRequestResponse>(REJECT_LEAVE_REQUEST, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedRequestId(null);
    }
  });
  
  const handleAction = (requestId: string, approving: boolean) => {
    setSelectedRequestId(requestId);
    setIsApproving(approving);
    setIsModalOpen(true);
  };
  
  const handleSubmitDecision = () => {
    if (!selectedRequestId) return;
    
    if (isApproving) {
      approveLeaveRequest({
        variables: {
          id: selectedRequestId,
          comment: comment || undefined
        }
      });
    } else {
      if (!comment.trim()) {
        alert("Please provide a comment for rejection");
        return;
      }
      rejectLeaveRequest({
        variables: {
          id: selectedRequestId,
          comment: comment
        }
      });
    }
  };
  
  const pendingApprovals = dataApprovals?.pendingApprovals || [];
  const teamMembers = dataTeam?.teamMembers || [];
  const onLeaveToday = dataOnLeave?.teamOnLeaveToday || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.firstName}
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
                        {loadingApprovals ? "..." : errorApprovals ? "Error" : pendingApprovals.length}
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
                        {loadingTeam ? "..." : errorTeam ? "Error" : teamMembers.length}
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
                        {loadingOnLeave ? "..." : errorOnLeave ? "Error" : onLeaveToday.length}
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
              className="font-medium text-blue-700 hover:text-blue-900"
            >
              View all approvals
            </Link>
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
                              <span className="text-sm font-medium text-gray-500">
                                {`${request.user.firstName.charAt(0)}${request.user.lastName.charAt(0)}`}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {`${request.user.firstName} ${request.user.lastName}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.leaveType.name} Leave: {startDate} - {endDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction(request.id, true)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(request.id, false)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          </div>
        </div>
      </div>
      
      {/* Comment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isApproving ? "Approve Leave Request" : "Reject Leave Request"}
            </h3>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                {isApproving ? "Comments (optional)" : "Reason for rejection (required)"}
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isApproving ? "Add any comments about this approval" : "Please provide a reason for rejection"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isApproving ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={handleSubmitDecision}
              >
                {isApproving ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
