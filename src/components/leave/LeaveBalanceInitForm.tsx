"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { INITIALIZE_LEAVE_BALANCE_MUTATION } from "@/lib/graphql/mutations/leave";
import { GET_USER_QUERY } from "@/lib/graphql/queries/user";
import { InitializeLeaveBalanceResponse } from "@/lib/graphql/types/leave";
import SubmitButton from "@/components/auth/SubmitButton";

interface LeaveBalanceInitFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LeaveBalanceInitForm({ userId, onSuccess, onCancel }: LeaveBalanceInitFormProps) {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    year: currentYear,
    defaultAllocation: 20,
  });

  const [errors, setErrors] = useState({
    defaultAllocation: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // No need to fetch leave types with the new API structure

  // Initialize leave balance mutation
  const [initializeLeaveBalance, { loading: mutationLoading }] = useMutation<InitializeLeaveBalanceResponse>(
    INITIALIZE_LEAVE_BALANCE_MUTATION,
    {
      onCompleted: (data) => {
        const result = data?.initializeLeaveBalance;
        if (result?.success) {
          setFormSuccess(result.message || "Leave balances initialized successfully!");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1200);
        } else {
          setFormError(result?.message || "Failed to initialize leave balances");
        }
      },
      onError: (error) => {
        setFormError(error.message || "Failed to initialize leave balance");
      },
      refetchQueries: [
        { query: GET_USER_QUERY, variables: { id: userId } },
      ],
    }
  );

  const validateForm = (): boolean => {
    const newErrors = {
      defaultAllocation: "",
    };
    let isValid = true;
    
    if (formData.defaultAllocation < 0) {
      newErrors.defaultAllocation = "Default allocation days cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!validateForm()) return;

    try {
      await initializeLeaveBalance({
        variables: {
          input: {
            userId,
            defaultAllocation: formData.defaultAllocation,
            year: formData.year,
          }
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formSuccess}</span>
        </div>
      )}

      {/* Leave type selection removed as per new API structure */}

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Year
        </label>
        <select
          id="year"
          value={formData.year}
          onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-800"
          disabled={mutationLoading}
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={currentYear - 2 + i}>
              {currentYear - 2 + i}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="defaultAllocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Default Allocation (Days)<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="defaultAllocation"
          type="number"
          min="0"
          step="0.5"
          value={formData.defaultAllocation}
          onChange={(e) => handleInputChange("defaultAllocation", parseFloat(e.target.value))}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white dark:bg-gray-800 ${
            errors.defaultAllocation ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
          }`}
          disabled={mutationLoading}
          required
        />
        {errors.defaultAllocation && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.defaultAllocation}</p>}
      </div>

      {/* Days Already Used field removed as per new API structure */}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          disabled={mutationLoading}
        >
          Cancel
        </button>
        <SubmitButton isLoading={mutationLoading}>Initialize Balance</SubmitButton>
      </div>
    </form>
  );
}
