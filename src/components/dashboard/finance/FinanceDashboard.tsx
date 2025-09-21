'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Package, Calendar, Filter, Download, RefreshCw, CreditCard, Receipt, Wallet, PiggyBank, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface FinanceKPIData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  revenueGrowth: number;
  expensesGrowth: number;
  profitGrowth: number;
}

interface DateFilter {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

const FinanceDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    period: 'year'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [kpiData, setKpiData] = useState<FinanceKPIData | null>(null);
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

  // Load Finance dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/finance/kpis`, {
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
          throw new Error(response.data.message || 'Failed to load Finance dashboard data');
        }
      } catch (error) {
        console.error('Error loading Finance dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        
        // Fallback to mock data
        setKpiData({
          totalRevenue: 2450000,
          totalExpenses: 1850000,
          netProfit: 600000,
          profitMargin: 24.5,
          cashFlow: 450000,
          revenueGrowth: 12.3,
          expensesGrowth: 8.7,
          profitGrowth: 18.5
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [dateFilter, selectedYear, selectedMonth]);

  const handleRefresh = () => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  };

  const kpiCards = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: `$${(kpiData?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      trend: {
        value: kpiData?.revenueGrowth || 0,
        isPositive: (kpiData?.revenueGrowth || 0) >= 0,
        period: 'vs last month'
      },
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'total-expenses',
      title: 'Total Expenses',
      value: `$${(kpiData?.totalExpenses || 0).toLocaleString()}`,
      icon: <CreditCard className="h-6 w-6 text-red-600" />,
      trend: {
        value: kpiData?.expensesGrowth || 0,
        isPositive: (kpiData?.expensesGrowth || 0) < 0, // Lower expenses growth is positive
        period: 'vs last month'
      },
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'net-profit',
      title: 'Net Profit',
      value: `$${(kpiData?.netProfit || 0).toLocaleString()}`,
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      trend: {
        value: kpiData?.profitGrowth || 0,
        isPositive: (kpiData?.profitGrowth || 0) >= 0,
        period: 'vs last month'
      },
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'profit-margin',
      title: 'Profit Margin',
      value: `${(kpiData?.profitMargin || 0).toFixed(1)}%`,
      icon: <Receipt className="h-6 w-6 text-purple-600" />,
      trend: {
        value: 2.3,
        isPositive: true,
        period: 'vs last month'
      },
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow',
      value: `$${(kpiData?.cashFlow || 0).toLocaleString()}`,
      icon: <PiggyBank className="h-6 w-6 text-indigo-600" />,
      trend: {
        value: 15.2,
        isPositive: true,
        period: 'vs last month'
      },
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
              <p className="text-gray-600 mt-1">Financial Performance Overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Error: {error}</span>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpiCards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                {card.icon}
                <div className={`flex items-center space-x-1 text-sm ${
                  card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(card.trend.value).toFixed(1)}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {isLoading ? '...' : card.value}
                </h3>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-gray-500 text-xs mt-1">{card.trend.period}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses Trend</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart will be implemented with real data
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin Trend</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart will be implemented with real data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
