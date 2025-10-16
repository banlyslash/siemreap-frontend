/**
 * Utility functions for handling user roles
 */

/**
 * Normalize a role string for comparison (converts to uppercase)
 * @param role The role string to normalize
 * @returns The normalized role string
 */
export function normalizeRole(role: string): string {
  return role.toUpperCase();
}

/**
 * Check if a user has a specific role
 * @param userRole The user's role
 * @param roleToCheck The role to check against
 * @returns True if the user has the specified role
 */
export function hasRole(userRole: string, roleToCheck: string): boolean {
  return normalizeRole(userRole) === normalizeRole(roleToCheck);
}

/**
 * Get the dashboard path for a user based on their role
 * @param role The user's role
 * @returns The dashboard path
 */
export function getDashboardPathForRole(role: string): string {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'EMPLOYEE':
      return '/dashboard/employee';
    case 'MANAGER':
      return '/dashboard/manager';
    case 'HR':
      return '/dashboard/hr';
    case 'ADMIN':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}

/**
 * User role enum
 */
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  HR = 'HR',
  ADMIN = 'ADMIN'
}
