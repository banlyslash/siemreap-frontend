"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ClipboardList, FileText } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup'>('login');

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Leave Management System
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Streamline your organization's leave request and approval process
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Sign Up
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage leave requests efficiently
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <ClipboardList className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Request Leave</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Easily submit leave requests with date selection, reason, and type. Get instant validation against your available balance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                        <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Approval Workflow</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Streamlined approval process with manager and HR review. Get notified at each step of the approval chain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                        <Calendar className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Leave Calendar</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Visual calendar showing team availability. Plan your leaves with full visibility of your team's schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Get Started Today
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Sign in or create an account to start managing leave requests
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="border-b border-gray-200 w-full max-w-md">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('login')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'login'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'signup'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sign Up
              </button>
            </nav>
          </div>
        </div>

        {/* Form container */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white p-8 shadow rounded-lg">
            {activeTab === 'login' ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Sign in to your account</h3>
                <LoginForm redirectTo="/dashboard" />
                <div className="mt-4 text-sm text-gray-600">
                  <p>Demo credentials:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Employee: employee@example.com / password123</li>
                    <li>Manager: manager@example.com / password123</li>
                    <li>HR: hr@example.com / password123</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Create a new account</h3>
                <SignupForm redirectTo="/dashboard" />
                <div className="mt-4 text-sm text-gray-600">
                  <p>Note: New accounts are created with the Employee role by default</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
