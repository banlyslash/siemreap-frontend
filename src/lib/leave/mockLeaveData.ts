import { LeaveRequest, LeaveBalance, LeaveType, LeaveStatus, Holiday } from "./types";
import { mockUsers } from "../auth/mockUsers";
import { Department } from "../auth/types";

// Mock departments
export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Engineering"
  },
  {
    id: "dept-2",
    name: "Marketing"
  },
  {
    id: "dept-3",
    name: "Human Resources"
  },
  {
    id: "dept-4",
    name: "Finance"
  }
];

// Mock holidays
export const mockHolidays: Holiday[] = [
  {
    id: "holiday-1",
    name: "New Year's Day",
    date: "2025-01-01",
    isRecurringYearly: true
  },
  {
    id: "holiday-2",
    name: "Labor Day",
    date: "2025-05-01",
    isRecurringYearly: true
  },
  {
    id: "holiday-3",
    name: "Independence Day",
    date: "2025-07-04",
    isRecurringYearly: true
  },
  {
    id: "holiday-4",
    name: "Christmas Day",
    date: "2025-12-25",
    isRecurringYearly: true
  }
];

// Mock leave requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "user-1", // John Employee
    startDate: "2025-03-15",
    endDate: "2025-03-20",
    leaveType: "annual",
    reason: "Family vacation",
    status: "approved",
    managerApproval: {
      approverId: "user-2", // Mary Manager
      timestamp: "2025-03-01T10:30:00Z",
      comments: "Approved. Enjoy your vacation!"
    },
    hrApproval: {
      approverId: "user-3", // HR Admin
      timestamp: "2025-03-02T14:15:00Z",
      comments: "Confirmed"
    },
    createdAt: "2025-02-28T09:00:00Z",
    updatedAt: "2025-03-02T14:15:00Z"
  },
  {
    id: "leave-2",
    employeeId: "user-1", // John Employee
    startDate: "2025-05-10",
    endDate: "2025-05-10",
    leaveType: "personal",
    reason: "Doctor's appointment",
    status: "pending",
    createdAt: "2025-05-03T11:20:00Z",
    updatedAt: "2025-05-03T11:20:00Z"
  },
  {
    id: "leave-3",
    employeeId: "user-2", // Mary Manager
    startDate: "2025-04-05",
    endDate: "2025-04-07",
    leaveType: "sick",
    reason: "Not feeling well",
    status: "approved",
    hrApproval: {
      approverId: "user-3", // HR Admin
      timestamp: "2025-04-05T09:45:00Z",
      comments: "Get well soon"
    },
    createdAt: "2025-04-05T08:30:00Z",
    updatedAt: "2025-04-05T09:45:00Z"
  }
];

// Mock leave balances
export const mockLeaveBalances: LeaveBalance[] = [
  {
    userId: "user-1", // John Employee
    year: 2025,
    balances: {
      annual: {
        entitled: 20,
        used: 5,
        pending: 1,
        remaining: 14
      },
      sick: {
        entitled: 10,
        used: 0,
        pending: 0,
        remaining: 10
      },
      personal: {
        entitled: 3,
        used: 0,
        pending: 1,
        remaining: 2
      }
    }
  },
  {
    userId: "user-2", // Mary Manager
    year: 2025,
    balances: {
      annual: {
        entitled: 25,
        used: 0,
        pending: 0,
        remaining: 25
      },
      sick: {
        entitled: 15,
        used: 3,
        pending: 0,
        remaining: 12
      },
      personal: {
        entitled: 5,
        used: 0,
        pending: 0,
        remaining: 5
      }
    }
  }
];

// Helper functions for leave management

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = (employeeId: string): LeaveRequest[] => {
  return mockLeaveRequests.filter(request => request.employeeId === employeeId);
};

// Get leave requests for a manager to approve
export const getManagerPendingApprovals = (managerId: string): LeaveRequest[] => {
  // Find employees under this manager
  const employeeIds = mockUsers
    .filter(user => user.managerId === managerId)
    .map(user => user.id);
  
  // Find pending leave requests for these employees
  return mockLeaveRequests.filter(
    request => employeeIds.includes(request.employeeId) && request.status === 'pending'
  );
};

// Get leave requests for HR to approve
export const getHRPendingApprovals = (): LeaveRequest[] => {
  return mockLeaveRequests.filter(
    request => request.status === 'approved_by_manager'
  );
};

// Get leave balance for an employee
export const getEmployeeLeaveBalance = (employeeId: string, year: number = new Date().getFullYear()): LeaveBalance | undefined => {
  return mockLeaveBalances.find(
    balance => balance.userId === employeeId && balance.year === year
  );
};

// Create a new leave request
export const createLeaveRequest = (
  employeeId: string,
  startDate: string,
  endDate: string,
  leaveType: LeaveType,
  reason: string,
  halfDayStart: boolean = false,
  halfDayEnd: boolean = false
): LeaveRequest => {
  const newRequest: LeaveRequest = {
    id: `leave-${mockLeaveRequests.length + 1}`,
    employeeId,
    startDate,
    endDate,
    halfDayStart,
    halfDayEnd,
    leaveType,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveRequests.push(newRequest);
  
  // Update leave balance
  const balance = mockLeaveBalances.find(b => b.userId === employeeId);
  if (balance && balance.balances[leaveType]) {
    balance.balances[leaveType]!.pending += calculateLeaveDays(startDate, endDate, halfDayStart, halfDayEnd);
    balance.balances[leaveType]!.remaining -= calculateLeaveDays(startDate, endDate, halfDayStart, halfDayEnd);
  }
  
  return newRequest;
};

// Approve or reject a leave request by manager
export const processManagerApproval = (
  requestId: string,
  managerId: string,
  approved: boolean,
  comments?: string
): LeaveRequest | null => {
  const requestIndex = mockLeaveRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) return null;
  
  const request = mockLeaveRequests[requestIndex];
  
  // Update request
  if (approved) {
    request.status = 'approved_by_manager';
    request.managerApproval = {
      approverId: managerId,
      timestamp: new Date().toISOString(),
      comments
    };
  } else {
    request.status = 'rejected';
    request.managerApproval = {
      approverId: managerId,
      timestamp: new Date().toISOString(),
      comments
    };
    
    // Update leave balance - remove from pending
    const balance = mockLeaveBalances.find(b => b.userId === request.employeeId);
    if (balance && balance.balances[request.leaveType]) {
      const days = calculateLeaveDays(
        request.startDate, 
        request.endDate, 
        request.halfDayStart || false, 
        request.halfDayEnd || false
      );
      balance.balances[request.leaveType]!.pending -= days;
      balance.balances[request.leaveType]!.remaining += days;
    }
  }
  
  request.updatedAt = new Date().toISOString();
  mockLeaveRequests[requestIndex] = request;
  
  return request;
};

// Approve or reject a leave request by HR
export const processHRApproval = (
  requestId: string,
  hrId: string,
  approved: boolean,
  comments?: string
): LeaveRequest | null => {
  const requestIndex = mockLeaveRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) return null;
  
  const request = mockLeaveRequests[requestIndex];
  
  // Update request
  if (approved) {
    request.status = 'approved';
    request.hrApproval = {
      approverId: hrId,
      timestamp: new Date().toISOString(),
      comments
    };
    
    // Update leave balance - move from pending to used
    const balance = mockLeaveBalances.find(b => b.userId === request.employeeId);
    if (balance && balance.balances[request.leaveType]) {
      const days = calculateLeaveDays(
        request.startDate, 
        request.endDate, 
        request.halfDayStart || false, 
        request.halfDayEnd || false
      );
      balance.balances[request.leaveType]!.pending -= days;
      balance.balances[request.leaveType]!.used += days;
    }
  } else {
    request.status = 'rejected';
    request.hrApproval = {
      approverId: hrId,
      timestamp: new Date().toISOString(),
      comments
    };
    
    // Update leave balance - remove from pending
    const balance = mockLeaveBalances.find(b => b.userId === request.employeeId);
    if (balance && balance.balances[request.leaveType]) {
      const days = calculateLeaveDays(
        request.startDate, 
        request.endDate, 
        request.halfDayStart || false, 
        request.halfDayEnd || false
      );
      balance.balances[request.leaveType]!.pending -= days;
      balance.balances[request.leaveType]!.remaining += days;
    }
  }
  
  request.updatedAt = new Date().toISOString();
  mockLeaveRequests[requestIndex] = request;
  
  return request;
};

// Helper function to calculate working days between two dates
function calculateLeaveDays(
  startDate: string, 
  endDate: string, 
  halfDayStart: boolean, 
  halfDayEnd: boolean
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let days = 0;
  
  // Loop through each day
  const current = new Date(start);
  while (current <= end) {
    // Skip weekends
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Check if it's a holiday
      const isHoliday = mockHolidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getDate() === current.getDate() &&
          holidayDate.getMonth() === current.getMonth() &&
          (holidayDate.getFullYear() === current.getFullYear() || holiday.isRecurringYearly)
        );
      });
      
      if (!isHoliday) {
        // Add full or half day
        if (
          (current.getTime() === start.getTime() && halfDayStart) ||
          (current.getTime() === end.getTime() && halfDayEnd)
        ) {
          days += 0.5;
        } else {
          days += 1;
        }
      }
    }
    
    // Move to next day
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}
