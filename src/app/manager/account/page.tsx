'use client';

import React, { useState } from 'react';
import ManagerAccountDashboard from '../../../components/Manager/ManagerAccountDashboard';

const ManagerAccountPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'day' as 'day' | 'month' | 'year'
  });

  return <ManagerAccountDashboard dateFilter={dateFilter} />;
};

export default ManagerAccountPage;
