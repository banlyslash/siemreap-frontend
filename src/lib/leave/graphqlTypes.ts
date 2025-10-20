import { 
  LeaveRequest, 
  LeaveBalance, 
  LeaveType, 
  Holiday,
  UserRole
} from "./types";

// User type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Auth response
export interface AuthPayload {
  token: string;
  user: User;
}

// Login response
export interface LoginResponse {
  login: AuthPayload;
}

// User queries
export interface MeResponse {
  me: User;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface TeamMembersResponse {
  teamMembers: User[];
}

export interface TeamOnLeaveTodayResponse {
  teamOnLeaveToday: LeaveRequest[];
}

// Leave type queries
export interface LeaveTypesResponse {
  leaveTypes: LeaveType[];
}

export interface LeaveTypeResponse {
  leaveType: LeaveType;
}

// Leave request queries
export interface LeaveRequestsResponse {
  leaveRequests: LeaveRequest[];
}

export interface LeaveRequestResponse {
  leaveRequest: LeaveRequest;
}

export interface PendingApprovalsResponse {
  pendingApprovals: LeaveRequest[];
}

export interface ManagerApprovedRequestsResponse {
  managerApprovedRequests: LeaveRequest[];
}

// Leave balance queries
export interface LeaveBalancesResponse {
  leaveBalances: LeaveBalance[];
}

export interface LeaveBalanceResponse {
  leaveBalance: LeaveBalance;
}

// Holiday queries
export interface HolidaysResponse {
  holidays: Holiday[];
}

export interface HolidayResponse {
  holiday: Holiday;
}

// Mutation responses
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

export interface CreateLeaveTypeResponse {
  createLeaveType: LeaveType;
}

export interface UpdateLeaveTypeResponse {
  updateLeaveType: LeaveType;
}

export interface UpdateLeaveBalanceResponse {
  updateLeaveBalance: LeaveBalance;
}

export interface CreateHolidayResponse {
  createHoliday: Holiday;
}

export interface UpdateHolidayResponse {
  updateHoliday: Holiday;
}

export interface DeleteHolidayResponse {
  deleteHoliday: boolean;
}
