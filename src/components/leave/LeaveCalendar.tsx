"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { User } from "@/lib/auth/types";
import { useHoliday } from "@/lib/holiday/HolidayContext";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import HolidayList from "./HolidayList";
import {
  GET_LEAVE_REQUESTS,
  GET_LEAVE_TYPES,
  GET_USERS,
  GET_TEAM_MEMBERS,
} from "@/lib/leave/leaveQueries";
import LeaveRequestModal from "./LeaveRequestModal";
import LeaveDetailsModal, { CalendarLeaveRequest } from "./LeaveDetailsModal";
import { Button } from "@/components/ui/button";
import { LeaveRequestStatus, LeaveType } from "@/lib/leave/types";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaves: CalendarLeaveRequest[];
  isHoliday?: boolean;
  holidayName?: string;
}

export default function LeaveCalendar() {
  const { user } = useAuth();
  const { holidays, error: holidaysError, fetchHolidays } = useHoliday();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<CalendarLeaveRequest | null>(null);

  // State for filters
  const [filterType, setFilterType] = useState<string>("all");
  const [filterEmployee, setFilterEmployee] = useState<string>("all");

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate View Range (42 days: 6 weeks * 7 days)
  const { viewStartDate, viewEndDate } = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
    
    const start = new Date(currentYear, currentMonth, 1);
    start.setDate(1 - firstDayOfMonth); // Go back to Sunday
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 41); // 42 days total
    end.setHours(23, 59, 59, 999);

    return { viewStartDate: start, viewEndDate: end };
  }, [currentMonth, currentYear]);

  // Fetch holidays
  useEffect(() => {
    fetchHolidays(currentYear);
  }, [currentYear, fetchHolidays]);

  // Fetch Leave Types for Filter
  const { data: leaveTypesData } = useQuery<{ leaveTypes: LeaveType[] }>(GET_LEAVE_TYPES);
  const leaveTypes = leaveTypesData?.leaveTypes ?? [];

  // Fetch Users for Filter (Manager/HR only)
  const isManagerOrHr = user?.role === "manager" || user?.role === "hr";
  const { data: usersData } = useQuery<{ users?: User[]; teamMembers?: User[] }>(
    user?.role === "hr" ? GET_USERS : GET_TEAM_MEMBERS,
    {
      skip: !isManagerOrHr,
      variables: user?.role === "manager" && user?.id ? { managerId: user.id } : undefined,
    }
  );
  const employeeList: User[] | undefined =
    user?.role === "hr" ? usersData?.users : usersData?.teamMembers;

  // Fetch Leave Requests
  const { data: leavesData, refetch: refetchLeaves } = useQuery<
    { leaveRequests: CalendarLeaveRequest[] },
    { startDate: Date; endDate: Date; userId?: string }
  >(GET_LEAVE_REQUESTS, {
    variables: {
      startDate: viewStartDate,
      endDate: viewEndDate,
      ...(filterEmployee !== "all" ? { userId: filterEmployee } : {}),
    },
    fetchPolicy: "network-only", // Ensure fresh data
  });

  const leaveRequests = useMemo<CalendarLeaveRequest[]>(() => {
    const requests = leavesData?.leaveRequests ?? [];

    if (filterType === "all") {
      return requests;
    }

    return requests.filter((req) => req.leaveType.id === filterType);
  }, [leavesData, filterType]);

  // Navigation
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Calendar Grid
  const calendarDays = useMemo<CalendarDay[]>(() => {
    if (!user) {
      return [];
    }

    const days: CalendarDay[] = [];
    const iterDate = new Date(viewStartDate);

    // We generate exactly 42 days
    for (let i = 0; i < 42; i++) {
      const date = new Date(iterDate);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = new Date().toDateString() === date.toDateString();

      // Find leaves for this day
      const dayLeaves = leaveRequests.filter((leave) => {
        const status = leave.status;
        if (
          (status === LeaveRequestStatus.CANCELLED ||
            status === LeaveRequestStatus.MANAGER_REJECTED ||
            status === LeaveRequestStatus.HR_REJECTED) &&
          leave.user.id !== user.id
        ) {
          return false;
        }

        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return date >= start && date <= end;
      });

      // Find holiday
      const holiday = holidays.find((h) => {
        const hDate = new Date(h.date);
        return hDate.toDateString() === date.toDateString();
      });

      days.push({
        date,
        isCurrentMonth,
        isToday,
        leaves: dayLeaves,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
      });

      iterDate.setDate(iterDate.getDate() + 1);
    }

    return days;
  }, [viewStartDate, currentMonth, leaveRequests, holidays, user]);

  if (!user) {
    return <div>Please log in to view the leave calendar.</div>;
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Interactions
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsRequestModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, leave: CalendarLeaveRequest) => {
    e.stopPropagation();
    setSelectedLeave(leave);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
      {/* Holiday Error */}
      {holidaysError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            Unable to load holidays. {holidaysError}
          </p>
        </div>
      )}

      {/* Header & Filters */}
      <div className="px-4 py-4 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="bg-transparent border-none text-sm focus:ring-0"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Leave Types</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {isManagerOrHr && employeeList && (
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  className="bg-transparent border-none text-sm focus:ring-0"
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <Button 
            onClick={() => {
              setSelectedDate(new Date());
              setIsRequestModalOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`
                min-h-[120px] p-2 border-b border-r border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer
                ${!day.isCurrentMonth ? "bg-gray-50/50" : "bg-white"}
                ${day.isToday ? "bg-blue-50/30" : ""}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`
                    text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full
                    ${day.isToday ? "bg-blue-600 text-white" : day.isCurrentMonth ? "text-gray-700" : "text-gray-400"}
                  `}
                >
                  {day.date.getDate()}
                </span>
                {day.isHoliday && (
                  <span title={day.holidayName} className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                    Holiday
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {day.leaves.map((leave) => (
                  <div
                    key={`${leave.id}-${day.date.toISOString()}`}
                    onClick={(e) => handleEventClick(e, leave)}
                    className={`
                      text-xs px-2 py-1 rounded-md truncate border shadow-sm transition-all hover:opacity-80
                      ${leave.status === LeaveRequestStatus.PENDING ? 'opacity-80 border-dashed' : ''}
                    `}
                    style={{ 
                      backgroundColor: leave.leaveType.color || '#E5E7EB', 
                      borderColor: leave.leaveType.color ? `${leave.leaveType.color}80` : '#D1D5DB',
                      color: '#1F2937'
                    }}
                    title={`${leave.user.firstName} ${leave.user.lastName} - ${leave.leaveType.name} (${leave.status})`}
                  >
                    <span className="font-semibold mr-1">{leave.user.firstName}</span>
                    <span className="opacity-75 hidden xl:inline">{leave.leaveType.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200 mr-2"></span>
            Holiday
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded border border-gray-300 border-dashed mr-2"></span>
            Pending Request
          </div>
          {leaveTypes.map((type) => (
            <div key={type.id} className="flex items-center">
              <span
                className="w-3 h-3 rounded border mr-2"
                style={{ backgroundColor: type.color, borderColor: `${type.color}80` }}
              ></span>
              {type.name}
            </div>
          ))}
        </div>
      </div>

      {/* Holiday List */}
      <HolidayList 
        holidays={holidays} 
        currentMonth={currentMonth} 
        currentYear={currentYear} 
      />

      {/* Modals */}
      <LeaveRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          refetchLeaves(); // Refresh data
          setIsRequestModalOpen(false);
        }}
        initialDate={selectedDate}
      />

      <LeaveDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLeave(null);
        }}
        onSuccess={() => {
          refetchLeaves(); // Refresh data
        }}
        leaveRequest={selectedLeave}
      />
    </div>
  );
}
