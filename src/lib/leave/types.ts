import { User } from "../auth/types";

export type LeaveStatus = 'pending' | 'approved_by_manager' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid' | 'other';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  halfDayStart?: boolean;
  halfDayEnd?: boolean;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  managerApproval?: {
    approverId: string;
    timestamp: string; // ISO date string
    comments?: string;
  };
  hrApproval?: {
    approverId: string;
    timestamp: string; // ISO date string
    comments?: string;
  };
  attachmentUrl?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LeaveBalance {
  userId: string;
  year: number;
  balances: {
    [key in LeaveType]?: {
      entitled: number;
      used: number;
      pending: number;
      remaining: number;
    };
  };
}

export interface LeaveRequestFormData {
  startDate: Date;
  endDate: Date;
  halfDayStart: boolean;
  halfDayEnd: boolean;
  leaveType: LeaveType;
  reason: string;
  attachment?: File;
}

export interface LeaveApprovalData {
  requestId: string;
  approved: boolean;
  comments?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  description?: string;
  isRecurringYearly?: boolean;
}
