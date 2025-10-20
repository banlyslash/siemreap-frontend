"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_LEAVE_TYPES, CREATE_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { useAuth } from "@/lib/auth/AuthContext";
import SubmitButton from "../auth/SubmitButton";
import { CreateLeaveRequestInput } from "@/lib/leave/types";

export default function LeaveRequestForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<Array<{id: string, name: string}>>([]);

  // Fetch leave types
  const { data: leaveTypesData, loading: loadingLeaveTypes } = useQuery(GET_LEAVE_TYPES);

  useEffect(() => {
    if (leaveTypesData?.leaveTypes) {
      setLeaveTypes(leaveTypesData.leaveTypes);
      // Set default leave type if available
      if (leaveTypesData.leaveTypes.length > 0 && !formData.leaveTypeId) {
        setFormData(prev => ({
          ...prev,
          leaveTypeId: leaveTypesData.leaveTypes[0].id
        }));
      }
    }
  }, [leaveTypesData]);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    halfDay: false,
    leaveTypeId: "",
    reason: "",
  });

  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
    leaveTypeId: "",
    reason: "",
  });

  // Create leave request mutation
  const [createLeaveRequest, { loading: mutationLoading }] = useMutation(CREATE_LEAVE_REQUEST, {
    onCompleted: (data) => {
      setFormSuccess("Leave request submitted successfully!");
      
      // Reset form
      setFormData({
        startDate: "",
        endDate: "",
        halfDay: false,
        leaveTypeId: leaveTypes.length > 0 ? leaveTypes[0].id : "",
        reason: "",
      });

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard/leave-history");
      }, 2000);
    },
    onError: (error) => {
      setFormError(error.message || "Failed to submit leave request");
    }
  });

  const validateForm = (): boolean => {
    const newErrors = {
      startDate: "",
      endDate: "",
      leaveTypeId: "",
      reason: "",
    };

    let isValid = true;

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = "End date cannot be before start date";
      isValid = false;
    }

    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = "Leave type is required";
      isValid = false;
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
      isValid = false;
    } else if (formData.reason.length > 500) {
      newErrors.reason = "Reason cannot exceed 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!user) {
      setFormError("You must be logged in to submit a leave request");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create the input object according to the schema requirements
      const input: CreateLeaveRequestInput = {
        userId: user.id,
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        halfDay: formData.halfDay,
        reason: formData.reason
      };

      await createLeaveRequest({
        variables: { input }
      });
    } catch (error) {
      // Error is handled by onError in the useMutation hook
      console.error("Error submitting leave request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
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

  if (loadingLeaveTypes) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{formSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                errors.startDate
                  ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              required
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>
        </div>

        <div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                errors.endDate
                  ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              required
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="halfDay"
          type="checkbox"
          checked={formData.halfDay}
          onChange={(e) => handleInputChange("halfDay", e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="halfDay"
          className="ml-2 block text-sm text-gray-700"
        >
          Half day
        </label>
      </div>

      <div>
        <label
          htmlFor="leaveTypeId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Leave Type<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="leaveTypeId"
          value={formData.leaveTypeId}
          onChange={(e) => handleInputChange("leaveTypeId", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.leaveTypeId
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          required
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.leaveTypeId && (
          <p className="mt-1 text-sm text-red-600">{errors.leaveTypeId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Reason<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => handleInputChange("reason", e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.reason
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder="Please provide a reason for your leave request"
          required
        ></textarea>
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.reason.length}/500 characters
        </p>
      </div>

      <div className="flex justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
        <SubmitButton isLoading={isLoading || mutationLoading}>Submit Request</SubmitButton>
      </div>
    </form>
  );
}
