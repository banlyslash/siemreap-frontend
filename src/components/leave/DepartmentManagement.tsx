"use client";

import { useState } from "react";
import { mockDepartments } from "@/lib/leave/mockLeaveData";
import { Department } from "@/lib/auth/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import SubmitButton from "@/components/auth/SubmitButton";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
  });
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
    });
    setErrors({
      name: "",
    });
  };
  
  // Open add modal
  const openAddModal = () => {
    resetFormData();
    setShowAddModal(true);
  };
  
  // Open edit modal
  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
    });
    setShowEditModal(true);
  };
  
  // Open delete confirmation
  const openDeleteConfirm = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteConfirm(true);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle input change
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
  
  // Handle add department
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new department
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: formData.name,
      };
      
      // Add to state
      setDepartments([...departments, newDepartment]);
      
      // Close modal
      setShowAddModal(false);
      resetFormData();
      
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle edit department
  const handleEditDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedDepartment) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update department
      const updatedDepartments = departments.map(d => 
        d.id === selectedDepartment.id
          ? {
              ...d,
              name: formData.name,
            }
          : d
      );
      
      // Update state
      setDepartments(updatedDepartments);
      
      // Close modal
      setShowEditModal(false);
      setSelectedDepartment(null);
      resetFormData();
      
    } catch (error) {
      alert("Failed to update department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete department
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out the deleted department
      const updatedDepartments = departments.filter(d => d.id !== selectedDepartment.id);
      
      // Update state
      setDepartments(updatedDepartments);
      
      // Close modal
      setShowDeleteConfirm(false);
      setSelectedDepartment(null);
      
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Department</h3>
            <form onSubmit={handleAddDepartment}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name<span className="text-red-500 ml-1">*</span>
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
                  placeholder="e.g. Marketing"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <SubmitButton isLoading={isLoading}>
                  Add Department
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Department</h3>
            <form onSubmit={handleEditDepartment}>
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="edit-name"
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
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <SubmitButton isLoading={isLoading}>
                  Update Department
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the department "{selectedDepartment.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Department Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage company departments and organizational structure
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Department
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {departments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a department.
            </p>
            <div className="mt-6">
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Department
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(department)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(department)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
