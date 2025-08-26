'use client';

import React, { useState } from 'react';
import { ChevronDown, RefreshCw, Download, Calendar, User, BarChart3 } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SaleDashboardFiltersProps {
  onSalespersonChange?: (salesperson: string) => void;
  onPeriodChange?: (period: string) => void;
  onViewChange?: (view: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Sale Dashboard Filters Component
 * 
 * Features:
 * - Salesperson dropdown with job counts
 * - Period selection (preset and custom ranges)
 * - View type selection
 * - Refresh and Export buttons
 * - Responsive design for mobile/desktop
 */
const SaleDashboardFilters: React.FC<SaleDashboardFiltersProps> = ({
  onSalespersonChange,
  onPeriodChange,
  onViewChange,
  onRefresh,
  onExport
}) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Mock data - จะเชื่อมต่อกับ API จริงในภายหลัง
  const salespersonOptions: FilterOption[] = [
    { value: 'all', label: 'All Sales', count: 166 },
    { value: 'sale_a', label: 'Sale A', count: 45 },
    { value: 'sale_b', label: 'Sale B', count: 38 },
    { value: 'sale_c', label: 'Sale C', count: 32 },
    { value: 'sale_d', label: 'Sale D', count: 28 },
    { value: 'sale_e', label: 'Sale E', count: 23 }
  ];

  const periodOptions: FilterOption[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range...' }
  ];

  const viewOptions: FilterOption[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'detailed', label: 'Detailed View' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'trends', label: 'Trends' }
  ];

  const handleSalespersonSelect = (value: string) => {
    setSelectedSalesperson(value);
    setShowSalespersonDropdown(false);
    onSalespersonChange?.(value);
  };

  const handlePeriodSelect = (value: string) => {
    setSelectedPeriod(value);
    setShowPeriodDropdown(false);
    onPeriodChange?.(value);
  };

  const handleViewSelect = (value: string) => {
    setSelectedView(value);
    setShowViewDropdown(false);
    onViewChange?.(value);
  };

  const getSelectedLabel = (options: FilterOption[], value: string) => {
    return options.find(option => option.value === value)?.label || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left: Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Salesperson Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              👤 Salesperson
            </label>
            <button
              onClick={() => setShowSalespersonDropdown(!showSalespersonDropdown)}
              className="w-full sm:w-48 flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-sm text-gray-900">
                {getSelectedLabel(salespersonOptions, selectedSalesperson)}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showSalespersonDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="py-1 max-h-60 overflow-auto">
                  {salespersonOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSalespersonSelect(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                        selectedSalesperson === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      <span>
                        {selectedSalesperson === option.value && '✓ '}
                        {option.label}
                      </span>
                      {option.count && (
                        <span className="text-gray-500 text-xs">({option.count} jobs)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 Period
            </label>
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="w-full sm:w-40 flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-sm text-gray-900">
                {getSelectedLabel(periodOptions, selectedPeriod)}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showPeriodDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="py-1">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePeriodSelect(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedPeriod === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {selectedPeriod === option.value && '✓ '}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📊 View
            </label>
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="w-full sm:w-36 flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-sm text-gray-900">
                {getSelectedLabel(viewOptions, selectedView)}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showViewDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="py-1">
                  {viewOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleViewSelect(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedView === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {selectedView === option.value && '✓ '}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Refresh</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Mobile: Selected Filters Summary */}
      <div className="mt-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            👤 {getSelectedLabel(salespersonOptions, selectedSalesperson)}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            📅 {getSelectedLabel(periodOptions, selectedPeriod)}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            📊 {getSelectedLabel(viewOptions, selectedView)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SaleDashboardFilters;
