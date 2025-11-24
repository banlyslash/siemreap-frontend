"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_LEAVE_TYPES, CREATE_LEAVE_REQUEST } from "@/lib/leave/leaveQueries";
import { useAuth } from "@/lib/auth/AuthContext";
import { CreateLeaveRequestInput } from "@/lib/leave/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FormDataState = {
  startDate: string;
  endDate: string;
  halfDay: boolean;
  leaveTypeId: string;
  reason: string;
};

type ErrorField = Exclude<keyof FormDataState, "halfDay">;

type FormErrors = Record<ErrorField, string>;

const isErrorField = (field: keyof FormDataState): field is ErrorField => field !== "halfDay";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date | null;
}

export default function LeaveRequestModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
}: LeaveRequestModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = useState<FormDataState>({
    startDate: "",
    endDate: "",
    halfDay: false,
    leaveTypeId: "",
    reason: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    startDate: "",
    endDate: "",
    leaveTypeId: "",
    reason: "",
  });

  // Reset form when modal opens or initialDate changes
  useEffect(() => {
    if (isOpen) {
      const dateStr = initialDate
        ? initialDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
        
      setFormData({
        startDate: dateStr,
        endDate: dateStr,
        halfDay: false,
        leaveTypeId: leaveTypes.length > 0 ? leaveTypes[0].id : "",
        reason: "",
      });
      setErrors({
        startDate: "",
        endDate: "",
        leaveTypeId: "",
        reason: "",
      });
      setFormError(null);
    }
  }, [isOpen, initialDate, leaveTypes]);

  // Fetch leave types
  const { data: leaveTypesData } = useQuery<{ leaveTypes: Array<{ id: string; name: string }> }>(GET_LEAVE_TYPES);

  useEffect(() => {
    if (leaveTypesData?.leaveTypes) {
      setLeaveTypes(leaveTypesData.leaveTypes);
      setFormData((prev) => {
        if (prev.leaveTypeId) {
          return prev;
        }

        const defaultLeaveTypeId = leaveTypesData.leaveTypes[0]?.id ?? "";
        return {
          ...prev,
          leaveTypeId: defaultLeaveTypeId,
        };
      });
    }
  }, [leaveTypesData]);

  // Create leave request mutation
  const [createLeaveRequest, { loading: mutationLoading }] = useMutation(CREATE_LEAVE_REQUEST, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      setFormError(error.message || "Failed to submit leave request");
    },
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

    if (!user) {
      setFormError("You must be logged in to submit a leave request");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const input: CreateLeaveRequestInput = {
        userId: user.id,
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        halfDay: formData.halfDay,
        reason: formData.reason,
      };

      await createLeaveRequest({
        variables: { input },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Error submitting leave request:", err);
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (isErrorField(field)) {
      setErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }

        return {
          ...prev,
          [field]: "",
        };
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Submit a new leave request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="halfDay"
              type="checkbox"
              checked={formData.halfDay}
              onChange={(e) => handleInputChange("halfDay", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="halfDay" className="font-normal cursor-pointer">
              Half day
            </Label>
          </div>

          <div>
            <Label htmlFor="leaveTypeId">Leave Type</Label>
            <select
              id="leaveTypeId"
              value={formData.leaveTypeId}
              onChange={(e) => handleInputChange("leaveTypeId", e.target.value)}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.leaveTypeId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.leaveTypeId && (
              <p className="mt-1 text-xs text-red-600">{errors.leaveTypeId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              rows={3}
              className={errors.reason ? "border-red-500" : ""}
              placeholder="Reason for leave..."
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || mutationLoading}>
              {isLoading || mutationLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
