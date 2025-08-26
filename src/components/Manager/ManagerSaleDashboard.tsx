import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { getSaleDashboardData, getSalespersonList, SaleDashboardData } from '../../services/manager';
import ShipmentLineChart from '../Charts/ShipmentLineChart';

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
  dateFilter: DateFilter;
}

// Use the interface from the service
type DashboardData = SaleDashboardData;

const ManagerSaleDashboard: React.FC<ManagerSaleDashboardProps> = ({ dateFilter }) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<SalespersonFilter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<SaleDashboardData | null>(null);
  const [salespersonList, setSalespersonList] = useState<SalespersonFilter[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load salesperson list
  useEffect(() => {
    const loadSalespersonList = async () => {
      try {
        const response = await getSalespersonList();
        if (response.success) {
          const allOption = { salespersonId: 'all', salespersonName: 'ทั้งหมด' };
          setSalespersonList([allOption, ...response.data]);
          setSelectedSalesperson(allOption);
        } else {
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
        
        {/* Filters */}
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
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>ข้อมูล: {dateFilter.startDate} - {dateFilter.endDate}</span>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">จำนวนติดต่อรวม</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.totalContacts.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% จากเดือนที่แล้ว</p>
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
              <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.pendingDeals.toLocaleString()}</p>
              <p className="text-xs text-orange-600">+3 จากสัปดาห์ที่แล้ว</p>
              <p className="text-xs text-gray-400 mt-1">อัตราการปิด: 85.2%</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-gray-900">฿{(dashboardData.kpis.totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600">+18% จากเดือนที่แล้ว</p>
              <p className="text-xs text-gray-400 mt-1">เฉลี่ย: ฿{Math.round(dashboardData.kpis.totalSales / Math.max(dashboardData.kpis.pendingDeals, 1)).toLocaleString()}/ดีล</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">จำนวน Shipment</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.shipmentCount.toLocaleString()}</p>
              <p className="text-xs text-blue-600">+8% จากเดือนที่แล้ว</p>
              <p className="text-xs text-gray-400 mt-1">มูลค่า: ฿{(dashboardData.kpis.totalSales / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">ยอดขายเซลล์</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option value="revenue">รายได้</option>
              <option value="deals">จำนวนดีล</option>
              <option value="contacts">ลูกค้าติดต่อ</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `฿${value.toLocaleString()}` : value,
                name === 'revenue' ? 'รายได้' : name === 'sales' ? 'ยอดขาย' : 'ลูกค้าติดต่อ'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="รายได้" />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} name="ยอดขาย" />
              <Line type="monotone" dataKey="contacts" stroke="#F59E0B" strokeWidth={2} name="ลูกค้าติดต่อ" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ShipmentLineChart />
        </div>
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
