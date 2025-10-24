import { LeaveRequest, LeaveBalance, LeaveType } from "./schema";

// Leave request mutation responses
export interface CreateLeaveRequestResponse {
  createLeaveRequest: LeaveRequest;
}

export interface UpdateLeaveRequestResponse {
  updateLeaveRequest: LeaveRequest;
}

export interface ApproveLeaveRequestResponse {
  approveLeaveRequest: LeaveRequest;
}

export interface RejectLeaveRequestResponse {
  rejectLeaveRequest: LeaveRequest;
}

export interface CancelLeaveRequestResponse {
  cancelLeaveRequest: LeaveRequest;
}

// Leave type mutation responses
export interface CreateLeaveTypeResponse {
  createLeaveType: LeaveType;
}

export interface UpdateLeaveTypeResponse {
  updateLeaveType: LeaveType;
}

// Leave balance mutation responses
export interface UpdateLeaveBalanceResponse {
  updateLeaveBalance: LeaveBalance;
}

export interface InitializeLeaveBalanceResponse {
  initializeLeaveBalance: {
    success: boolean;
    message: string;
    balances: Array<{
      id: string;
      leaveType: {
        id: string;
        name: string;
        color: string;
      };
      allocated: number;
      used: number;
      remaining: number;
      year: number;
    }>;
  };
}
