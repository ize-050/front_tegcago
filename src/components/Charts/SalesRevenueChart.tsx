import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from '../../../axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesRevenueChartProps {
  height?: number;
  showFilters?: boolean;
  filters?: {
    salespersonId?: string;
    year?: string;
    month?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface SalesChartResponse {
  success: boolean;
  data: {
    chartData: Array<{
      period: string;
      revenue: number;
      sales: number;
      contacts: number;
    }>;
    summary: {
      totalRevenue: number;
      totalSales: number;
      totalContacts: number;
      avgRevenuePerMonth: number;
    };
  };
  message: string;
}

const SalesRevenueChart: React.FC<SalesRevenueChartProps> = ({ 
  height = 300,
  showFilters = true,
  filters: externalFilters
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'revenue' | 'deals' | 'contacts'>('revenue');

  // Fetch sales chart data
  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API parameters
      const apiParams: any = {};
      
      if (externalFilters) {
        if (externalFilters.salespersonId && externalFilters.salespersonId !== 'all') {
          apiParams.salespersonId = externalFilters.salespersonId;
        }
        if (externalFilters.year) {
          apiParams.year = externalFilters.year;
        }
        if (externalFilters.month && externalFilters.month !== 'all') {
          apiParams.month = externalFilters.month;
        }
        if (externalFilters.startDate) {
          apiParams.startDate = externalFilters.startDate;
        }
        if (externalFilters.endDate) {
          apiParams.endDate = externalFilters.endDate;
        }
      }

      console.log('=== SALES CHART API PARAMS ===');
      console.log('API Params:', apiParams);
      console.log('External Filters:', externalFilters);

      const response = await axios.get<SalesChartResponse>('/manager/dashboard/sale/sales-chart', {
        params: apiParams
      });

      if (response.data && response.data.success) {
        const responseData = response.data.data;
        
        console.log('=== SALES CHART RESPONSE ===');
        console.log('Response data:', responseData);
        console.log('Chart data:', responseData.chartData);
        
        // Transform Nivo format to Recharts format
        let processedData: any[] = [];
        if (responseData.chartData && Array.isArray(responseData.chartData)) {
          // Backend sends Nivo format: [{ id: "admin02", data: [{ x: "ม.ค.", y: 0 }] }]
          // Frontend needs Recharts format: [{ period: "ม.ค.", revenue: 0, sales: 0, contacts: 0 }]
          
          const monthlyData: { [key: string]: any } = {};
          
          // Process each salesperson's data
          responseData.chartData.forEach((salesperson: any) => {
            if (salesperson.data && Array.isArray(salesperson.data)) {
              salesperson.data.forEach((monthData: any) => {
                const month = monthData.x;
                if (!monthlyData[month]) {
                  monthlyData[month] = {
                    period: month,
                    revenue: 0,
                    sales: 0,
                    contacts: 0
                  };
                }
                // Accumulate data for each month
                monthlyData[month].revenue += monthData.y || 0;
                monthlyData[month].sales += 1; // Count as one sale per data point with value > 0
                monthlyData[month].contacts += 1; // Assume 1 contact per sale
              });
            }
          });
          
          // Convert to array and sort by month order
          const monthOrder = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          processedData = monthOrder.map(month => monthlyData[month] || {
            period: month,
            revenue: 0,
            sales: 0,
            contacts: 0
          });
          
          console.log('Processed data for Recharts:', processedData);
        }
        
        setChartData(processedData);
        setSummary(responseData.summary || null);
      } else {
        setError('ไม่สามารถดึงข้อมูลยอดขายได้');
        setChartData([]);
        setSummary(null);
      }
    } catch (err: any) {
      console.error('Error fetching sales data:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setChartData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSalesData();
  }, [externalFilters]);

  // Handle chart type change
  const handleChartTypeChange = (type: 'revenue' | 'deals' | 'contacts') => {
    setChartType(type);
  };

  // Get data key based on chart type
  const getDataKey = () => {
    switch (chartType) {
      case 'revenue': return 'revenue';
      case 'deals': return 'sales';
      case 'contacts': return 'contacts';
      default: return 'revenue';
    }
  };

  // Get chart color based on type
  const getChartColor = () => {
    switch (chartType) {
      case 'revenue': return '#3B82F6';
      case 'deals': return '#10B981';
      case 'contacts': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  // Get chart label
  const getChartLabel = () => {
    switch (chartType) {
      case 'revenue': return 'รายได้';
      case 'deals': return 'ยอดขาย';
      case 'contacts': return 'ลูกค้าติดต่อ';
      default: return 'รายได้';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">ยอดขายเซลล์</h3>
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={chartType}
          onChange={(e) => handleChartTypeChange(e.target.value as 'revenue' | 'deals' | 'contacts')}
        >
          <option value="revenue">รายได้</option>
          <option value="deals">จำนวนดีล</option>
          <option value="contacts">ลูกค้าติดต่อ</option>
        </select>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">รายได้รวม</div>
            <div className="text-lg font-semibold">฿{(summary.totalRevenue || 0).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">ยอดขายรวม</div>
            <div className="text-lg font-semibold">{(summary.totalSales || 0).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">ลูกค้าติดต่อ</div>
            <div className="text-lg font-semibold">{(summary.totalContacts || 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              chartType === 'revenue' ? `฿${Number(value).toLocaleString()}` : Number(value).toLocaleString(),
              getChartLabel()
            ]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={getDataKey()} 
              stroke={getChartColor()} 
              strokeWidth={2} 
              name={getChartLabel()} 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">
            {loading ? 'กำลังโหลดข้อมูล...' : 'ไม่มีข้อมูลยอดขายในช่วงเวลาที่เลือก'}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesRevenueChart;
