import { User, UserRole, Department } from "./types";

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

// Mock user data for testing
export const mockUsers = [
  // Employee users
  {
    id: "user-1",
    name: "John Employee",
    email: "employee@example.com",
    password: "password123", // In a real app, this would be hashed
    emailVerified: true,
    avatarUrl: "https://ui-avatars.com/api/?name=John+Employee&background=0D8ABC&color=fff",
    role: "employee" as UserRole,
    departmentId: "dept-1",
    managerId: "user-3"
  },
  {
    id: "user-2",
    name: "Jane Employee",
    email: "test@example.com", // Demo user from home page
    password: "password123", // In a real app, this would be hashed
    emailVerified: true,
    avatarUrl: "https://ui-avatars.com/api/?name=Jane+Employee&background=9B59B6&color=fff",
    role: "employee" as UserRole,
    departmentId: "dept-2",
    managerId: "user-3"
  },
  
  // Manager users
  {
    id: "user-3",
    name: "Mary Manager",
    email: "manager@example.com",
    password: "password123", // In a real app, this would be hashed
    emailVerified: true,
    avatarUrl: "https://ui-avatars.com/api/?name=Mary+Manager&background=FF5733&color=fff",
    role: "manager" as UserRole,
    departmentId: "dept-1"
  },
  
  // HR users
  {
    id: "user-4",
    name: "HR Admin",
    email: "hr@example.com",
    password: "password123", // In a real app, this would be hashed
    emailVerified: true,
    avatarUrl: "https://ui-avatars.com/api/?name=HR+Admin&background=27AE60&color=fff",
    role: "hr" as UserRole,
    departmentId: "dept-3"
  }
];

// Mock user authentication
export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  
  if (!user) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

// Mock user registration
export const registerUser = (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole = "employee",
  departmentId?: string,
  managerId?: string
): User => {
  // Check if user already exists
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("User already exists with this email");
  }
  
  // Create new user
  const newUser = {
    id: `user-${mockUsers.length + 1}`,
    name,
    email,
    password, // In a real app, this would be hashed
    emailVerified: false,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
    role,
    departmentId,
    managerId
  };
  
  // Add to mock users
  mockUsers.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
};

// Get department by ID
export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find(dept => dept.id === id);
};

// Get manager by ID
export const getManagerById = (id: string): User | undefined => {
  const manager = mockUsers.find(user => user.id === id && user.role === "manager");
  if (manager) {
    const { password: _, ...managerWithoutPassword } = manager;
    return managerWithoutPassword as User;
  }
  return undefined;
};
