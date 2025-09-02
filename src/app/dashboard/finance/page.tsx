'use client';

import React from 'react';
import ManagerAccountDashboard from '../../../components/Manager/ManagerAccountDashboard';

export default function FinanceDashboardPage() {
  const dateFilter = {
    startDate: '',
    endDate: '',
    period: 'month' as const
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerAccountDashboard dateFilter={dateFilter} />
    </div>
  );
};
