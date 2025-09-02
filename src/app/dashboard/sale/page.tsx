'use client';

import React, { useState } from 'react';
import ManagerSaleDashboard from '../../../components/Manager/ManagerSaleDashboard';

const ManagerSalePage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'day' as 'day' | 'month' | 'year'
  });

  return <ManagerSaleDashboard dateFilter={dateFilter} />;
};

export default ManagerSalePage;
