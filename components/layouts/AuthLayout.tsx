"use client";

import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col justify-center items-center p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Task Manager
          </h1>
          <p className="text-xl text-blue-100 max-w-md">
            Streamline your workflow and boost productivity with our intuitive task management solution.
          </p>
        </div>
        {/* You can add decorative elements or patterns here */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-700 to-transparent" />
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 