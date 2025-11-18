"use client";

import { Holiday } from "@/lib/leave/types";

interface HolidayListProps {
  holidays: Holiday[];
  currentMonth: number;
  currentYear: number;
}

export default function HolidayList({ holidays, currentMonth, currentYear }: HolidayListProps) {
  // Filter holidays for the current month
  const currentMonthHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return (
      holidayDate.getMonth() === currentMonth &&
      holidayDate.getFullYear() === currentYear
    );
  }).sort((a, b) => {
    // Sort by date ascending
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="px-4 py-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Holidays This Month
      </h3>
      
      {currentMonthHolidays.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No holidays this month</p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {currentMonthHolidays.map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-700">
                  {formatDate(holiday.date)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {holiday.name}
                  </p>
                  {holiday.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {holiday.description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Holiday
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
