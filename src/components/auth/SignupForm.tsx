"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";

interface SignupFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function SignupForm({ onSuccess, redirectTo = "/dashboard" }: SignupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Import the useAuth hook
  const { error: authError } = useAuth();
  
  // Mock signUp function since it's not implemented in AuthContext yet
  const signUp = async (data: any) => {
    // This is a placeholder - in a real app, this would call the API
    console.log('Signup data:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For demo purposes, we'll just redirect
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  // Set form error if auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the signUp method from AuthContext
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // If we get here, signup was successful
      setFormSuccess("Account created successfully! Redirecting...");
      
      // The redirect is handled by AuthContext based on user role
      if (onSuccess) {
        onSuccess();
      }
      // No need for explicit redirect as AuthContext handles it
    } catch (error: any) {
      // If the error is not already set by AuthContext
      if (!authError) {
        setFormError(error.message || "An unexpected error occurred. Please try again.");
      }
      console.error("Signup error:", error);
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
      
      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{formSuccess}</span>
        </div>
      )}
      
      <FormField
        id="name"
        label="Full name"
        type="text"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        error={errors.name}
        required
        autoComplete="name"
        placeholder="John Doe"
      />
      
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
        autoComplete="new-password"
        placeholder="••••••••"
      />
      
      <PasswordInput
        id="confirmPassword"
        label="Confirm password"
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange("confirmPassword", value)}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
        placeholder="••••••••"
      />
      
      <div>
        <SubmitButton isLoading={isLoading}>
          Create account
        </SubmitButton>
      </div>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </div>
    </form>
  );
}
