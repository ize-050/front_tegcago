'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface HRKPIData {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  avgSalary: number;
  employeeRetention: number;
  employeesGrowth: number;
  hiresGrowth: number;
  retentionGrowth: number;
}

interface DateFilter {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

interface HRKPICard {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  bgColor: string;
}

const HRDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    period: 'year'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [kpiData, setKpiData] = useState<HRKPIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update dateFilter when year or month changes
  useEffect(() => {
    if (selectedMonth === 'all') {
      setDateFilter({
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
        period: 'year'
      });
    } else {
      const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      setDateFilter({
        startDate: `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`,
        endDate: `${selectedYear}-${selectedMonth.padStart(2, '0')}-${lastDay}`,
        period: 'month'
      });
    }
  }, [selectedYear, selectedMonth]);

  // Load HR dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/hr/kpis`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            year: parseInt(selectedYear),
            month: selectedMonth !== 'all' ? parseInt(selectedMonth) : undefined
          }
        });

        if (response.data.success && response.data.data) {
          setKpiData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load HR dashboard data');
        }
      } catch (error) {
        console.error('Error loading HR dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        
        // Fallback to mock data
        setKpiData({
          totalEmployees: 245,
          activeEmployees: 230,
          newHires: 15,
          avgSalary: 45000,
          employeeRetention: 92.5,
          employeesGrowth: 6.2,
          hiresGrowth: 25.0,
          retentionGrowth: 3.1
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [dateFilter, selectedYear, selectedMonth]);

  const handleRefreshData = () => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  };

  const handleExportData = () => {
    // Implement export data logic here
  };

  const kpiCards: HRKPICard[] = [
    {
      id: '1',
      title: 'พนักงานทั้งหมด',
      value: kpiData ? kpiData.totalEmployees.toLocaleString() : '0',
      subtitle: 'จำนวนพนักงานทั้งหมด',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      id: '2',
      title: 'พนักงานใหม่',
      value: kpiData ? kpiData.newHires.toLocaleString() : '0',
      subtitle: 'พนักงานที่เข้าใหม่',
      icon: <Package className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      id: '3',
      title: 'เงินเดือนเฉลี่ย',
      value: kpiData ? `฿${kpiData.avgSalary.toLocaleString()}` : '฿0',
      subtitle: 'เงินเดือนเฉลี่ยของพนักงาน',
      icon: <DollarSign className="h-6 w-6 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    {
      id: '4',
      title: 'อัตราการคงอยู่',
      value: kpiData ? `${kpiData.employeeRetention}%` : '0%',
      subtitle: 'อัตราการคงอยู่ของพนักงาน',
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
            <p className="text-sm text-gray-500">ภาพรวมการจัดการทรัพยากรบุคคล</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>รีเฟรช</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              <Download className="h-4 w-4" />
              <span>ส่งออก</span>
            </button>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">ตัวกรอง:</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">ช่วงเวลา:</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="2025">ปี 2025</option>
                    <option value="2024">ปี 2024</option>
                    <option value="2023">ปี 2023</option>
                    <option value="2022">ปี 2022</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="all">ทั้งปี</option>
                    <option value="1">มกราคม</option>
                    <option value="2">กุมภาพันธ์</option>
                    <option value="3">มีนาคม</option>
                    <option value="4">เมษายน</option>
                    <option value="5">พฤษภาคม</option>
                    <option value="6">มิถุนายน</option>
                    <option value="7">กรกฎาคม</option>
                    <option value="8">สิงหาคม</option>
                    <option value="9">กันยายน</option>
                    <option value="10">ตุลาคม</option>
                    <option value="11">พฤศจิกายน</option>
                    <option value="12">ธันวาคม</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                )}
              </div>
              <div className={`p-3 ${card.bgColor} rounded-full`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Growth Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be implemented with real data
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Distribution</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be implemented with real data
          </div>
        </div>
      </div>

      {/* HR Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ผลงานทรัพยากรบุคคล</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พนักงาน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เงินเดือน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">พนักงานตัวอย่าง</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HR Manager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿50,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    ใช้งาน
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
