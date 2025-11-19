"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasRole, getDashboardPathForRole } from "@/lib/auth/roleUtils";
import { useSidebarStore } from "@/store/sidebarStore";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Menu,
  PieChart,
  User,
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
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-[#0070f3] animate-spin"></div>
        </div>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar
        user={user}
        navigation={filteredNavigation}
        dashboardHome={dashboardHome}
        onSignOut={signOut}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center lg:hidden">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href={dashboardHome} className="ml-4 flex items-center">
                <span className="text-lg font-bold text-[#0070f3]">
                  Siemreap
                </span>
              </Link>
            </div>
            
            <div className="flex items-center ml-auto">
              <div className="ml-4 relative flex-shrink-0 lg:hidden">
                {user.avatarUrl ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#0070f3]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Siemreap. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
