import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Package, TrendingUp, BarChart3, Award, Clock, Check } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveBar } from '@nivo/bar'; // Commented out until @nivo/bar is installed
import { ResponsiveLine } from '@nivo/line';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'day' | 'month' | 'year';
}

interface ManagerHRDashboardProps {
  dateFilter: DateFilter;
}

interface HRData {
  totalCommission: number;
  salesCount: number;
  shipmentCount: number;
  revenueCommissionChart: any[];
  commissionTypes: any[];
  employeePerformance: any[];
  pendingStatus: number;
  paidStatus: number;
  commissionByEmployee: any[];
  monthlyCommission: any[];
}

const ManagerHRDashboard: React.FC<ManagerHRDashboardProps> = ({ dateFilter }) => {
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRData();
  }, [dateFilter]);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      const mockData: HRData = {
        totalCommission: 450000,
        salesCount: 12,
        shipmentCount: 156,
        revenueCommissionChart: [
          {
            id: 'รายได้',
            color: 'hsl(210, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: 2800000 },
              { x: 'ก.พ.', y: 3200000 },
              { x: 'มี.ค.', y: 2900000 },
              { x: 'เม.ย.', y: 3800000 },
              { x: 'พ.ค.', y: 3400000 },
              { x: 'มิ.ย.', y: 4200000 },
            ]
          },
          {
            id: 'ค่าคอมมิชชั่น',
            color: 'hsl(120, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: 140000 },
              { x: 'ก.พ.', y: 160000 },
              { x: 'มี.ค.', y: 145000 },
              { x: 'เม.ย.', y: 190000 },
              { x: 'พ.ค.', y: 170000 },
              { x: 'มิ.ย.', y: 210000 },
            ]
          }
        ],
        commissionTypes: [
          { type: 'Import', commission: 180000 },
          { type: 'Export', commission: 120000 },
          { type: 'Domestic', commission: 80000 },
          { type: 'Special', commission: 70000 },
        ],
        employeePerformance: [
          { name: 'เซลล์ A', shipments: 45, commission: 135000, revenue: 1800000 },
          { name: 'เซลล์ B', shipments: 38, commission: 114000, revenue: 1520000 },
          { name: 'เซลล์ C', shipments: 42, commission: 126000, revenue: 1680000 },
          { name: 'เซลล์ D', shipments: 31, commission: 93000, revenue: 1240000 },
        ],
        pendingStatus: 15,
        paidStatus: 128,
        commissionByEmployee: [
          { id: 'เซลล์ A', label: 'เซลล์ A', value: 135000, color: 'hsl(210, 70%, 50%)' },
          { id: 'เซลล์ B', label: 'เซลล์ B', value: 114000, color: 'hsl(30, 70%, 50%)' },
          { id: 'เซลล์ C', label: 'เซลล์ C', value: 126000, color: 'hsl(120, 70%, 50%)' },
          { id: 'เซลล์ D', label: 'เซลล์ D', value: 93000, color: 'hsl(300, 70%, 50%)' },
        ],
        monthlyCommission: [
          {
            id: 'ค่าคอมมิชชั่น',
            color: 'hsl(120, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: 140000 },
              { x: 'ก.พ.', y: 160000 },
              { x: 'มี.ค.', y: 145000 },
              { x: 'เม.ย.', y: 190000 },
              { x: 'พ.ค.', y: 170000 },
              { x: 'มิ.ย.', y: 210000 },
            ]
          }
        ],
      };

      setHrData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching HR data:', error);
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
          <h2 className="text-xl font-semibold text-gray-900">HR Dashboard</h2>
          <p className="text-sm text-gray-500">ภาพรวมการจัดการทรัพยากรบุคคลและค่าคอมมิชชั่น</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ค่าคอมมิชชั่นรวม</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{hrData?.totalCommission.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวนพนักงานขาย</p>
              <p className="text-2xl font-bold text-gray-900">{hrData?.salesCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+1 คนจากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวน Shipment</p>
              <p className="text-2xl font-bold text-gray-900">{hrData?.shipmentCount}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ค่าคอมเฉลี่ย/คน</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{Math.round((hrData?.totalCommission || 0) / (hrData?.salesCount || 1)).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+5% จากเดือนที่แล้ว</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Commission Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">รายได้และค่าคอมมิชชั่น</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={hrData?.revenueCommissionChart || []}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              yFormat=" >-.0f"
              curve="catmullRom"
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
                legend: 'จำนวนเงิน (บาท)',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={8}
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
          </div>
        </div>

        {/* Commission by Employee */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ค่าคอมมิชชั่นตามพนักงาน</h3>
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={hrData?.commissionByEmployee || []}
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
      </div>

      {/* Commission Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ค่าคอมตามประเภท</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hrData?.commissionTypes.map((type, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">฿{type.commission.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{type.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Performance & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Award className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">ผลงานพนักงาน</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    พนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รายได้
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ค่าคอมมิชชั่น
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อัตราคอม %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hrData?.employeePerformance.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.shipments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ฿{employee.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ฿{employee.commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((employee.commission / employee.revenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">สถานะรอดำเนินการ</p>
                <p className="text-2xl font-bold text-orange-600">{hrData?.pendingStatus}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-600">รอการอนุมัติ</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">สถานะจ่ายแล้ว</p>
                <p className="text-2xl font-bold text-green-600">{hrData?.paidStatus}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">จ่ายเรียบร้อยแล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHRDashboard;
