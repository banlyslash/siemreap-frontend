"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { mockLeaveRequests, mockHolidays } from "@/lib/leave/mockLeaveData";
import { LeaveType } from "@/lib/leave/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Leave type color mapping
const leaveTypeColors: Record<LeaveType, string> = {
  annual: "bg-blue-200",
  sick: "bg-red-200",
  personal: "bg-purple-200",
  unpaid: "bg-gray-200",
  other: "bg-green-200",
};

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaves: {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: LeaveType;
  }[];
  isHoliday?: boolean;
  holidayName?: string;
}

export default function LeaveCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"team" | "personal">("team");

  if (!user) {
    return <div>Please log in to view the leave calendar.</div>;
  }

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + 1);
    setCurrentDate(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days: CalendarDay[] = [];

    // Get previous month's days to fill in the first week
    const prevMonthDays = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1
    );
    
    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth - 1,
        prevMonthDays - i
      );
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        leaves: [],
      });
    }

    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday =
        today.getDate() === i &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

      // Check for leaves on this day
      const leaves = mockLeaveRequests
        .filter((leave) => {
          // Only show approved leaves or those approved by manager
          if (leave.status !== "approved" && leave.status !== "approved_by_manager") {
            return false;
          }

          // Filter by employee if in personal view
          if (viewMode === "personal" && leave.employeeId !== user.id) {
            return false;
          }

          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          
          // Check if this day falls within the leave period
          return date >= startDate && date <= endDate;
        })
        .map((leave) => ({
          id: leave.id,
          employeeId: leave.employeeId,
          employeeName: "Employee Name", // In a real app, you'd get the name from the employee record
          leaveType: leave.leaveType,
        }));

      // Check for holidays
      const holiday = mockHolidays.find((h) => {
        const holidayDate = new Date(h.date);
        return (
          date.getDate() === holidayDate.getDate() &&
          date.getMonth() === holidayDate.getMonth() &&
          (date.getFullYear() === holidayDate.getFullYear() || h.isRecurringYearly)
        );
      });

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        leaves,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
      });
    }

    // Add days from next month to fill the last week
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 0 : currentMonth + 1,
        i
      );
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        leaves: [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">Leave Calendar</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("team")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                viewMode === "team"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Team View
            </button>
            <button
              onClick={() => setViewMode("personal")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                viewMode === "personal"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Personal View
            </button>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/dashboard/request-leave"
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200"
            >
              Request Leave
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 ${
                day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
              } ${day.isToday ? "border-2 border-blue-500" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm font-medium ${
                    day.isToday ? "text-blue-600" : ""
                  }`}
                >
                  {day.date.getDate()}
                </span>
                {day.isHoliday && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Holiday
                  </span>
                )}
              </div>

              {day.isHoliday && (
                <div className="mt-1 text-xs text-red-600 font-medium">
                  {day.holidayName}
                </div>
              )}

              <div className="mt-1 space-y-1">
                {day.leaves.map((leave) => (
                  <div
                    key={`${leave.id}-${day.date}`}
                    className={`text-xs px-1.5 py-0.5 rounded truncate ${
                      leaveTypeColors[leave.leaveType]
                    }`}
                    title={`${leave.employeeName} - ${leave.leaveType}`}
                  >
                    {leave.employeeName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Legend:</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(leaveTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div className={`w-3 h-3 rounded ${color} mr-1`}></div>
              <span className="text-xs text-gray-600 capitalize">{type}</span>
            </div>
          ))}
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-red-100 mr-1"></div>
            <span className="text-xs text-gray-600">Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
