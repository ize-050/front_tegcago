'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import axios from '../../../axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Color palette for different job types
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
];

interface FilterState {
  salespersonId: string;
  year: number;
  startMonth: number;
  endMonth: number;
}

interface ChartDataPoint {
  x: string;
  y: number;
  jobType: string;
  saleName: string;
}

interface ShipmentChartResponse {
  success: boolean;
  data: {
    chartType: string;
    chartData: any[];
    summary: {
      totalShipments: number;
      totalValue: number;
      averageShipmentsPerMonth: number;
    };
    filters: {
      selectedSalesperson: string;
      selectedYear: number;
      monthRange: { start: number; end: number };
      availableSalespersons: Array<{
        id: string;
        name: string;
        email: string;
        roles_name: string;
      }>;
    };
    metadata: any;
  };
  message: string;
}

interface ShipmentLineChartProps {
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

const ShipmentLineChart: React.FC<ShipmentLineChartProps> = ({ 
  height = 400,
  showFilters = true,
  filters: externalFilters
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [availableSalespersons, setAvailableSalespersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    salespersonId: 'all',
    year: 2025,
    startMonth: 1,
    endMonth: 12
  });

  // Fetch shipment chart data
  const fetchShipmentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use external filters if provided, otherwise use internal filters
      const apiParams = externalFilters ? {
        salespersonId: externalFilters.salespersonId === 'all' ? undefined : externalFilters.salespersonId,
        year: externalFilters.year,
        month: externalFilters.month,
        startDate: externalFilters.startDate,
        endDate: externalFilters.endDate
      } : {
        salespersonId: filters.salespersonId === 'all' ? undefined : filters.salespersonId,
        year: filters.year,
        startMonth: filters.startMonth,
        endMonth: filters.endMonth
      };

      const response = await axios.get<ShipmentChartResponse>('/manager/dashboard/sale/shipment-chart', {
        params: apiParams
      });

      console.log('=== FRONTEND DEBUG ===');
      console.log('API Response:', response.data);
      console.log('Response success:', response.data.success);
      console.log('Response data:', response.data.data);

      if (response.data.success) {
        const { chartData, summary, metadata, filters: responseFilters } = response.data.data;
        
        console.log('chartData:', chartData);
        console.log('availableSalespersons:', responseFilters?.availableSalespersons);
        
        setChartData(chartData);
        setSummary(summary);
        setMetadata(metadata);
        setAvailableSalespersons(responseFilters?.availableSalespersons || []);
      } else {
        setError('Failed to fetch shipment data');
      }
    } catch (err: any) {
      console.error('Error fetching shipment data:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchShipmentData();
  }, [filters, externalFilters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchShipmentData();
  };

  // Handle export (placeholder)
  const handleExport = () => {
    console.log('Export functionality to be implemented');
  };

  // Process chart data - API already sends formatted data
  const processChartData = (apiData: any[]) => {
    console.log('=== PROCESSING CHART DATA ===');
    console.log('API data received:', apiData);
    console.log('API data type:', typeof apiData);
    console.log('API data is array:', Array.isArray(apiData));
    
    if (!apiData || apiData.length === 0) {
      console.log('No data available for chart');
      return { labels: [], datasets: [] };
    }

    // Check if data is already in Nivo format (has id, color, data properties)
    const firstItem = apiData[0];
    console.log('First item structure:', firstItem);
    
    if (firstItem && firstItem.id && firstItem.data && Array.isArray(firstItem.data)) {
      console.log('Data is already in chart format, converting to Chart.js format');
      
      // Extract months from first dataset
      const months = firstItem.data.map((item: any) => item.x);
      console.log('Months found:', months);
      
      // Filter out datasets with no data (all zeros)
      const validDatasets = apiData.filter((series: any) => {
        const hasData = series.data.some((point: any) => (point.y || 0) > 0);
        return hasData;
      });
      
      console.log(`Filtered datasets: ${validDatasets.length} out of ${apiData.length} have data`);
      
      // Convert Nivo format to Chart.js format
      const datasets = validDatasets.map((series: any, index: number) => {
        const color = series.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
        const data = series.data.map((point: any) => point.y || 0);
        
        console.log(`Dataset for ${series.id}:`, { data, total: data.reduce((a: number, b: number) => a + b, 0) });
        
        return {
          label: series.id || 'ไม่ระบุ',
          data,
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 3,
          fill: false,
          tension: 0.1,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        };
      });

      // If no valid datasets, show all datasets anyway for debugging
      const finalDatasets = datasets.length > 0 ? datasets : apiData.map((series: any, index: number) => {
        const color = series.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
        const data = series.data.map((point: any) => point.y || 0);
        
        return {
          label: series.id || 'ไม่ระบุ',
          data,
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      });

      const result = {
        labels: months,
        datasets: finalDatasets
      };
      
      console.log('Final processed chart data:', result);
      console.log('Datasets count:', finalDatasets.length);
      console.log('Labels:', result.labels);
      
      return result;
    } else {
      console.log('Data is in raw format, processing...');
      // Handle raw data format (fallback)
      return { labels: [], datasets: [] };
    }
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Shipment Chart by Job Type',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `เดือน: ${context[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} รายการ`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'เดือน',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'จำนวนการจัดส่ง',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    hover: {
      mode: 'index' as const,
      intersect: false,
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Shipment Line Chart</h3>
            <p className="text-sm text-gray-500">ยอดการจัดส่งแยกตามประเภทงาน</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              รีเฟรช
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              ส่งออก
            </button>
          </div>
        </div>
      </div>

      {/* Filters - Only show if showFilters is true and no external filters */}
      {showFilters && !externalFilters && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เซลล์
              </label>
              <select
                value={filters.salespersonId}
                onChange={(e) => handleFilterChange('salespersonId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                {availableSalespersons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ปี
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เดือนเริ่มต้น
              </label>
              <select
                value={filters.startMonth}
                onChange={(e) => handleFilterChange('startMonth', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เดือนสิ้นสุด
              </label>
              <select
                value={filters.endMonth}
                onChange={(e) => handleFilterChange('endMonth', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Shipments</div>
              <div className="text-2xl font-bold text-blue-900">
                {summary.totalShipments?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Value</div>
              <div className="text-2xl font-bold text-green-900">
                ฿{summary.totalValue?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Avg per Month</div>
              <div className="text-2xl font-bold text-purple-900">
                {summary.averageShipmentsPerMonth?.toFixed(1) || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️ เกิดข้อผิดพลาด</div>
              <div className="text-gray-600 text-sm">{error}</div>
              <button
                onClick={handleRefresh}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-center">
              <div className="text-gray-500 mb-2">📊 ไม่มีข้อมูล</div>
              <div className="text-gray-400 text-sm">ไม่พบข้อมูลการจัดส่งในช่วงเวลาที่เลือก</div>
            </div>
          </div>
        ) : (
          <div style={{ height }}>
            <Line 
              data={processChartData(chartData)}
              options={chartOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentLineChart;
