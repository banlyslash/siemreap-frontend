"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasRole, getDashboardPathForRole } from "@/lib/auth/roleUtils";
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  PieChart,
  User,
  X,
  CalendarDays,
  Building,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavItem[] = [
  // Common routes
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["EMPLOYEE", "MANAGER", "HR"] },
  { name: "Leave Calendar", href: "/dashboard/calendar", icon: Calendar, roles: ["EMPLOYEE", "MANAGER", "HR"] },
  { name: "Leave History", href: "/dashboard/leave-history", icon: FileText, roles: ["EMPLOYEE", "MANAGER", "HR"] },
  
  // Employee & Manager routes
  { name: "Request Leave", href: "/dashboard/request-leave", icon: ClipboardList, roles: ["EMPLOYEE", "MANAGER"] },
  
  // Manager & HR routes
  { name: "Leave Approvals", href: "/dashboard/approvals", icon: ClipboardList, roles: ["MANAGER", "HR"] },
  
  // HR only routes
  { name: "Leave Reports", href: "/dashboard/reports", icon: PieChart, roles: ["HR"] },
  { name: "Employee Management", href: "/dashboard/employees", icon: User, roles: ["HR"] },
  { name: "Holiday Management", href: "/dashboard/holidays", icon: CalendarDays, roles: ["HR"] },
  { name: "Department Management", href: "/dashboard/departments", icon: Building, roles: ["HR"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.some(role => hasRole(user.role, role))
  );

  // Determine the correct dashboard home based on role
  const dashboardHome = getDashboardPathForRole(user.role);

  // Redirect to role-specific dashboard if at /dashboard root
  if (pathname === "/dashboard") {
    router.push(dashboardHome);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto lg:h-screen`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href={dashboardHome} className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                Leave Management
              </span>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href={dashboardHome} className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                Leave Management
              </span>
            </Link>
            <div className="w-6"></div> {/* Empty div for flex spacing */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
