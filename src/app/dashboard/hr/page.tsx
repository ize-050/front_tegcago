'use client';

import React from 'react';
import ManagerHRDashboard from '../../../components/Manager/ManagerHRDashboard';

export default function HRDashboardPage() {
  const dateFilter = {
    startDate: '',
    endDate: '',
    period: 'month' as const
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerHRDashboard dateFilter={dateFilter} />
    </div>
  );
};
