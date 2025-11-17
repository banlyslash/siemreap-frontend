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

export interface UserLeaveBalancesResponse {
  userLeaveBalances: {
    userId: string;
    year: number;
    balances: LeaveBalance[];
  };
}

export interface LeaveBalancesByEmailResponse {
  leaveBalancesByEmail: {
    userId: string;
    year: number;
    balances: LeaveBalance[];
  };
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

// New mutation responses for role-specific approvals
export interface ManagerApproveLeaveRequestResponse {
  managerApproveLeaveRequest: LeaveRequest;
}

export interface ManagerRejectLeaveRequestResponse {
  managerRejectLeaveRequest: LeaveRequest;
}

export interface HrApproveLeaveRequestResponse {
  hrApproveLeaveRequest: LeaveRequest;
}

export interface HrRejectLeaveRequestResponse {
  hrRejectLeaveRequest: LeaveRequest;
}

// Leave batch creation
export interface CreateLeaveBatchResponse {
  createLeaveBatch: {
    success: boolean;
    message: string;
    leaveRequests: LeaveRequest[];
    numberOfDays: number;
    remainingBalance: number;
  };
}

// Leave balance initialization
export interface InitializeLeaveBalanceResponse {
  initializeLeaveBalance: {
    success: boolean;
    message?: string | null;
    balances?: LeaveBalance[] | null;
  };
}

// Leave history and audit
export interface LeaveHistoryResponse {
  leaveHistory: {
    items: LeaveRequest[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface LeaveAuditEntry {
  id: string;
  leaveRequestId: string;
  action: LeaveAuditAction;
  performedBy: User;
  timestamp: string;
  details?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
}

export type LeaveAuditAction = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'approved_by_manager'
  | 'rejected_by_manager'
  | 'approved_by_hr'
  | 'rejected_by_hr'
  | 'cancelled';

export interface LeaveAuditTrailResponse {
  leaveAuditTrail: LeaveAuditEntry[];
}

// Export leave history
export interface ExportLeaveHistoryResponse {
  exportLeaveHistory: {
    url: string;
    filename: string;
    expiresAt: string;
  };
}

// Statistics
export interface LeaveStatisticsResponse {
  leaveStatistics: {
    pendingApprovals: number;
    totalEmployees: number;
    onLeaveToday: number;
    leaveReports: Array<{
      leaveType: LeaveType;
      count: number;
      percentage: number;
    }>;
  };
}

// HR pending approvals
export interface HrPendingApprovalsResponse {
  hrPendingApprovals: LeaveRequest[];
}

// -----------------------------------------------
// GraphQL queries for src/lib/graphql/queries (API v2)
// -----------------------------------------------

// Auth/user shapes used by src/lib/graphql/queries/auth.ts
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
  role: string;
  departmentId?: string | null;
  managerId?: string | null;
}

export interface CurrentUserResponse {
  currentUser: AuthUser;
}

export interface GetAuthUserResponse {
  user: AuthUser;
}

export interface GetAuthUsersResponse {
  users: AuthUser[];
}

export interface GetManagersResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    departmentId?: string | null;
  }>;
}

// Detailed user response for src/lib/graphql/queries/user.ts GET_USER_QUERY
export interface GetUserDetailedResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    leaveRequests: Array<{
      id: string;
      startDate: string;
      endDate: string;
      status: string;
    }>;
    leaveBalances: Array<{
      id: string;
      leaveType: { id: string; name: string };
      year: number;
      allocated: number;
      used: number;
      remaining: number;
    }>;
  };
}

// Leave queries (src/lib/graphql/queries/leave.ts)
export interface GetLeaveRequestsResponse {
  leaveRequests: Array<{
    id: string;
    user: { id: string; firstName: string; lastName: string };
    leaveType: { id: string; name: string; color?: string | null };
    startDate: string;
    endDate: string;
    halfDay: boolean;
    reason?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface GetLeaveRequestResponse {
  leaveRequest: {
    id: string;
    user: { id: string; firstName: string; lastName: string; email: string };
    leaveType: { id: string; name: string; color?: string | null };
    startDate: string;
    endDate: string;
    halfDay: boolean;
    reason?: string | null;
    status: string;
    manager?: { id: string; firstName: string; lastName: string } | null;
    managerComment?: string | null;
    managerActionAt?: string | null;
    hr?: { id: string; firstName: string; lastName: string } | null;
    hrComment?: string | null;
    hrActionAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetLeaveTypesResponseV2 {
  leaveTypes: Array<{
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    active: boolean;
  }>;
}

export interface GetLeaveBalancesResponseV2 {
  leaveBalances: Array<{
    id: string;
    user: { id: string; firstName: string; lastName: string };
    leaveType: { id: string; name: string };
    year: number;
    allocated: number;
    used: number;
    pending: number;
    remaining: number;
  }>;
}

export interface GetHolidaysResponseV2 {
  holidays: Array<{
    id: string;
    name: string;
    date: string;
    description?: string | null;
    isRecurringYearly?: boolean | null;
  }>;
}

// Departments (src/lib/graphql/queries/department.ts)
export interface GetDepartmentsResponse {
  departments: Array<{
    id: string;
    name: string;
    description?: string | null;
    managerId?: string | null;
  }>;
}

export interface GetDepartmentResponse {
  department: {
    id: string;
    name: string;
    description?: string | null;
    managerId?: string | null;
  };
}
