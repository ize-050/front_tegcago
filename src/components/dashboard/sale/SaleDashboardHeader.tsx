'use client';

import React from 'react';
import { Bell, BarChart3, Settings, LogOut, User } from 'lucide-react';

interface SaleDashboardHeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
}

/**
 * Sale Dashboard Header Component
 * 
 * Features:
 * - TegCaGo branding and navigation
 * - User profile display
 * - Notification bell with count
 * - Quick action buttons (Dashboard, Settings, Logout)
 * - Breadcrumb navigation
 */
const SaleDashboardHeader: React.FC<SaleDashboardHeaderProps> = ({
  userName = 'Sale A',
  userRole = 'Sales Representative',
  notificationCount = 3
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Header */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-200" />
                <h1 className="text-xl font-bold">TegCaGo</h1>
              </div>
              <div className="hidden md:block text-blue-200">|</div>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold">Sale Dashboard</h2>
              </div>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Dashboard */}
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <BarChart3 className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-blue-700 px-3 py-2 rounded-lg">
                <div className="bg-blue-500 p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-blue-200">{userRole}</div>
                </div>
              </div>

              {/* Logout */}
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button className="hover:text-blue-600 transition-colors">
              🏠 Home
            </button>
            <span className="text-gray-400">&gt;</span>
            <button className="hover:text-blue-600 transition-colors">
              📊 Dashboard
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="text-blue-600 font-medium">💼 Sale Dashboard</span>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SaleDashboardHeader;
