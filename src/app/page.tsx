"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ClipboardList, FileText, CheckCircle, Users, Clock } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup'>('login');

  return (
    <div className="font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#0070f3]">Siemreap</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Login
              </Link>
              <Button href="/signup" variant="default" size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Your next leave management</span>
                <span className="block text-[#0070f3]">executed with precision</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                Streamline your organization's leave request and approval process with our comprehensive leave management system.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button href="/login" variant="gradient" size="lg">
                  Get Started
                </Button>
                <Button href="/dashboard" variant="outline" size="lg">
                  View Dashboard
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:ml-8">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-[#0070f3]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-[#6366f1]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#10b981]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 bg-gradient-to-r from-[#0070f3] to-[#6366f1] text-white">
                      <h3 className="text-lg font-medium">Leave Request Dashboard</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Annual Leave</h4>
                            <p className="text-sm text-gray-500">15 days remaining</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Approved Requests</h4>
                            <p className="text-sm text-gray-500">3 this month</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Pending Requests</h4>
                            <p className="text-sm text-gray-500">1 awaiting approval</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage leave requests efficiently
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden">
                <div className="h-2 bg-[#0070f3]"></div>
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Request Leave</CardTitle>
                  <CardDescription>
                    Easily submit leave requests with date selection, reason, and type.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get instant validation against your available balance. Track the status of your requests in real-time.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-2 bg-[#10b981]"></div>
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="mt-4">Approval Workflow</CardTitle>
                  <CardDescription>
                    Streamlined approval process with manager and HR review.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get notified at each step of the approval chain. Managers can easily approve or reject requests.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-2 bg-[#6366f1]"></div>
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="mt-4">Leave Calendar</CardTitle>
                  <CardDescription>
                    Visual calendar showing team availability.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Plan your leaves with full visibility of your team's schedule. Avoid conflicts and ensure coverage.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Get Started Today
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Sign in or create an account to start managing leave requests
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="bg-gradient-to-br from-[#0070f3] to-[#6366f1] p-1 rounded-2xl shadow-xl">
                <div className="bg-white p-8 rounded-xl">
                  {/* Tab navigation */}
                  <div className="flex justify-center mb-8">
                    <div className="border-b border-gray-200 w-full">
                      <nav className="-mb-px flex" aria-label="Tabs">
                        <button
                          onClick={() => setActiveTab('login')}
                          className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                            activeTab === 'login'
                              ? 'border-[#0070f3] text-[#0070f3]'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => setActiveTab('signup')}
                          className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                            activeTab === 'signup'
                              ? 'border-[#0070f3] text-[#0070f3]'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Sign Up
                        </button>
                      </nav>
                    </div>
                  </div>

                  {/* Form container */}
                  {activeTab === 'login' ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">Sign in to your account</h3>
                      <LoginForm redirectTo="/dashboard" />
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Demo credentials:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>Employee: employee@example.com / employee123</li>
                          <li>Manager: manager@example.com / manager123</li>
                          <li>HR: hr@example.com / hr123</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">Create a new account</h3>
                      <SignupForm redirectTo="/dashboard" />
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Note: New accounts are created with the Employee role by default
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Why Choose Our Leave Management System?</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Streamlined Process</h4>
                      <p className="mt-2 text-gray-600">Simplify leave requests and approvals with our intuitive interface.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Team Visibility</h4>
                      <p className="mt-2 text-gray-600">Get complete visibility into your team's availability and leave schedule.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                        <Clock className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Time Saving</h4>
                      <p className="mt-2 text-gray-600">Reduce administrative overhead and save time with automated workflows.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Siemreap</h3>
              <p className="text-gray-400">Streamlining leave management for organizations of all sizes.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">support@siemreap.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Siemreap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
