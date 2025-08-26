'use client';

import React, { useState } from 'react';
import ManagerHRDashboard from '../../../components/Manager/ManagerHRDashboard';

const ManagerHRPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'day' as 'day' | 'month' | 'year'
  });

  return <ManagerHRDashboard dateFilter={dateFilter} />;
};

export default ManagerHRPage;
