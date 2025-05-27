'use client';

import React, { useState, useEffect } from 'react';
import axios from '../../../../axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FormSelect } from '@/components/Base/Form';
import Button from '@/components/Base/Button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardComponent: React.FC = () => {
  // State for filter
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  
  // State for data
  const [monthlyCommissionData, setMonthlyCommissionData] = useState<any>({});
  const [typeCommissionData, setTypeCommissionData] = useState<any>({});
  const [salesCommissionData, setSalesCommissionData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(true);
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
        const values = Array(12).fill(0);
        
        // Fill in values from API response
        monthlyData.forEach((item: any) => {
          const monthIndex = parseInt(item.month) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            values[monthIndex] = parseFloat(item.totalCommission || 0);
          }
        });

        setMonthlyCommissionData({
          labels,
          datasets: [
            {
              label: 'ค่าคอมมิชชั่นรวม (บาท)',
              data: values,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgb(53, 162, 235)',
              borderWidth: 1
            }
          ]
        });
      }

      // Process commission by type data
      if (typeResponse.data && typeResponse.data.success) {
        const typeData = typeResponse.data.data || [];
        
        // Prepare data for chart
        const labels = typeData.map((item: any) => item.type || 'ไม่ระบุ');
        const values = typeData.map((item: any) => parseFloat(item.totalCommission || 0));

        setTypeCommissionData({
          labels,
          datasets: [
            {
              label: 'ค่าคอมมิชชั่นตามประเภท (บาท)',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        });
      }

      // Process sales commission data
      if (salesResponse.data && salesResponse.data.success) {
        const salesData = salesResponse.data.data || [];
        
        // Prepare data for chart
        const labels = salesData.map((item: any) => item.fullname || 'ไม่ระบุ');
        const values = salesData.map((item: any) => parseFloat(item.totalCommission || 0));

        setSalesCommissionData({
          labels,
          datasets: [
            {
              label: 'ค่าคอมมิชชั่นตามพนักงานขาย (บาท)',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            }
          ]
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterYear(e.target.value);
  };

  // Fetch data on component mount and when filter changes
  useEffect(() => {
    fetchDashboardData();
  }, [filterYear]);

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  // Horizontal bar chart options for sales commission
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // This makes the bar chart horizontal
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,

      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold mb-4 md:mb-0">HR Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">ปี:</label>
            <FormSelect
              value={filterYear}
              onChange={handleYearChange}
              className="w-32"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </FormSelect>
          </div>
          
          <Button
            variant="outline-secondary"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                กำลังโหลด...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                รีเฟรช
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Commission Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ค่าคอมมิชชั่นประจำเดือน (ปี {filterYear})</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : monthlyCommissionData.labels ? (
            <div style={{ height: '250px' }}>
              <Bar data={monthlyCommissionData} options={barOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              ไม่พบข้อมูล
            </div>
          )}
        </div>

        {/* Commission by Type Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ค่าคอมมิชชั่นแยกตามประเภท (ปี {filterYear})</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : typeCommissionData.labels && typeCommissionData.labels.length > 0 ? (
            <div style={{ height: '250px' }}>
              <Pie data={typeCommissionData} options={pieOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              ไม่พบข้อมูล
            </div>
          )}
        </div>
      </div>

      {/* Sales Commission Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">ค่าคอมมิชชั่นแยกตามพนักงานขาย (ปี {filterYear})</h3>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : salesCommissionData.labels && salesCommissionData.labels.length > 0 ? (
          <div style={{ height: '350px' }}>
            <Bar data={salesCommissionData} options={horizontalBarOptions} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            ไม่พบข้อมูล
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-700 font-medium mb-1">ค่าคอมมิชชั่นรวมทั้งปี</h4>
          <p className="text-2xl font-bold text-blue-800">
            {loading ? (
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin inline" />
            ) : monthlyCommissionData.datasets ? (
              formatCurrency(monthlyCommissionData.datasets[0].data.reduce((a: number, b: number) => a + b, 0))
            ) : (
              '฿0'
            )}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-green-700 font-medium mb-1">จำนวนพนักงานขายที่ได้รับคอมมิชชั่น</h4>
          <p className="text-2xl font-bold text-green-800">
            {loading ? (
              <RefreshCw className="w-5 h-5 text-green-500 animate-spin inline" />
            ) : salesCommissionData.labels ? (
              `${salesCommissionData.labels.length} คน`
            ) : (
              '0 คน'
            )}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-purple-700 font-medium mb-1">ประเภทงานที่มีค่าคอมมิชชั่นสูงสุด</h4>
          <p className="text-2xl font-bold text-purple-800">
            {loading ? (
              <RefreshCw className="w-5 h-5 text-purple-500 animate-spin inline" />
            ) : typeCommissionData.datasets && typeCommissionData.labels ? (
              (() => {
                const data = typeCommissionData.datasets[0].data;
                const maxIndex = data.indexOf(Math.max(...data));
                return maxIndex >= 0 ? typeCommissionData.labels[maxIndex] : 'ไม่มีข้อมูล';
              })()
            ) : (
              'ไม่มีข้อมูล'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
