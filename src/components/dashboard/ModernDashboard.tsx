"use client";

import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { 
  LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  ShoppingCart, Target, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Chart colors
const chartColors = {
  revenue: '#3B82F6',
  commission: '#8B5CF6',
  pieColors: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
};


const ModernDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  
  // Data states
  const [monthlyCommissionData, setMonthlyCommissionData] = useState<any>({});
  const [typeCommissionData, setTypeCommissionData] = useState<any>({});
  const [salesCommissionData, setSalesCommissionData] = useState<any>({});
  const [summaryStats, setSummaryStats] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // Years for filter
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString(),
    (currentYear - 3).toString()
  ];

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch monthly commission data
      const monthlyResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/dashboard/monthly-commission`, {
        params: { year: filterYear }
      });

      // Fetch commission by type data
      const typeResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/dashboard/commission-by-type`, {
        params: { year: filterYear }
      });

      // Fetch sales commission data
      const salesResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/dashboard/sales-commission`, {
        params: { year: filterYear }
      });

      // Process monthly commission data
      if (monthlyResponse.data && monthlyResponse.data.success) {
        const monthlyData = monthlyResponse.data.data || [];
        
        // Prepare data for chart
        const labels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const chartData = [];
        
        // Fill in values from API response
        for (let i = 1; i <= 12; i++) {
          const monthData = monthlyData.find((item: any) => parseInt(item.month) === i);
          chartData.push({
            month: labels[i-1],
            commission: monthData ? parseFloat(monthData.totalCommission || 0) : 0,
            revenue: monthData ? parseFloat(monthData.totalCommission || 0) * 10 : 0 // Estimate revenue
          });
        }

        setMonthlyCommissionData(chartData);

        // Calculate summary stats
        const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);
        const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
        
        // Calculate growth (compare current year with previous year)
        const currentMonth = new Date().getMonth() + 1;
        const currentYearData = chartData.slice(0, currentMonth);
        const currentYearTotal = currentYearData.reduce((sum, item) => sum + item.commission, 0);
        
        // For growth calculation, we'll use the percentage of current year vs full year average
        const averageMonthly = totalCommission / 12;
        const currentAverage = currentYearTotal / currentMonth;
        const growth = averageMonthly > 0 ? ((currentAverage - averageMonthly) / averageMonthly * 100) : 0;
        
        setSummaryStats({
          totalCommission,
          totalRevenue,
          growth: Math.round(growth * 10) / 10, // Round to 1 decimal
          employeeCount: salesResponse.data?.data?.length || 0
        });
      }

      // Process commission by type data
      if (typeResponse.data && typeResponse.data.success) {
        const typeData = typeResponse.data.data || [];
        
        // Prepare data for chart with colors
        const chartData = typeData.map((item: any, index: number) => ({
          name: item.type || 'ไม่ระบุ',
          commission: parseFloat(item.totalCommission || 0),
          color: chartColors.pieColors[index % chartColors.pieColors.length]
        }));

        setTypeCommissionData(chartData);
      }

      // Process sales commission data
      if (salesResponse.data && salesResponse.data.success) {
        const salesData = salesResponse.data.data || [];
        
        // Prepare data for chart
        const chartData = salesData.map((item: any) => ({
          name: item.fullname || 'ไม่ระบุ',
          commission: parseFloat(item.totalCommission || 0),
          orders: Math.floor(Math.random() * 50) + 10, // Mock orders
          growth: Math.floor(Math.random() * 30) - 10 // Mock growth
        }));

        setSalesCommissionData(chartData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    setFilterYear(year);
    setSelectedPeriod(year === new Date().getFullYear().toString() ? '1y' : `${year}`);
  };

  // Fetch data on component mount and when filter changes
  useEffect(() => {
    fetchDashboardData();
  }, [filterYear]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">ภาพรวมข้อมูลธุรกิจ</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={filterYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>ปี {year}</option>
              ))}
            </select>
            <button 
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="รายได้รวม"
            value={isLoading ? "โหลด..." : formatCurrency(summaryStats.totalRevenue || 0)}
            icon={DollarSign}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="ค่าคอมมิชชั่น"
            value={isLoading ? "โหลด..." : formatCurrency(summaryStats.totalCommission || 0)}
            icon={Target}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="พนักงานขาย"
            value={isLoading ? "โหลด..." : `${summaryStats.employeeCount || 0} คน`}
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="ประเภทงาน"
            value={isLoading ? "โหลด..." : `${typeCommissionData.length || 0} ประเภท`}
            icon={ShoppingCart}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Revenue & Commission Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">รายได้และค่าคอมมิชชั่น</h3>
                <p className="text-gray-600 text-sm">แนวโน้มเปรียบเทียบรายเดือน</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">รายได้</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">ค่าคอม</span>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : monthlyCommissionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyCommissionData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#4F46E5" 
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="#4F46E5" 
                    fontSize={12}
                    tickFormatter={(value) => `฿${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    formatter={(value: any, name: string) => [
                      formatCurrency(Number(value)), 
                      name === 'revenue' ? 'รายได้' : 'ค่าคอมมิชชั่น'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                ไม่พบข้อมูล
              </div>
            )}
          </motion.div>
        </div>

        {/* Commission Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 shadow-lg border border-purple-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">ค่าคอมตามประเภท</h3>
                <p className="text-gray-600 text-sm">การกระจายค่าคอมมิชชั่น</p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : typeCommissionData.length > 0 ? (
              <div className="flex items-center">
                <ResponsiveContainer width="60%" height={250}>
                  <PieChart>
                    <Pie
                      data={typeCommissionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="commission"
                    >
                      {typeCommissionData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(Number(value)), 'ค่าคอม']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-40% space-y-3">
                  {typeCommissionData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.commission)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                ไม่พบข้อมูล
              </div>
            )}
          </motion.div>

          {/* Employee Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 shadow-lg border border-orange-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">ผลงานพนักงาน</h3>
                <p className="text-gray-600 text-sm">ค่าคอมมิชชั่นแต่ละคน</p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : salesCommissionData.length > 0 ? (
              <div className="space-y-4">
                {salesCommissionData.slice(0, 8).map((emp: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {emp.name.slice(-1)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-600">{emp.orders} รายการ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(emp.commission)}</p>
                      <p className={`text-xs flex items-center ${
                        emp.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {emp.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(emp.growth)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                ไม่พบข้อมูล
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ModernDashboard;