import React, { useState, useEffect } from 'react';
import { FileText, Calculator, Send, Check, BarChart3, MapPin, Box, Truck, FileCheck, Ship } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

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
  const [csData, setCsData] = useState<CSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCSData();
  }, [dateFilter]);

  const fetchCSData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      const mockData: CSData = {
        newRequests: 45,
        quotations: 38,
        proposals: 32,
        acceptedJobs: 28,
        shipmentAnalysis: [
          { id: 'Import', label: 'Import', value: 65, color: 'hsl(210, 70%, 50%)' },
          { id: 'Export', label: 'Export', value: 35, color: 'hsl(30, 70%, 50%)' },
        ],
        portAnalysis: [
          { port: 'กรุงเทพ', import: 25, export: 15 },
          { port: 'ลาดกระบัง', import: 20, export: 12 },
          { port: 'แหลมฉบัง', import: 15, export: 8 },
          { port: 'เชียงใหม่', import: 5, export: 0 },
        ],
        productTypes: [
          { id: 'อิเล็กทรอนิกส์', label: 'อิเล็กทรอนิกส์', value: 30 },
          { id: 'เสื้อผ้า', label: 'เสื้อผ้า', value: 25 },
          { id: 'อาหาร', label: 'อาหาร', value: 20 },
          { id: 'เครื่องจักร', label: 'เครื่องจักร', value: 15 },
          { id: 'อื่นๆ', label: 'อื่นๆ', value: 10 },
        ],
        containerStatus: [
          { status: 'รอจองตู้', count: 12 },
          { status: 'จองแล้ว', count: 18 },
          { status: 'รอรับตู้', count: 8 },
          { status: 'ได้รับตู้แล้ว', count: 15 },
        ],
        documentStatus: [
          { status: 'รอจัดทำ', count: 10 },
          { status: 'กำลังจัดทำ', count: 15 },
          { status: 'เสร็จสิ้น', count: 25 },
        ],
        departureStatus: [
          { status: 'รอออกเดินทาง', count: 8 },
          { status: 'กำลังขนส่ง', count: 12 },
          { status: 'ถึงปลายทางแล้ว', count: 20 },
        ],
        deliveryStatus: [
          { status: 'รอจัดส่ง', count: 5 },
          { status: 'กำลังจัดส่ง', count: 8 },
          { status: 'จัดส่งเสร็จสิ้น', count: 27 },
        ],
      };

      setCsData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching CS data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <div className="mt-4">
            <span className="text-sm text-green-600">+5 จากสัปดาห์ที่แล้ว</span>
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
          <div className="mt-4">
            <span className="text-sm text-green-600">+3 จากสัปดาห์ที่แล้ว</span>
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
          <div className="mt-4">
            <span className="text-sm text-green-600">+2 จากสัปดาห์ที่แล้ว</span>
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
          <div className="mt-4">
            <span className="text-sm text-green-600">+4 จากสัปดาห์ที่แล้ว</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">วิเคราะห์ Shipment</h3>
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={csData?.shipmentAnalysis || []}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
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

        {/* Port Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">วิเคราะห์ Port</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={csData?.portAnalysis || []}
              keys={['import', 'export']}
              indexBy="port"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Port',
                legendPosition: 'middle',
                legendOffset: 32
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
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              role="application"
              ariaLabel="Port analysis bar chart"
              barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in port: "+e.indexValue}}
            />
          </div>
        </div>
      </div>

      {/* Product Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ประเภทสินค้า</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {csData?.productTypes.map((product, index) => (
            <div key={product.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{product.value}</div>
              <div className="text-sm text-gray-600 mt-1">{product.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Container Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจองตู้</h3>
          </div>
          <div className="space-y-3">
            {csData?.containerStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <FileCheck className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจัดทำเอกสาร</h3>
          </div>
          <div className="space-y-3">
            {csData?.documentStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
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
            {csData?.departureStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">สถานะจัดส่งปลายทาง</h3>
          </div>
          <div className="space-y-3">
            {csData?.deliveryStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <span className="text-lg font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCSDashboard;
