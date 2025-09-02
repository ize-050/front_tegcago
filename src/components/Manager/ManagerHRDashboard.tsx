import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Award, Calendar, Package, Clock, Check } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { getHRCompleteDashboard, type HRFilters, type HRDashboardData } from '../../services/dashboard/hr-dashboard.service';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'day' | 'month' | 'year';
}

interface ManagerHRDashboardProps {
  dateFilter: DateFilter;
}

const ManagerHRDashboard: React.FC<ManagerHRDashboardProps> = ({ dateFilter }) => {
  const [hrData, setHrData] = useState<HRDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    fetchHRData();
  }, [selectedYear, selectedMonth]);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      
      // Use selected filters
      const filters: HRFilters = {
        year: selectedYear,
        month: selectedMonth !== 'all' ? selectedMonth : undefined
      };

      console.log('Fetching HR data with filters:', filters);
      
      const data = await getHRCompleteDashboard(filters);
      console.log('HR data received:', data);
      
      setHrData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching HR data:', error);
      setLoading(false);
      
      // Fallback to mock data on error
      const mockData: HRDashboardData = {
        overview: {
          totalCommission: 450000,
          salesCount: 12,
          shipmentCount: 156,
          averageCommissionPerEmployee: 37500,
          pendingCommissions: 15,
          paidCommissions: 128
        },
        monthlyData: [
          { month: '2025-01', totalCommission: 140000, shipmentCount: 45, revenue: 2800000 },
          { month: '2025-02', totalCommission: 160000, shipmentCount: 38, revenue: 3200000 },
          { month: '2025-03', totalCommission: 145000, shipmentCount: 42, revenue: 2900000 },
          { month: '2025-04', totalCommission: 190000, shipmentCount: 31, revenue: 3800000 }
        ],
        commissionByType: [
          { type: 'ALL IN', commission: 180000, shipmentCount: 12, percentage: 40 },
          { type: 'CIF', commission: 120000, shipmentCount: 8, percentage: 26.7 },
          { type: 'EXW', commission: 80000, shipmentCount: 15, percentage: 17.8 },
          { type: 'เคลียร์ฝั่งไทย', commission: 70000, shipmentCount: 10, percentage: 15.5 }
        ],
        employeePerformance: [
          { employeeId: '1', name: 'Lucky', shipments: 45, commission: 135000, revenue: 1800000, commissionRate: 7.5 },
          { employeeId: '2', name: 'เซลล์ B', shipments: 38, commission: 114000, revenue: 1520000, commissionRate: 7.5 },
          { employeeId: '3', name: 'เซลล์ C', shipments: 42, commission: 126000, revenue: 1680000, commissionRate: 7.5 },
          { employeeId: '4', name: 'เซลล์ D', shipments: 31, commission: 93000, revenue: 1240000, commissionRate: 7.5 }
        ],
        commissionStatus: {
          statusSummary: { pending: 15, paid: 128, saved: 45 },
          details: [
            { status: 'pending', count: 15, totalAmount: 45000 },
            { status: 'paid', count: 128, totalAmount: 380000 },
            { status: 'saved', count: 45, totalAmount: 135000 }
          ]
        },
        revenueCommissionChart: [
          {
            id: 'รายได้',
            color: 'hsl(210, 70%, 50%)',
            data: [
              { x: 'ม.ค. 25', y: 2800000 },
              { x: 'ก.พ. 25', y: 3200000 },
              { x: 'มี.ค. 25', y: 2900000 },
              { x: 'เม.ย. 25', y: 3800000 }
            ]
          },
          {
            id: 'ค่าคอมมิชชั่น',
            color: 'hsl(120, 70%, 50%)',
            data: [
              { x: 'ม.ค. 25', y: 140000 },
              { x: 'ก.พ. 25', y: 160000 },
              { x: 'มี.ค. 25', y: 145000 },
              { x: 'เม.ย. 25', y: 190000 }
            ]
          }
        ]
      };
      
      setHrData(mockData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!hrData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">ไม่พบข้อมูล</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
            <p className="text-sm text-gray-500">ภาพรวมการจัดการทรัพยากรบุคคลและค่าคอมมิชชั่น</p>
          </div>
          <div className="flex items-center space-x-4">
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
                      onChange={(e) => setSelectedYear(e.target.value)}
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
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="all">ทั้งปี</option>
                      <option value="01">มกราคม</option>
                      <option value="02">กุมภาพันธ์</option>
                      <option value="03">มีนาคม</option>
                      <option value="04">เมษายน</option>
                      <option value="05">พฤษภาคม</option>
                      <option value="06">มิถุนายน</option>
                      <option value="07">กรกฎาคม</option>
                      <option value="08">สิงหาคม</option>
                      <option value="09">กันยายน</option>
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ค่าคอมมิชชั่นรวม</p>
              <div className="text-2xl font-bold text-blue-600">
                ฿{hrData.overview?.totalCommission?.toLocaleString() || '0'}
              </div>
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
              <div className="text-2xl font-bold text-green-600">{hrData.overview?.salesCount || 0}</div>
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
              <div className="text-2xl font-bold text-purple-600">{hrData.overview?.shipmentCount || 0}</div>
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
              <div className="text-2xl font-bold text-orange-600">฿{((hrData.overview?.totalCommission || 0) / (hrData.overview?.salesCount || 1)).toLocaleString()}</div>
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
              data={hrData.revenueCommissionChart || []}
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
              data={hrData.employeePerformance?.map((emp, index) => ({
                id: emp.name,
                label: emp.name,
                value: emp.commission,
                color: `hsl(${index * 60}, 70%, 50%)`
              })) || []}
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
          {hrData.commissionByType?.map((type, index) => (
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
                {hrData.employeePerformance.map((employee, index) => (
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
                <div className="text-3xl font-bold text-yellow-600">{hrData.commissionStatus?.statusSummary?.pending || 0}</div>
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
                <div className="text-3xl font-bold text-green-600">{hrData.commissionStatus?.statusSummary?.paid || 0}</div>
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
