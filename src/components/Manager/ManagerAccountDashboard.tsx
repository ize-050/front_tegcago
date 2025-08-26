import React, { useState, useEffect } from 'react';
import { Package, Banknote, CreditCard, TrendingUp, Percent, BarChart3, PieChart, Coins, Users, ArrowUpDown } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'day' | 'month' | 'year';
}

interface ManagerAccountDashboardProps {
  dateFilter: DateFilter;
}

interface AccountData {
  pendingWithdrawal: number;
  withdrawalAmount: number;
  clearingAmount: number;
  revenue: number;
  cost: number;
  profitLoss: number;
  incomeRatio: any[];
  expenseRatio: any[];
  rmbDeposits: number;
  topCustomers: any[];
  accountBalance: number;
  rmbTransactions: {
    paid: number;
    received: number;
  };
  revenueChart: any[];
  profitChart: any[];
}

const ManagerAccountDashboard: React.FC<ManagerAccountDashboardProps> = ({ dateFilter }) => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, [dateFilter]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      const mockData: AccountData = {
        pendingWithdrawal: 25,
        withdrawalAmount: 2450000,
        clearingAmount: 1890000,
        revenue: 3200000,
        cost: 2100000,
        profitLoss: 1100000,
        incomeRatio: [
          { id: 'Import', label: 'Import', value: 60, color: 'hsl(210, 70%, 50%)' },
          { id: 'Export', label: 'Export', value: 40, color: 'hsl(30, 70%, 50%)' },
        ],
        expenseRatio: [
          { id: 'ค่าขนส่ง', label: 'ค่าขนส่ง', value: 45, color: 'hsl(120, 70%, 50%)' },
          { id: 'ค่าเอกสาร', label: 'ค่าเอกสาร', value: 25, color: 'hsl(60, 70%, 50%)' },
          { id: 'ค่าคอมมิชชั่น', label: 'ค่าคอมมิชชั่น', value: 20, color: 'hsl(300, 70%, 50%)' },
          { id: 'อื่นๆ', label: 'อื่นๆ', value: 10, color: 'hsl(180, 70%, 50%)' },
        ],
        rmbDeposits: 450000,
        topCustomers: [
          { name: 'บริษัท ABC จำกัด', amount: 850000 },
          { name: 'บริษัท XYZ จำกัด', amount: 720000 },
          { name: 'บริษัท DEF จำกัด', amount: 650000 },
          { name: 'บริษัท GHI จำกัด', amount: 580000 },
          { name: 'บริษัท JKL จำกัด', amount: 520000 },
        ],
        accountBalance: 1250000,
        rmbTransactions: {
          paid: 380000,
          received: 420000,
        },
        revenueChart: [
          {
            id: 'รายได้',
            color: 'hsl(210, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: 480000 },
              { x: 'ก.พ.', y: 520000 },
              { x: 'มี.ค.', y: 450000 },
              { x: 'เม.ย.', y: 680000 },
              { x: 'พ.ค.', y: 590000 },
              { x: 'มิ.ย.', y: 720000 },
            ]
          }
        ],
        profitChart: [
          {
            id: 'กำไร',
            color: 'hsl(120, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: 180000 },
              { x: 'ก.พ.', y: 220000 },
              { x: 'มี.ค.', y: 150000 },
              { x: 'เม.ย.', y: 280000 },
              { x: 'พ.ค.', y: 190000 },
              { x: 'มิ.ย.', y: 320000 },
            ]
          },
          {
            id: 'ขาดทุน',
            color: 'hsl(0, 70%, 50%)',
            data: [
              { x: 'ม.ค.', y: -20000 },
              { x: 'ก.พ.', y: 0 },
              { x: 'มี.ค.', y: -15000 },
              { x: 'เม.ย.', y: 0 },
              { x: 'พ.ค.', y: -10000 },
              { x: 'มิ.ย.', y: 0 },
            ]
          }
        ],
      };

      setAccountData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching account data:', error);
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
          <h2 className="text-xl font-semibold text-gray-900">Account Dashboard</h2>
          <p className="text-sm text-gray-500">ภาพรวมการเงินและบัญชี</p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipment รอเบิก</p>
              <p className="text-2xl font-bold text-gray-900">{accountData?.pendingWithdrawal}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">+3 จากสัปดาห์ที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวนเงินเบิกรวม</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{accountData?.withdrawalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวนเงินรวมเคลียร์</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{accountData?.clearingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">รายได้</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{accountData?.revenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+15% จากเดือนที่แล้ว</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ต้นทุนขาย</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{accountData?.cost.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Percent className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">+5% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">กำไร-ขาดทุน</p>
              <p className={`text-2xl font-bold ${accountData?.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ฿{accountData?.profitLoss.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${accountData?.profitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
              <BarChart3 className={`h-6 w-6 ${accountData?.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+22% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดฝากสั่ง/ฝากโอน (RMB)</p>
              <p className="text-2xl font-bold text-gray-900">
                ¥{accountData?.rmbDeposits.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+18% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดรวมบัญชี</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{accountData?.accountBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+7% จากเดือนที่แล้ว</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Ratio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สัดส่วนรายรับ</h3>
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={accountData?.incomeRatio || []}
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

        {/* Expense Ratio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สัดส่วนรายจ่าย</h3>
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={accountData?.expenseRatio || []}
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">รายได้รายเดือน</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={accountData?.revenueChart || []}
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
                legend: 'รายได้ (บาท)',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
            />
          </div>
        </div>

        {/* Profit/Loss Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">กำไร-ขาดทุนรายเดือน</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={accountData?.profitChart || []}
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
                legend: 'กำไร-ขาดทุน (บาท)',
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
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">ลูกค้า Top 5</h3>
          </div>
          <div className="space-y-3">
            {accountData?.topCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                  <div className="text-xs text-gray-500">อันดับ {index + 1}</div>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ฿{customer.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RMB Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <ArrowUpDown className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">ยอดจ่าย/รับ (RMB)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <span className="text-sm font-medium text-red-800">ยอดจ่าย</span>
                <div className="text-xs text-red-600">รายจ่ายทั้งหมด</div>
              </div>
              <span className="text-2xl font-bold text-red-600">
                ¥{accountData?.rmbTransactions.paid.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <span className="text-sm font-medium text-green-800">ยอดรับ</span>
                <div className="text-xs text-green-600">รายรับทั้งหมด</div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ¥{accountData?.rmbTransactions.received.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <span className="text-sm font-medium text-blue-800">ยอดคงเหลือ</span>
                <div className="text-xs text-blue-600">รับ - จ่าย</div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                ¥{(accountData?.rmbTransactions.received - accountData?.rmbTransactions.paid).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAccountDashboard;
