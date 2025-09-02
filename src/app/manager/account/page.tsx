'use client';

import React, { useState } from 'react';
import ManagerAccountDashboard from '../../../components/Manager/ManagerAccountDashboard';

const ManagerAccountPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    period: 'year' as 'day' | 'month' | 'year'
  });

  const handleDateFilterChange = (newFilter: any) => {
    setDateFilter(newFilter);
  };

  return (
    <div className="p-6">
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">ตัวกรองข้อมูล</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => handleDateFilterChange({...dateFilter, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => handleDateFilterChange({...dateFilter, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
            <select
              value={dateFilter.period}
              onChange={(e) => handleDateFilterChange({...dateFilter, period: e.target.value as 'day' | 'month' | 'year'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">รายวัน</option>
              <option value="month">รายเดือน</option>
              <option value="year">รายปี</option>
            </select>
          </div>
        </div>
      </div>
      <ManagerAccountDashboard dateFilter={dateFilter} />
    </div>
  );
};

export default ManagerAccountPage;
