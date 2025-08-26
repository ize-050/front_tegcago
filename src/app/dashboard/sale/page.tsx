'use client';

import React from 'react';
import SaleDashboardHeader from '@/components/dashboard/sale/SaleDashboardHeader';
import SaleDashboardFilters from '@/components/dashboard/sale/SaleDashboardFilters';
import SaleDashboardKPICards from '@/components/dashboard/sale/SaleDashboardKPICards';
import SaleDashboardCharts from '@/components/dashboard/sale/SaleDashboardCharts';
import SaleDashboardTable from '@/components/dashboard/sale/SaleDashboardTable';
import SaleDashboardJobDetails from '@/components/dashboard/sale/SaleDashboardJobDetails';

/**
 * Sale Dashboard Main Page
 * 
 * Features:
 * - Real-time KPIs with trend indicators
 * - Interactive charts with tooltips and legends
 * - Performance rankings with action buttons
 * - Job details breakdown by salesperson and month
 * - Drill-down capability from overview to individual jobs
 * - Export options for Excel, PDF, Email
 */
const SaleDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Navigation */}
      <SaleDashboardHeader />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters Section */}
        <SaleDashboardFilters />
        
        {/* KPI Cards */}
        <SaleDashboardKPICards />
        
        {/* Charts Section */}
        <SaleDashboardCharts />
        
        {/* Performance Table */}
        <SaleDashboardTable />
        
        {/* Job Details Breakdown */}
        <SaleDashboardJobDetails />
      </div>
    </div>
  );
};

export default SaleDashboardPage;
