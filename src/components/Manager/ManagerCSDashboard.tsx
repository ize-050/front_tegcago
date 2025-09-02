import React, { useState, useEffect } from 'react';
import { FileText, Calculator, Send, Check, BarChart3, MapPin, Box, Truck, FileCheck, Ship, ChevronDown } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import CSDashboardService, { CompleteCSDashboardData, CSFilters } from '../../services/dashboard/cs-dashboard.service';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'day' | 'month' | 'year';
}

interface ManagerCSDashboardProps {
  dateFilter: DateFilter;
}

interface CSData {
  newRequests: number;
  quotations: number;
  proposals: number;
  acceptedJobs: number;
  shipmentAnalysis: any[];
  portAnalysis: any[];
  productTypes: any[];
  containerStatus: any[];
  documentStatus: any[];
  departureStatus: any[];
  deliveryStatus: any[];
}

const ManagerCSDashboard: React.FC<ManagerCSDashboardProps> = ({ dateFilter }) => {
  const [dashboardData, setDashboardData] = useState<CompleteCSDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Date filter states - เริ่มต้นด้วยเดือนกุมภาพันธ์ 2025 ที่มีข้อมูล
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(2);
  const [filterType, setFilterType] = useState<'month' | 'year'>('month');

  useEffect(() => {
    fetchCSData();
  }, [dateFilter, selectedYear, selectedMonth, filterType]);

  const fetchCSData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate date range based on filter type
      let startDate: string;
      let endDate: string;
      
      if (filterType === 'month') {
        // Filter by specific month and year
        startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
        endDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${lastDay}`;
      } else {
        // Filter by entire year
        startDate = `${selectedYear}-01-01`;
        endDate = `${selectedYear}-12-31`;
      }
      
      const filters: CSFilters = {
        startDate,
        endDate
      };

      console.log('Fetching CS Dashboard data with filters:', filters);

      // Use complete dashboard endpoint instead of multiple calls
      const data = await CSDashboardService.getCompleteDashboard(filters);
      
      console.log('Received dashboard data:', data);
      
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching CS dashboard data:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // Transform data for compatibility with existing UI
  const getTransformedData = () => {
    if (!dashboardData) return null;

    // Transform shipment analysis for multiple charts
    const shipmentData = dashboardData.shipmentAnalysis || {};
    const transportData = shipmentData.transport?.map((item: any) => ({
      id: item.transport,
      label: item.transport,
      value: item.count,
      color: item.transport === 'SEA' ? '#0088FE' : '#00C49F'
    })) || [];

    const termData = shipmentData.term?.map((item: any, index: number) => ({
      id: item.term,
      label: item.term,
      value: item.count,
      color: `hsl(${index * 60}, 70%, 50%)`
    })) || [];

    const routeData = shipmentData.route?.map((item: any, index: number) => ({
      id: item.route,
      label: item.route,
      value: item.count,
      color: `hsl(${index * 120}, 70%, 50%)`
    })) || [];

    const groupWorkData = shipmentData.groupWork?.map((item: any, index: number) => ({
      id: item.groupWork,
      label: item.groupWork,
      value: item.count,
      color: `hsl(${index * 45}, 70%, 50%)`
    })) || [];

    const jobTypeData = shipmentData.jobType?.map((item: any, index: number) => ({
      id: item.jobType,
      label: item.jobType,
      value: item.count,
      color: `hsl(${index * 30}, 70%, 50%)`
    })) || [];

    // Transform port analysis for bar chart with distinct colors
    const portData = dashboardData.portAnalysis || {};
    
    // Origin ports - Professional Blue colors
    const originColors = ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
    const originPorts = portData.origin?.slice(0, 8).map((item: any, index: number) => ({
      port: item.port.length > 15 ? item.port.substring(0, 15) + '...' : item.port,
      count: item.count,
      fullName: item.port,
      color: originColors[index] || '#1e3a8a'
    })) || [];

    // Destination ports - Professional Green colors
    const destinationColors = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];
    const destinationPorts = portData.destination?.slice(0, 8).map((item: any, index: number) => ({
      port: item.port.length > 15 ? item.port.substring(0, 15) + '...' : item.port,
      count: item.count,
      fullName: item.port,
      color: destinationColors[index] || '#14532d'
    })) || [];

    return {
      newRequests: dashboardData.kpis?.newRequests || 0,
      quotations: dashboardData.kpis?.quotations || 0,
      proposals: dashboardData.kpis?.proposals || 0,
      acceptedJobs: dashboardData.kpis?.acceptedJobs || 0,
      
      // Shipment analysis data (5 ส่วน)
      routeAnalysis: routeData,
      transportAnalysis: transportData,
      termAnalysis: termData,
      groupWorkAnalysis: groupWorkData,
      jobTypeAnalysis: jobTypeData,
      
      // Port analysis data
      originPorts: originPorts,
      destinationPorts: destinationPorts,
      
      // Product types and status tracking
      productTypes: dashboardData.productTypeAnalysis?.productTypes || [],
      statusTracking: dashboardData.statusTracking || {}
    };
  };

  const csData = getTransformedData();
  
  // Debug logging - ตรวจสอบข้อมูลที่ได้รับ
  console.log('=== CS Dashboard Debug ===');
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Dashboard Data:', dashboardData);
  console.log('Shipment Analysis:', dashboardData?.shipmentAnalysis);
  console.log('Port Analysis:', dashboardData?.portAnalysis);
  console.log('Transformed CS Data:', csData);
  
  if (csData) {
    console.log('Route Analysis Data:', csData.routeAnalysis);
    console.log('Transport Analysis Data:', csData.transportAnalysis);
    console.log('Term Analysis Data:', csData.termAnalysis);
    console.log('Group Work Analysis Data:', csData.groupWorkAnalysis);
    console.log('Job Type Analysis Data:', csData.jobTypeAnalysis);
    console.log('Origin Ports Data:', csData.originPorts);
    console.log('Destination Ports Data:', csData.destinationPorts);
  }
  console.log('=== End Debug ===');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-2">เกิดข้อผิดพลาด</div>
          <div className="text-sm text-gray-500 mb-4">{error}</div>
          <button 
            onClick={fetchCSData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!csData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">ไม่มีข้อมูล</div>
      </div>
    );
  }

  // Generate year options (current year and previous 5 years)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 6; i++) {
    yearOptions.push(currentYear - i);
  }

  // Month options
  const monthOptions = [
    { value: 1, label: 'มกราคม' },
    { value: 2, label: 'กุมภาพันธ์' },
    { value: 3, label: 'มีนาคม' },
    { value: 4, label: 'เมษายน' },
    { value: 5, label: 'พฤษภาคม' },
    { value: 6, label: 'มิถุนายน' },
    { value: 7, label: 'กรกฎาคม' },
    { value: 8, label: 'สิงหาคม' },
    { value: 9, label: 'กันยายน' },
    { value: 10, label: 'ตุลาคม' },
    { value: 11, label: 'พฤศจิกายน' },
    { value: 12, label: 'ธันวาคม' }
  ];

  return (
    <div className="space-y-6">
      {/* Date Filter Controls - Professional UI */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap items-center gap-6">
          {/* Filter Type */}
          <div className="flex items-end space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mb-1">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">ประเภทการกรอง</label>
              <div className="relative">
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value as 'month' | 'year')}
                  className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700 font-medium cursor-pointer w-[160px]"
                >
                  <option value="month">รายเดือน</option>
                  <option value="year">รายปี</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Year Selection */}
          <div className="flex items-end space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg mb-1">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">เลือกปี</label>
              <div className="relative">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700 font-medium cursor-pointer w-[160px]"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Month Selection */}
          {filterType === 'month' && (
            <div className="flex items-end space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg mb-1">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">เลือกเดือน</label>
                <div className="relative">
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700 font-medium cursor-pointer w-[160px]"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
          
          {/* Current Selection Display */}
          <div className="flex items-center space-x-3 ml-auto">
            <div className="bg-white px-5 py-3 rounded-lg shadow-sm border-l-4 border-slate-600">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">ข้อมูลที่แสดง</div>
              <div className="text-sm font-bold text-slate-700">
                {filterType === 'month' 
                  ? `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                  : `ทั้งปี ${selectedYear}`
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">CS Dashboard</h2>
          <p className="text-sm text-gray-500">ภาพรวมงานฝ่าย Customer Service</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">คำขอใหม่จากฝ่ายขาย</p>
              <p className="text-2xl font-bold text-gray-900">{csData?.newRequests}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ตีราคา</p>
              <p className="text-2xl font-bold text-gray-900">{csData?.quotations}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calculator className="h-6 w-6 text-orange-600" />
            </div>
          </div>
         
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">เสนอราคา</p>
              <p className="text-2xl font-bold text-gray-900">{csData?.proposals}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Send className="h-6 w-6 text-purple-600" />
            </div>
          </div>
       
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">รับงาน</p>
              <p className="text-2xl font-bold text-gray-900">{csData?.acceptedJobs}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        
        </div>
      </div>

      {/* Shipment Analysis - 5 ส่วน */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">วิเคราะห์ Shipment</h2>
        
        {/* แถวที่ 1: Route, Transport, Term */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Route Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={csData?.routeAnalysis || []}
                margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </div>
          </div>

          {/* Transport Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ขนส่ง</h3>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={csData?.transportAnalysis || []}
                margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </div>
          </div>

          {/* Term Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Term</h3>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={csData?.termAnalysis || []}
                margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </div>
          </div>
        </div>

        {/* แถวที่ 2: Group Work, Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Work Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">รูปแบบงาน</h3>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={csData?.groupWorkAnalysis || []}
                margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </div>
          </div>

          {/* Job Type Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ประเภทงาน</h3>
            <div style={{ height: '250px' }}>
              <ResponsivePie
                data={csData?.jobTypeAnalysis || []}
                margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.4}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Port Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Origin Ports Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Port ต้นทาง</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={csData?.originPorts || []}
              keys={['count']}
              indexBy="port"
              margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'blues' }}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Port ต้นทาง',
                legendPosition: 'middle',
                legendOffset: 80
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'จำนวน',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              role="application"
              barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in port: "+e.indexValue}}
            />
          </div>
        </div>

        {/* Destination Ports Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Port ปลายทาง</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={csData?.destinationPorts || []}
              keys={['count']}
              indexBy="port"
              margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'greens' }}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Port ปลายทาง',
                legendPosition: 'middle',
                legendOffset: 80
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'จำนวน',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              role="application"
              barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in port: "+e.indexValue}}
            />
          </div>
        </div>
      </div>

      {/* Product Types */}
   

      {/* Status Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Container Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจองตู้</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{(csData?.statusTracking as any)?.containerStatus?.label || 'สถานะจองตู้'}</span>
              <span className="text-lg font-bold text-gray-900">{(csData?.statusTracking as any)?.containerStatus?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <FileCheck className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจัดทำเอกสาร</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{(csData?.statusTracking as any)?.documentStatus?.label || 'สถานะจัดทำเอกสาร'}</span>
              <span className="text-lg font-bold text-gray-900">{(csData?.statusTracking as any)?.documentStatus?.total || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tables Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departure Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Ship className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะรออกเดินทาง</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{(csData?.statusTracking as any)?.departureStatus?.label || 'สถานะรออกเดินทาง'}</span>
              <span className="text-lg font-bold text-gray-900">{(csData?.statusTracking as any)?.departureStatus?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจัดส่งปลายทาง</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{(csData?.statusTracking as any)?.deliveryStatus?.label || 'สถานะจัดส่งปลายทาง'}</span>
              <span className="text-lg font-bold text-gray-900">{(csData?.statusTracking as any)?.deliveryStatus?.total || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCSDashboard;
