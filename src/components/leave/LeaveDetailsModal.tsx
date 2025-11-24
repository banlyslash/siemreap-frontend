"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST, CANCEL_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LeaveRequestStatus } from "@/lib/leave/types";

// Define a type for the leave request object passed to the modal
// This should match what the calendar query returns
export interface CalendarLeaveRequest {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  leaveType: {
    id: string;
    name: string;
    color: string;
  };
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason: string;
  status: LeaveRequestStatus;
  manager?: {
    firstName: string;
    lastName: string;
  };
  hr?: {
    firstName: string;
    lastName: string;
  };
}

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leaveRequest: CalendarLeaveRequest | null;
}

export default function LeaveDetailsModal({
  isOpen,
  onClose,
  onSuccess,
  leaveRequest,
}: LeaveDetailsModalProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine mutations based on role or generic mutations
  // For now, I'll use the generic ones which handle role logic internally in the resolver
  // except for specific role actions if needed, but the resolver generic ones (APPROVE_LEAVE_REQUEST) are robust.
  const [approveLeave] = useMutation(APPROVE_LEAVE_REQUEST);
  const [rejectLeave] = useMutation(REJECT_LEAVE_REQUEST);
  const [cancelLeave] = useMutation(CANCEL_LEAVE_REQUEST);

  if (!leaveRequest) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAction = async (actionType: "approve" | "reject" | "cancel") => {
    if (actionType === "reject" && !comment.trim()) {
      setError("Comment is required for rejection");
      return;
    }

    setError(null);
    
    try {
      if (actionType === "approve") {
        await approveLeave({
          variables: { id: leaveRequest.id, comment },
        });
      } else if (actionType === "reject") {
        await rejectLeave({
          variables: { id: leaveRequest.id, comment },
        });
      } else if (actionType === "cancel") {
        await cancelLeave({
          variables: { id: leaveRequest.id },
        });
      }
      onSuccess();
      onClose();
      setComment("");
      setAction(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed";
      setError(message);
    }
  };

  // Permissions Logic
  const isOwner = user?.id === leaveRequest.user.id;
  const isManager = user?.role === "manager";
  const isHr = user?.role === "hr";
  
  const canApproveReject = 
    (isManager && leaveRequest.status === LeaveRequestStatus.PENDING) ||
    (isHr && leaveRequest.status === LeaveRequestStatus.MANAGER_APPROVED);
    
  const canCancel = 
    isOwner && 
    (leaveRequest.status === LeaveRequestStatus.PENDING || leaveRequest.status === LeaveRequestStatus.MANAGER_APPROVED);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave Details</DialogTitle>
          <DialogDescription>
            View details and manage this leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Employee</h4>
              <p className="text-base font-medium">
                {leaveRequest.user.firstName} {leaveRequest.user.lastName}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <Badge variant="outline" className="capitalize mt-1">
                {leaveRequest.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Leave Type</h4>
              <div className="flex items-center mt-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: leaveRequest.leaveType.color }}
                />
                <span>{leaveRequest.leaveType.name}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Duration</h4>
              <p>
                {formatDate(leaveRequest.startDate)} - {formatDate(leaveRequest.endDate)}
                {leaveRequest.halfDay && " (Half Day)"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Reason</h4>
            <p className="bg-gray-50 p-3 rounded-md text-sm mt-1">
              {leaveRequest.reason}
            </p>
          </div>

          {/* Action Section */}
          {(canApproveReject || canCancel) && !action && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              {canCancel && (
                <Button 
                  variant="destructive" 
                  onClick={() => setAction("cancel")}
                >
                  Cancel Request
                </Button>
              )}
              {canApproveReject && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setAction("reject")}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setAction("approve")}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Confirmation Section */}
          {action && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">
                {action === "approve" && "Approve Request"}
                {action === "reject" && "Reject Request"}
                {action === "cancel" && "Cancel Request"}
              </h4>
              
              {(action === "approve" || action === "reject") && (
                <div>
                  <Label htmlFor="comment">
                    Comment {action === "reject" && <span className="text-red-500">*</span>}
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={action === "reject" ? "Reason for rejection..." : "Optional comment..."}
                    className="mt-1"
                  />
                </div>
              )}

              {action === "cancel" && (
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel this leave request? This action cannot be undone.
                </p>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => { setAction(null); setComment(""); setError(null); }}>
                  Back
                </Button>
                <Button 
                  variant={action === "reject" || action === "cancel" ? "destructive" : "default"}
                  onClick={() => handleAction(action)}
                  className={action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
