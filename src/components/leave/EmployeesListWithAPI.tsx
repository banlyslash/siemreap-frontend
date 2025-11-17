"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_USERS_QUERY } from "@/lib/graphql/queries/user";
import { UserRole, Department } from "@/lib/auth/types";
import { mockDepartments } from "@/lib/leave/mockLeaveData";
import { Edit, Trash2, UserPlus } from "lucide-react";

// GraphQL query result types
interface GqlUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersData {
  users: GqlUser[];
}

// UI user type for this table
interface UIUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  managerId?: string;
  avatarUrl?: string;
}

// Role display names
const roleNames: Record<UserRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR Admin",
};

// Role badge colors
const roleBadgeColors: Record<UserRole, string> = {
  employee: "bg-blue-100 text-blue-800",
  manager: "bg-purple-100 text-purple-800",
  hr: "bg-green-100 text-green-800",
};

export default function EmployeesListWithAPI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const { data, loading, error } = useQuery<GetUsersData>(GET_USERS_QUERY);

  const apiUsers: GqlUser[] = data?.users ?? [];

  // Map API users to UI shape expected by the table
  const users: UIUser[] = apiUsers.map((u: GqlUser) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`.trim(),
    email: u.email,
    role: u.role as UserRole,
    departmentId: undefined as string | undefined,
    managerId: undefined as string | undefined,
    avatarUrl: undefined as string | undefined,
  }));

  // Filter users
  const filteredUsers: UIUser[] = users.filter((user: UIUser) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesDepartment =
      departmentFilter === "all" || user.departmentId === departmentFilter;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Get department name by ID (placeholder until API provides department on user)
  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "N/A";
    const department = mockDepartments.find((dept: Department) => dept.id === departmentId);
    return department ? department.name : "Unknown";
  };

  // Get manager name by ID (placeholder until API provides manager on user)
  const getManagerName = (managerId?: string) => {
    if (!managerId) return "N/A";
    const manager = users.find((user: UIUser) => user.id === managerId);
    return manager ? manager.name : "Unknown";
  };

  // Handle delete click
  const handleDeleteClick = (userId: string) => {
    setEmployeeToDelete(userId);
    setShowDeleteConfirm(true);
  };

  // Handle confirm delete (no API yet)
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      // TODO: Integrate delete user mutation when available
      console.log(`Deleting employee with ID: ${employeeToDelete}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 text-red-600">
          Failed to load employees: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">Employees</h2>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Leave Reports
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/employees/add"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Employee
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Departments</option>
              {mockDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user: UIUser) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatarUrl ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">
                            {user.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColors[user.role as UserRole]}`}>
                      {roleNames[user.role as UserRole]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getDepartmentName(user.departmentId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getManagerName(user.managerId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/employees/edit/${user.id}`} className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No employees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
