import { LeaveRequest } from "@/lib/leave/types";

export interface LeaveReports {
  count: number;
}

export interface LeaveStatistics {
  totalEmployees: number;
  onLeaveToday: number;
  pendingApprovals: number;
  leaveReports: LeaveReports;
}

export interface LeaveStatisticsResponse {
  leaveStatistics: LeaveStatistics;
}

export interface PendingApprovalsResponse {
  pendingApprovals: LeaveRequest[];
}

export interface EmployeesOnLeaveTodayResponse {
  employeesOnLeaveToday: LeaveRequest[];
}
