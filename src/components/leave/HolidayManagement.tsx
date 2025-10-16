"use client";

import { useState } from "react";
import Link from "next/link";
import { mockHolidays } from "@/lib/leave/mockLeaveData";
import { Calendar, Plus, Trash2, Edit } from "lucide-react";
import SubmitButton from "@/components/auth/SubmitButton";

// Holiday type definition
interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  description?: string;
}

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    date: "",
  });
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      date: "",
      description: "",
    });
    setErrors({
      name: "",
      date: "",
    });
  };
  
  // Open add modal
  const openAddModal = () => {
    resetFormData();
    setShowAddModal(true);
  };
  
  // Open edit modal
  const openEditModal = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description || "",
    });
    setShowEditModal(true);
  };
  
  // Open delete confirmation
  const openDeleteConfirm = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setShowDeleteConfirm(true);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      date: "",
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Holiday name is required";
      isValid = false;
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
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
  
  // Handle add holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new holiday
      const newHoliday: Holiday = {
        id: `holiday-${Date.now()}`,
        name: formData.name,
        date: formData.date,
        description: formData.description || undefined,
      };
      
      // Add to state
      setHolidays([...holidays, newHoliday]);
      
      // Close modal
      setShowAddModal(false);
      resetFormData();
      
    } catch (error) {
      console.error("Error adding holiday:", error);
      alert("Failed to add holiday. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle edit holiday
  const handleEditHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedHoliday) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update holiday
      const updatedHolidays = holidays.map(h => 
        h.id === selectedHoliday.id
          ? {
              ...h,
              name: formData.name,
              date: formData.date,
              description: formData.description || undefined,
            }
          : h
      );
      
      // Update state
      setHolidays(updatedHolidays);
      
      // Close modal
      setShowEditModal(false);
      setSelectedHoliday(null);
      resetFormData();
      
    } catch (error) {
      console.error("Error updating holiday:", error);
      alert("Failed to update holiday. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete holiday
  const handleDeleteHoliday = async () => {
    if (!selectedHoliday) return;
    
    setIsLoading(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out the deleted holiday
      const updatedHolidays = holidays.filter(h => h.id !== selectedHoliday.id);
      
      // Update state
      setHolidays(updatedHolidays);
      
      // Close modal
      setShowDeleteConfirm(false);
      setSelectedHoliday(null);
      
    } catch (error) {
      console.error("Error deleting holiday:", error);
      alert("Failed to delete holiday. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Add Holiday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Holiday</h3>
            <form onSubmit={handleAddHoliday}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Holiday Name<span className="text-red-500 ml-1">*</span>
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
                    placeholder="e.g. New Year's Day"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      errors.date
                        ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
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
                  Add Holiday
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Holiday Modal */}
      {showEditModal && selectedHoliday && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Holiday</h3>
            <form onSubmit={handleEditHoliday}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Holiday Name<span className="text-red-500 ml-1">*</span>
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
                
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      errors.date
                        ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
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
                  Update Holiday
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedHoliday && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the holiday "{selectedHoliday.name}"? This action cannot be undone.
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
                onClick={handleDeleteHoliday}
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
          <h2 className="text-lg font-medium text-gray-900">Holiday Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure company holidays and non-working days
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Holiday
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {holidays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No holidays</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a company holiday.
            </p>
            <div className="mt-6">
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Holiday
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holiday Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holidays.map((holiday) => (
                  <tr key={holiday.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {holiday.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(holiday.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {holiday.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(holiday)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(holiday)}
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
