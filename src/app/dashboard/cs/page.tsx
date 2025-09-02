'use client';

import React from 'react';
import ManagerCSDashboard from '@/components/Manager/ManagerCSDashboard';

const CSDashboardPage: React.FC = () => {
  const dateFilter = {
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    period: 'year' as const
  };

  return <ManagerCSDashboard dateFilter={dateFilter} />;
};

export default CSDashboardPage;
