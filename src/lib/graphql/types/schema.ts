// GraphQL schema types for TypeScript based on server schema
export type Maybe<T> = T | null;

// User types
export type UserRole = 'ADMIN' | 'MANAGER' | 'HR' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  leaveRequests: LeaveRequest[];
  managedRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
}

export interface Department {
  id: string;
  name: string;
  description?: Maybe<string>;
  managerId?: Maybe<string>;
}

// Leave types
export type LeaveRequestStatus = 'PENDING' | 'MANAGER_APPROVED' | 'MANAGER_REJECTED' | 'HR_APPROVED' | 'HR_REJECTED' | 'CANCELLED';

export interface LeaveType {
  id: string;
  name: string;
  description?: Maybe<string>;
  color?: Maybe<string>;
  active: boolean;
}

export interface LeaveRequest {
  id: string;
  user: User;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason?: Maybe<string>;
  status: LeaveRequestStatus;
  manager?: Maybe<User>;
  managerComment?: Maybe<string>;
  managerActionAt?: Maybe<string>;
  hr?: Maybe<User>;
  hrComment?: Maybe<string>;
  hrActionAt?: Maybe<string>;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  user: User;
  leaveType: LeaveType;
  year: number;
  entitled: number;
  taken: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: Maybe<string>;
  isRecurringYearly?: Maybe<boolean>;
}

// Authentication types
export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserInput {
  email?: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  role?: Maybe<UserRole>;
  password?: Maybe<string>;
}

// Leave request types
export interface CreateLeaveRequestInput {
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  halfDay?: Maybe<boolean>;
  reason?: Maybe<string>;
}

export interface UpdateLeaveRequestInput {
  leaveTypeId?: Maybe<string>;
  startDate?: Maybe<string>;
  endDate?: Maybe<string>;
  halfDay?: Maybe<boolean>;
  reason?: Maybe<string>;
}

export interface CreateLeaveTypeInput {
  name: string;
  description?: Maybe<string>;
  color?: Maybe<string>;
  active?: Maybe<boolean>;
}

export interface UpdateLeaveTypeInput {
  name?: Maybe<string>;
  description?: Maybe<string>;
  color?: Maybe<string>;
  active?: Maybe<boolean>;
}

export interface UpdateLeaveBalanceInput {
  entitled?: Maybe<number>;
  taken?: Maybe<number>;
}

export interface CreateHolidayInput {
  name: string;
  date: string;
  description?: Maybe<string>;
  isRecurringYearly?: Maybe<boolean>;
}

export interface UpdateHolidayInput {
  name?: Maybe<string>;
  date?: Maybe<string>;
  description?: Maybe<string>;
  isRecurringYearly?: Maybe<boolean>;
}
