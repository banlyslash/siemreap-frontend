"use client";

import { Loader2Icon } from "lucide-react";
import clsx from "clsx";

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

export default function SubmitButton({
  children,
  isLoading = false,
  disabled = false,
  className,
  type = "submit",
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(
        "w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        disabled || isLoading
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        "transition-colors duration-200",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
