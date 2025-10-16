"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, UserRole } from "@/lib/auth/types";
import { mockDepartments } from "@/lib/leave/mockLeaveData";
import { mockUsers } from "@/lib/auth/mockUsers";
import SubmitButton from "@/components/auth/SubmitButton";

interface EmployeeFormProps {
  employee?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    password: "",
    role: employee?.role || "employee" as UserRole,
    departmentId: employee?.departmentId || "",
    managerId: employee?.managerId || "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  // Get managers for dropdown
  const managers = mockUsers.filter(user => 
    user.role === "manager" || user.role === "hr"
  );
  
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      departmentId: "",
    };
    
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else if (!isEditing) {
      // Check if email already exists (only for new employees)
      const emailExists = mockUsers.some(user => user.email === formData.email);
      if (emailExists) {
        newErrors.email = "This email is already registered";
        isValid = false;
      }
    }
    
    // Password validation (only required for new employees)
    if (!isEditing && !formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!isEditing && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Department validation
    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create/update the employee
      setFormSuccess(isEditing 
        ? "Employee updated successfully!" 
        : "Employee created successfully!"
      );
      
      // Call onSuccess after a delay to show the success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
      
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Employee form error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when typing
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formError}</span>
        </div>
      )}
      
      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formSuccess}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full name<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.name
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.email
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      
      {!isEditing && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              errors.password
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="hr">HR Admin</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="department"
          value={formData.departmentId}
          onChange={(e) => handleInputChange("departmentId", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.departmentId
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          required
        >
          <option value="">Select Department</option>
          {mockDepartments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.departmentId && (
          <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
        )}
      </div>
      
      {formData.role === "employee" && (
        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
            Manager
          </label>
          <select
            id="manager"
            value={formData.managerId}
            onChange={(e) => handleInputChange("managerId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name} ({manager.role})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <SubmitButton isLoading={isLoading}>
          {isEditing ? "Update Employee" : "Create Employee"}
        </SubmitButton>
      </div>
    </form>
  );
}
