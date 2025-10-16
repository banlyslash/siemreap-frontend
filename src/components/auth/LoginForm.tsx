"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({ onSuccess, redirectTo = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  
  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
    };
    
    let isValid = true;
    
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Import the useAuth hook
  const { signIn, error: authError } = useAuth();

  // Set form error if auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the signIn method from AuthContext
      await signIn({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      // If we get here, login was successful
      // The redirect is handled by AuthContext based on user role
      if (onSuccess) {
        onSuccess();
      }
      // No need for explicit redirect as AuthContext handles it
    } catch (error: any) {
      // Error is already set by AuthContext
      console.error("Login error:", error);
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formError}</span>
        </div>
      )}
      
      <FormField
        id="email"
        label="Email address"
        type="email"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        error={errors.email}
        required
        autoComplete="email"
        placeholder="you@example.com"
      />
      
      <PasswordInput
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        error={errors.password}
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>
      </div>
      
      <div>
        <SubmitButton isLoading={isLoading}>
          Sign in
        </SubmitButton>
      </div>
      
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </Link>
      </div>
    </form>
  );
}
