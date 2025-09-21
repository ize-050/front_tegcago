import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { getSaleDashboardData, getSalespersonList, SaleDashboardData } from '../../services/manager';

interface DateFilter {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

interface SalespersonFilter {
  salespersonId: string;
  salespersonName: string;
}

interface EnhancedManagerSaleDashboardProps {
  dateFilter: DateFilter;
}

const EnhancedManagerSaleDashboard: React.FC<EnhancedManagerSaleDashboardProps> = ({ dateFilter }) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<SalespersonFilter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<SaleDashboardData | null>(null);
  const [salespersonList, setSalespersonList] = useState<SalespersonFilter[]>([]);
  const [error, setError] = useState<string | null>(null);


  // Load data from API
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters = {
        ...dateFilter,
        salespersonId: selectedSalesperson?.salespersonId
      };
      
      const response = await getSaleDashboardData(filters);
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalespersonList = async () => {
    try {
      const response = await getSalespersonList();
      if (response.success) {
        const allOption = { salespersonId: 'all', salespersonName: 'ทั้งหมด' };
        setSalespersonList([allOption, ...response.data]);
        setSelectedSalesperson(allOption);
      } else {
        const defaultList = [{ salespersonId: 'all', salespersonName: 'ทั้งหมด' }];
        setSalespersonList(defaultList);
        setSelectedSalesperson(defaultList[0]);
      }
    } catch (err) {
      console.error('Error loading salesperson list:', err);
    }
  };

  useEffect(() => {
    loadSalespersonList();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [dateFilter, selectedSalesperson]);

  const handleExportData = () => {
    console.log('Exporting sale data...');
  };

  const handleRefreshData = () => {
    loadDashboardData();
  };

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !dashboardData && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      )}

      {/* Enhanced KPI Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">จำนวนติดต่อรวม</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.totalContacts.toLocaleString()}</p>
                <p className="text-xs text-green-600">
                
                </p>
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
                <p className="text-xs text-orange-600">
                  
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  ฿{(dashboardData.kpis.totalSales / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600">
                  
                </p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.totalShipments.toLocaleString()}</p>
                <p className="text-xs text-blue-600">
                  
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Charts */}
      {dashboardData && (
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
            <LineChart data={dashboardData?.salesData || []}>
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

        {/* Shipment Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">ยอด Shipment ของเซลล์</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option value="count">จำนวน</option>
              <option value="value">มูลค่า</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.shipmentData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'value' ? `฿${value.toLocaleString()}` : value,
                name === 'value' ? 'มูลค่า' : 'จำนวน Shipment'
              ]} />
              <Legend />
              <Bar dataKey="shipments" fill="#8B5CF6" name="จำนวน Shipment" />
              <Bar dataKey="value" fill="#EC4899" name="มูลค่า" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>
      )}

      {/* Salesperson Performance Table */}
      {dashboardData && (
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
              {dashboardData?.salespersonPerformance?.map((person, index) => (
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
      )}
    </div>
  );
};

export default EnhancedManagerSaleDashboard;
