"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_PENDING_APPROVALS,
  GET_TEAM_MEMBERS,
  GET_TEAM_ON_LEAVE_TODAY,
  APPROVE_LEAVE_REQUEST,
  REJECT_LEAVE_REQUEST,
} from "@/lib/leave/leaveQueries";
import { Clock, Users, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  PendingApprovalsResponse, 
  TeamMembersResponse, 
  TeamOnLeaveTodayResponse,
  ApproveLeaveRequestResponse,
  RejectLeaveRequestResponse
} from "@/lib/leave/graphqlTypes";

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
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manager Dashboard
              </p>
            </div>
          </div>
          <Separator className="mt-6" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Pending Approvals */}
          <Card>
            <CardContent className="pt-6">
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
            </CardContent>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="text-sm">
                <Link
                  href="/dashboard/approvals"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Review pending approvals
                </Link>
              </div>
            </div>
          </Card>

          {/* Team Members */}
          <Card>
            <CardContent className="pt-6">
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
            </CardContent>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="text-sm">
                <Link
                  href="/dashboard/calendar"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View team calendar
                </Link>
              </div>
            </div>
          </Card>

          {/* On Leave Today */}
          <Card>
            <CardContent className="pt-6">
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
            </CardContent>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="text-sm">
                <Link
                  href="/dashboard/request-leave"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Request leave
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve leave requests</CardDescription>
            </div>
            <Link
              href="/dashboard/approvals"
              className="font-medium text-blue-700 hover:text-blue-900"
            >
              View all approvals
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-gray-200">
            {loadingApprovals ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : errorApprovals ? (
              <div className="p-6 text-center text-red-500">
                Failed to load approvals: {errorApprovals.message}
              </div>
            ) : pendingApprovals.length === 0 ? (
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
                            <Badge variant="secondary">
                              {request.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleAction(request.id, true)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleAction(request.id, false)}
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
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
      </div>
      
      {/* Comment Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isApproving ? "Approve Leave Request" : "Reject Leave Request"}
            </DialogTitle>
            <DialogDescription>
              {isApproving 
                ? "Add any comments about this approval (optional)." 
                : "Please provide a reason for rejection (required)."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comment">
                {isApproving ? "Comments" : "Reason"}
              </Label>
              <Textarea
                id="comment"
                rows={4}
                placeholder={isApproving ? "Add any comments about this approval" : "Please provide a reason for rejection"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className={isApproving ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={isApproving ? 'default' : 'destructive'}
              onClick={handleSubmitDecision}
            >
              {isApproving ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
