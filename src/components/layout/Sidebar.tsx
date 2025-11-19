"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebarStore";
import { SidebarNavItem } from "./SidebarNavItem";
import {
  LogOut,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

interface SidebarUser {
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
}

interface SidebarProps {
  user: SidebarUser;
  navigation: NavItem[];
  dashboardHome: string;
  onSignOut: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({
  user,
  navigation,
  dashboardHome,
  onSignOut,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+B (Windows/Linux) or Cmd+B (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        // Prevent default browser behavior (e.g., bookmarks)
        event.preventDefault();
        // Only toggle on desktop (lg breakpoint)
        if (window.innerWidth >= 1024) {
          toggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  // Prevent hydration mismatch by using default state until mounted
  const collapsed = mounted ? isCollapsed : false;

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white z-50 transform transition-all duration-300 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          collapsed ? "lg:w-20" : "w-72"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 relative">
            <Link href={dashboardHome} className="flex items-center">
              {!collapsed && (
                <span className="text-xl font-bold text-[#0070f3]">
                  Siemreap
                </span>
              )}
              {collapsed && (
                <span className="text-xl font-bold text-[#0070f3]">S</span>
              )}
            </Link>
            
            {/* Mobile close button */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Desktop toggle button */}
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-500 hover:text-[#0070f3] hover:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3] focus:ring-offset-2 transition-colors"
                    onClick={toggle}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!collapsed}
                  >
                    {collapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50"
                  >
                    {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-8">
              {!collapsed && (
                <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Menu
                </div>
              )}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  // Special handling for Dashboard item - highlight when on role-specific dashboard pages
                  const isDashboardItem = item.href === "/dashboard";
                  const isOnDashboardHome =
                    pathname === "/dashboard/employee" ||
                    pathname === "/dashboard/manager" ||
                    pathname === "/dashboard/hr";

                  const isActive =
                    pathname === item.href ||
                    (isDashboardItem && isOnDashboardHome) ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <SidebarNavItem
                      key={item.name}
                      name={item.name}
                      href={item.href}
                      icon={item.icon}
                      isActive={isActive}
                      isCollapsed={collapsed}
                    />
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
              <div className="flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#0070f3]" />
                  </div>
                )}
              </div>
              {!collapsed && (
                <>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize truncate">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={onSignOut}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
              {collapsed && (
                <Tooltip.Provider delayDuration={200}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={onSignOut}
                        aria-label="Sign out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={8}
                        className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50"
                      >
                        Sign out
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
