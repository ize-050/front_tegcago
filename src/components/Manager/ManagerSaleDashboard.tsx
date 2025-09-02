import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { getSaleDashboardData, getAllSalespersons, SaleDashboardData } from '@/services/manager';
import ShipmentLineChart from '../Charts/ShipmentLineChart';
import SalesRevenueChart from '../Charts/SalesRevenueChart';
import ShipmentBySalesChart from '../Charts/ShipmentBySalesChart';

interface DateFilter {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

interface SalespersonFilter {
  salespersonId: string;
  salespersonName: string;
}

interface ManagerSaleDashboardProps {
  dateFilter?: DateFilter;
}

// Define salesperson interface to match API response
interface SalespersonOption {
  id: string;
  fullname: string;
  email: string;
  roles_name: string;
}

const ManagerSaleDashboard: React.FC<ManagerSaleDashboardProps> = ({ dateFilter: propDateFilter }) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<SalespersonFilter | null>(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    period: 'year'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<SaleDashboardData | null>(null);
  const [salespersonList, setSalespersonList] = useState<SalespersonFilter[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load salesperson list
  useEffect(() => {
    const loadSalespersonList = async () => {
      try {
        console.log('=== LOADING SALESPERSON LIST ===');
        const response = await getAllSalespersons();
        console.log('Salesperson API Response:', response);
        
        if (response && response.success && response.data) {
          // Transform API response to match SalespersonFilter interface
          const transformedList: SalespersonFilter[] = response.data.map((person: SalespersonOption) => ({
            salespersonId: person.id,
            salespersonName: person.fullname
          }));
          
          setSalespersonList(transformedList);
          
          // Set default selection to "ทั้งหมด" (all)
          const defaultSelection = transformedList.find(p => p.salespersonId === 'all');
          if (defaultSelection) {
            setSelectedSalesperson(defaultSelection);
          }
          
          console.log('Salesperson list loaded:', transformedList);
        } else {
          console.error('Invalid salesperson response format:', response);
          // Fallback to default list
          const defaultList = [{ salespersonId: 'all', salespersonName: 'ทั้งหมด' }];
          setSalespersonList(defaultList);
          setSelectedSalesperson(defaultList[0]);
        }
      } catch (error) {
        console.error('Error loading salesperson list:', error);
        // Fallback to default list
        const defaultList = [{ salespersonId: 'all', salespersonName: 'ทั้งหมด' }];
        setSalespersonList(defaultList);
        setSelectedSalesperson(defaultList[0]);
      }
    };
    loadSalespersonList();
  }, []);

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

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedSalesperson) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const params = {
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate,
          period: dateFilter.period,
          salespersonId: selectedSalesperson.salespersonId === 'all' ? undefined : selectedSalesperson.salespersonId
        };
        
        const response = await getSaleDashboardData(params);
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError('ไม่สามารถโหลดข้อมูลได้');
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [dateFilter, selectedSalesperson]);

  const handleExportData = () => {
    // Export functionality
    console.log('Exporting sale data...');
  };

  const handleRefreshData = async () => {
    if (!selectedSalesperson) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate,
        period: dateFilter.period,
        salespersonId: selectedSalesperson.salespersonId === 'all' ? undefined : selectedSalesperson.salespersonId
      };
      
      const response = await getSaleDashboardData(params);
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('ไม่สามารถรีเฟรชข้อมูลได้');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('เกิดข้อผิดพลาดในการรีเฟรชข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefreshData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard when data is available
  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ไม่มีข้อมูลแสดงผล</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sale Dashboard</h2>
            <p className="text-sm text-gray-500">ภาพรวมยอดขายและผลงานเซลล์ทั้งหมด</p>
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
              <select
                value={selectedSalesperson?.salespersonId || 'all'}
                onChange={(e) => {
                  const selected = salespersonList.find(s => s.salespersonId === e.target.value);
                  setSelectedSalesperson(selected || null);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {salespersonList.map(person => (
                  <option key={person.salespersonId} value={person.salespersonId}>
                    {person.salespersonName}
                  </option>
                ))}
              </select>
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
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                    }}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">จำนวนติดต่อรวม</p>
              <p className="text-2xl font-bold text-gray-900">{(dashboardData.kpis.totalContacts || 0).toLocaleString()}</p>
              {selectedSalesperson && selectedSalesperson.salespersonId !== 'all' && (
                <p className="text-xs text-gray-400 mt-1">เซลล์: {selectedSalesperson.salespersonName}</p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">จำนวนรอปิดการขาย</p>
              <p className="text-2xl font-bold text-gray-900">{(dashboardData.kpis.pendingDeals || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Show Sales KPI only if there's actual sales data */}
        {(dashboardData.kpis.totalSales || 0) > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-gray-900">฿{(dashboardData.kpis.totalSales || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">เฉลี่ย: ฿{Math.round((dashboardData.kpis.totalSales || 0) / Math.max((dashboardData.kpis.pendingDeals || 0), 1)).toLocaleString()}/ดีล</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Show Shipment KPI only if there are shipments */}
        {(dashboardData.kpis.totalShipments || 0) > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">จำนวน Shipment</p>
                <p className="text-2xl font-bold text-gray-900">{(dashboardData.kpis.totalShipments || 0).toLocaleString()}</p>
                <p className="text-xs text-blue-600">+8% จากเดือนที่แล้ว</p>
                <p className="text-xs text-gray-400 mt-1">สถานะ: ดำเนินการ</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Show placeholder card when no sales/shipment data */}
        {(dashboardData.kpis.totalSales || 0) === 0 && (dashboardData.kpis.totalShipments || 0) === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">สถานะระบบ</p>
                <p className="text-2xl font-bold text-gray-900">พร้อมใช้งาน</p>
                <p className="text-xs text-blue-600">ระบบทำงานปกติ</p>
                <p className="text-xs text-gray-400 mt-1">รอข้อมูลยอดขาย</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SalesRevenueChart 
            showFilters={false}
            filters={{
              salespersonId: selectedSalesperson?.salespersonId,
              year: selectedYear?.toString(),
              month: selectedMonth?.toString(),
              startDate: dateFilter.startDate,
              endDate: dateFilter.endDate
            }}
          />
        </div>

        {/* Shipment Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ShipmentLineChart 
            showFilters={false}
            filters={{
              salespersonId: selectedSalesperson?.salespersonId,
              year: selectedYear,
              month: selectedMonth,
              startDate: dateFilter.startDate,
              endDate: dateFilter.endDate
            }}
          />
        </div>
      </div>

      {/* Shipment by Sales Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ShipmentBySalesChart 
          selectedYear={selectedYear}
          selectedMonth={selectedMonth === 'all' ? 'all' : parseInt(selectedMonth)}
          selectedSalesperson={selectedSalesperson?.salespersonId || 'all'}
        />
      </div>

      {/* Salesperson Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ผลงานพนักงานขาย</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้าติดต่อ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดีลปิด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายได้</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อัตราการปิด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.salespersonPerformance.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.contacts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.deals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿{person.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      person.conversion >= 50 ? 'bg-green-100 text-green-800' :
                      person.conversion >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {person.conversion}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      ใช้งาน
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerSaleDashboard;
