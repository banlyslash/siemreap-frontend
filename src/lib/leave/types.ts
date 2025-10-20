import { User } from "../auth/types";

// Enums
export enum LeaveRequestStatus {
  PENDING = "pending",
  MANAGER_APPROVED = "manager_approved",
  MANAGER_REJECTED = "manager_rejected", 
  HR_APPROVED = "hr_approved",
  HR_REJECTED = "hr_rejected",
  CANCELLED = "cancelled"
}

export enum UserRole {
  HR = "hr",
  MANAGER = "manager",
  EMPLOYEE = "employee"
}

// Core types
export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  color: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  user: User;
  leaveType: LeaveType;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  halfDay: boolean;
  reason?: string;
  status: LeaveRequestStatus;
  manager?: User;
  managerComment?: string;
  managerActionAt?: string;
  hr?: User;
  hrComment?: string;
  hrActionAt?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LeaveBalance {
  id: string;
  user: User;
  leaveType: LeaveType;
  year: number;
  allocated: number;
  used: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Input types
export interface CreateLeaveRequestInput {
  userId: string;
  leaveTypeId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  halfDay?: boolean;
  reason?: string;
}

export interface UpdateLeaveRequestInput {
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  halfDay?: boolean;
  reason?: string;
  status?: LeaveRequestStatus;
  managerId?: string;
  managerComment?: string;
  managerActionAt?: string;
  hrId?: string;
  hrComment?: string;
  hrActionAt?: string;
}

export interface UpdateLeaveBalanceInput {
  allocated?: number;
  used?: number;
}

export interface CreateLeaveTypeInput {
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
}

export interface UpdateLeaveTypeInput {
  name?: string;
  description?: string;
  color?: string;
  active?: boolean;
}

export interface CreateHolidayInput {
  name: string;
  date: string;
  description?: string;
}

export interface UpdateHolidayInput {
  name?: string;
  date?: string;
  description?: string;
}
