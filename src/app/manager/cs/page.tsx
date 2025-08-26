'use client';

import React, { useState } from 'react';
import ManagerCSDashboard from '../../../components/Manager/ManagerCSDashboard';

const ManagerCSPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'day' as 'day' | 'month' | 'year'
  });

  return <ManagerCSDashboard dateFilter={dateFilter} />;
};

export default ManagerCSPage;
