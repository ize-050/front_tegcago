'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, ZoomIn, Settings } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveMarimekko } from '@nivo/marimekko';
import axios from '../../../../axios';
import ShipmentLineChart from '../../Charts/ShipmentLineChart';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    type?: string;
  }[];
}

interface SaleDashboardChartsProps {
  loading?: boolean;
  filters?: {
    salespersonId?: string;
    year?: number;
    month?: number;
  };
}

/**
 * Sale Dashboard Charts Component
 * 
 * Features:
 * - Revenue Trend Chart (Line chart with multiple series)
 * - Job Volume Chart (Stacked bar chart by salesperson)
 * - Job Type Distribution (Pie chart with percentages)
 * - Monthly Performance (Mixed chart: bars + lines)
 * - Interactive tooltips and legends
 * - Chart controls (download, zoom, settings)
 */
const SaleDashboardCharts: React.FC<SaleDashboardChartsProps> = ({
  loading = false,
  filters = {}
}) => {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [drillDownModal, setDrillDownModal] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<any[]>([]);
  
  // API Data States
  const [salesChartData, setSalesChartData] = useState<any>(null);
  const [shipmentChartData, setShipmentChartData] = useState<any>(null);
  const [jobTypeMonthlyTrend, setJobTypeMonthlyTrend] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // API Functions
  const fetchChartData = async () => {
    setApiLoading(true);
    setApiError(null);
    
    try {

   
      
      const [salesResponse, shipmentResponse, trendResponse] = await Promise.all([
        axios.get('http://localhost:3000/dashboard/sale/sales-chart', { 
      
          params: filters 
        }),
        axios.get('http://localhost:3000/dashboard/sale/shipment-chart', { 
      
          params: filters 
        }),
        axios.get('http://localhost:3000/dashboard/sale/job-type-monthly-trend', { 
       
          params: filters 
        })
      ]);
      
      setSalesChartData(salesResponse.data.data);
      setShipmentChartData(shipmentResponse.data.data);
      setJobTypeMonthlyTrend(trendResponse.data.data);
      
    } catch (error: any) {
      console.error('Error fetching chart data:', error);
      setApiError(error.response?.data?.message || 'Failed to fetch chart data');
    } finally {
      setApiLoading(false);
    }
  };
  
  useEffect(() => {
    fetchChartData();
  }, []);
  
  // Mock chart data - fallback when API data is not available
  const revenueChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Import Revenue',
        data: [400, 450, 500, 600, 550, 650],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        type: 'line'
      },
      {
        label: 'Export Revenue',
        data: [300, 350, 400, 450, 400, 500],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        type: 'line'
      },
      {
        label: 'SEA Transport',
        data: [250, 300, 350, 420, 380, 450],
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        type: 'line'
      },
      {
        label: 'AIR Transport',
        data: [200, 250, 300, 280, 320, 350],
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        type: 'line'
      }
    ]
  };

  const jobVolumeChartData: ChartData = {
    labels: ['Sale A', 'Sale B', 'Sale C', 'Sale D', 'Sale E'],
    datasets: [
      {
        label: 'Import',
        data: [12, 10, 8, 7, 6],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Export',
        data: [8, 7, 6, 5, 4],
        backgroundColor: '#10B981'
      },
      {
        label: 'SEA',
        data: [10, 8, 7, 6, 5],
        backgroundColor: '#F59E0B'
      },
      {
        label: 'AIR',
        data: [6, 5, 4, 3, 3],
        backgroundColor: '#EF4444'
      },
      {
        label: 'ALL IN',
        data: [4, 3, 3, 2, 2],
        backgroundColor: '#8B5CF6'
      },
      {
        label: 'CIF',
        data: [3, 2, 2, 2, 1],
        backgroundColor: '#06B6D4'
      }
    ]
  };

  const jobDistributionData = [
    { id: 'Import', label: 'Import', value: 26, color: '#3B82F6' },
    { id: 'Export', label: 'Export', value: 17, color: '#10B981' },
    { id: 'SEA', label: 'SEA', value: 21, color: '#F59E0B' },
    { id: 'AIR', label: 'AIR', value: 22, color: '#EF4444' },
    { id: 'ALL IN', label: 'ALL IN', value: 17, color: '#8B5CF6' },
    { id: 'CIF', label: 'CIF', value: 11, color: '#06B6D4' },
    { id: 'FOB', label: 'FOB', value: 8, color: '#84CC16' },
    { id: 'EXW', label: 'EXW', value: 5, color: '#F97316' }
  ];

  // Mock job type data for fallback
  const jobTypeData = [
    { jobType: 'Import', count: 26 },
    { jobType: 'Export', count: 17 },
    { jobType: 'SEA', count: 21 },
    { jobType: 'AIR', count: 22 },
    { jobType: 'ALL IN', count: 17 },
    { jobType: 'CIF', count: 11 },
    { jobType: 'FOB', count: 8 },
    { jobType: 'EXW', count: 5 }
  ];

  const getDrillDownData = (jobType: string) => {
    const drillDownMap: { [key: string]: any[] } = {
      'Import': [
        { id: 'Import-SEA', label: 'Import-SEA', value: 15, color: '#1E40AF', jobs: [
          { id: 'job_001', customer: 'ABC Company', route: 'CN→TH SEA', value: '45K', status: 'ปิดการขาย' },
          { id: 'job_002', customer: 'XYZ Trading', route: 'VN→TH SEA', value: '38K', status: 'ปิดการขาย' },
          { id: 'job_003', customer: 'DEF Logistics', route: 'JP→TH SEA', value: '52K', status: 'ปิดการขาย' }
        ]},
        { id: 'Import-AIR', label: 'Import-AIR', value: 11, color: '#3B82F6', jobs: [
          { id: 'job_004', customer: 'Fast Import Co', route: 'CN→TH AIR', value: '65K', status: 'Sale ตีราคา' },
          { id: 'job_005', customer: 'Quick Logistics', route: 'JP→TH AIR', value: '58K', status: 'ปิดการขาย' }
        ]}
      ],
      'Export': [
        { id: 'Export-SEA', label: 'Export-SEA', value: 9, color: '#059669', jobs: [
          { id: 'job_006', customer: 'Export Pro', route: 'TH→CN SEA', value: '42K', status: 'ปิดการขาย' }
        ]},
        { id: 'Export-AIR', label: 'Export-AIR', value: 8, color: '#10B981', jobs: [
          { id: 'job_007', customer: 'Air Export Ltd', route: 'TH→JP AIR', value: '75K', status: 'Financial' }
        ]}
      ],
      'SEA': [
        { id: 'SEA-Import', label: 'SEA-Import', value: 15, color: '#D97706' },
        { id: 'SEA-Export', label: 'SEA-Export', value: 6, color: '#F59E0B' }
      ],
      'AIR': [
        { id: 'AIR-Import', label: 'AIR-Import', value: 11, color: '#DC2626' },
        { id: 'AIR-Export', label: 'AIR-Export', value: 11, color: '#EF4444' }
      ]
    };
    return drillDownMap[jobType] || [];
  };

  const handlePieChartClick = (data: any) => {
    const jobType = data.id;
    const breakdown = getDrillDownData(jobType);
    
    if (breakdown.length > 0) {
      setSelectedJobType(jobType);
      setDrillDownData(breakdown);
      setDrillDownModal(true);
    }
  };

  const handleLegendClick = (jobType: string) => {
    handlePieChartClick({ id: jobType });
  };

  const monthlyPerformanceData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Job Count',
        data: [45, 52, 48, 61, 55, 67],
        backgroundColor: '#3B82F6',
        type: 'bar'
      },
      {
        label: 'Revenue (M)',
        data: [1.8, 2.1, 1.9, 2.4, 2.2, 2.7],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        type: 'line'
      },
      {
        label: 'Avg Value (K)',
        data: [40, 42, 39, 45, 43, 48],
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        type: 'line'
      }
    ]
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const ChartControls = ({ chartId }: { chartId: string }) => (
    <div className="flex items-center space-x-2">
      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
        <Download className="h-4 w-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );

  // Chart rendering functions
  const renderLineChart = () => {
    // Use API data if available, otherwise fallback to mock data
    const chartData = salesChartData?.chartData || [
      {
        id: 'ยอดขาย',
        color: 'hsl(210, 70%, 50%)',
        data: revenueChartData.labels.map((label, index) => ({
          x: label,
          y: revenueChartData.datasets[0].data[index]
        }))
      }
    ];

    return (
      <div className="h-80">
        {apiLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : apiError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">เกิดข้อผิดพลาด: {apiError}</div>
          </div>
        ) : (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'เดือน',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ยอดขาย (บาท)',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        )}
      </div>
    );
  };

  const renderPieChart = () => {
    // Use API data if available, otherwise fallback to mock data
    const pieData = shipmentChartData?.pieData || jobTypeData.map((item: any, index: number) => ({
      id: item.jobType,
      label: item.jobType,
      value: item.count,
      color: `hsl(${index * 45}, 70%, 50%)`
    }));

    return (
      <div className="h-80">
        {apiLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : apiError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">เกิดข้อผิดพลาด: {apiError}</div>
          </div>
        ) : (
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  0.2
                ]
              ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  2
                ]
              ]
            }}
            onClick={(node) => handlePieChartClick(node)}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
                    }
                  }
                ]
              }
            ]}
          />
        )}
      </div>
    );
  };

  const renderMarimekkoChart = () => {
    // Use API data if available, otherwise fallback to mock data
    const marimekkoData = jobTypeMonthlyTrend?.marimekkoData || jobTypeData.map((item: any) => ({
      statement: item.jobType,
      participation: item.count,
      stronglyAgree: Math.floor(item.count * 0.4),
      agree: Math.floor(item.count * 0.3),
      disagree: Math.floor(item.count * 0.2),
      stronglyDisagree: Math.floor(item.count * 0.1)
    }));

    return (
      <div className="h-80">
        {apiLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : apiError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">เกิดข้อผิดพลาด: {apiError}</div>
          </div>
        ) : (
          <ResponsiveMarimekko
            data={marimekkoData}
            id="statement"
            value="participation"
            dimensions={[
              {
                id: 'stronglyAgree',
                value: 'stronglyAgree'
              },
              {
                id: 'agree',
                value: 'agree'
              },
              {
                id: 'disagree',
                value: 'disagree'
              },
              {
                id: 'stronglyDisagree',
                value: 'stronglyDisagree'
              }
            ]}
            innerPadding={9}
            axisTop={null}
            axisRight={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: 0
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ประเภทงาน',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'จำนวน',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'nivo' }}
            borderWidth={0}
            borderColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  0.2
                ]
              ]
            }}
            legends={[
              {
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -40,
                itemsSpacing: 0,
                itemWidth: 80,
                itemHeight: 14,
                itemTextColor: '#999',
                itemDirection: 'right-to-left',
                itemOpacity: 1,
                symbolSize: 14,
                symbolShape: 'square'
              }
            ]}
          />
        )}
      </div>
    );
  };

  // Mock data - will be replaced with API data
  const mockDrillDownData: { [key: string]: any[] } = {
    'Import': [
      { category: 'SEA Import', count: 15, percentage: 60 },
      { category: 'AIR Import', count: 10, percentage: 40 }
    ],
    'Export': [
      { category: 'SEA Export', count: 12, percentage: 70 },
      { category: 'AIR Export', count: 5, percentage: 30 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                📈 Sales Revenue Trend
              </h3>
              <p className="text-sm text-gray-500">Monthly revenue breakdown</p>
            </div>
            <ChartControls chartId="revenue-trend" />
          </div>
          
          {renderLineChart()}
        </div>

        {/* Job Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                🥧 Job Type Distribution
              </h3>
              <p className="text-sm text-gray-500">Percentage breakdown by type</p>
            </div>
            <ChartControls chartId="job-distribution" />
          </div>
          
          {renderPieChart()}
        </div>

        {/* Job Volume Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                📊 Job Volume by Type
              </h3>
              <p className="text-sm text-gray-500">Volume breakdown by category</p>
            </div>
            <ChartControls chartId="job-volume" />
          </div>
          
          {renderMarimekkoChart()}
        </div>

        {/* Shipment by Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Shipment by Sales
              </h3>
              <p className="text-sm text-gray-500">Shipment volume by salesperson and type</p>
            </div>
            <ChartControls chartId="shipment-by-sales" />
          </div>
          
          <ShipmentLineChart height={300} showFilters={false} />
        </div>
      </div>

      {/* Drill-down Modal */}
      {drillDownModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    📊 {selectedJobType} Job Breakdown
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Detailed breakdown and individual job list
                  </p>
                </div>
                <button
                  onClick={() => setDrillDownModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Breakdown Chart */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {selectedJobType} Sub-categories
                  </h4>
                  <div className="h-64">
                    <ResponsivePie
                      data={drillDownData}
                      margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                      innerRadius={0.3}
                      padAngle={0.7}
                      cornerRadius={3}
                      colors={{ datum: 'data.color' }}
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#333333"
                      arcLabelsSkipAngle={10}
                      tooltip={({ datum }) => (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: datum.color }}></div>
                            <span className="font-medium">{datum.label}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Jobs: {datum.value}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Job List Table */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Individual Jobs
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {drillDownData.flatMap(category => 
                          category.jobs ? category.jobs.map((job: any) => (
                            <tr key={job.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {job.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {job.customer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {job.route}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {job.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  job.status === 'ปิดการขาย' ? 'bg-green-100 text-green-800' :
                                  job.status === 'Financial' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {job.status}
                                </span>
                              </td>
                            </tr>
                          )) : []
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setDrillDownModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Chart Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Chart Integration Note</h4>
            <p className="text-sm text-blue-700 mt-1">
              Charts are now integrated with real-time data from the Sale Dashboard API. 
              Each chart supports interactive tooltips, legends, and export functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDashboardCharts;
