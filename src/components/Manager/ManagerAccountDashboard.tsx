"use client";

import React, { useState, useEffect } from 'react';
import { Package, Banknote, CreditCard, TrendingUp, Percent, BarChart3, PieChart, Coins, Users, ArrowUpDown, Calendar } from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import {
  getManagerAccountDashboardData,
  type ManagerAccountDashboardData,
  type ManagerAccountFilters
} from '../../services/dashboard/manager-account-dashboard.service';

interface DateFilter {
  startDate: string;
  endDate: string;
  period: 'day' | 'month' | 'year';
}

interface ManagerAccountDashboardProps {
  dateFilter?: DateFilter;
}

const ManagerAccountDashboard: React.FC<ManagerAccountDashboardProps> = ({ dateFilter }) => {
  const [accountData, setAccountData] = useState<ManagerAccountDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    fetchAccountData();
  }, [dateFilter, selectedYear, selectedMonth]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      
      // สร้าง filters จาก dateFilter, selectedYear, selectedMonth หรือใช้ค่าเริ่มต้น
      let startDate = dateFilter?.startDate;
      let endDate = dateFilter?.endDate;
      
      // ถ้าไม่มี dateFilter ให้ใช้ selectedYear และ selectedMonth
      if (!startDate || !endDate) {
        if (selectedMonth === 'all') {
          startDate = `${selectedYear}-01-01`;
          endDate = `${selectedYear}-12-31`;
        } else {
          startDate = `${selectedYear}-${selectedMonth}-01`;
          // คำนวณวันสุดท้ายของเดือน
          const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
          endDate = `${selectedYear}-${selectedMonth}-${lastDay.toString().padStart(2, '0')}`;
        }
      }
      
      const filters: ManagerAccountFilters = {
        startDate: startDate || '2020-01-01',
        endDate: endDate || '2025-12-31',
        period: dateFilter?.period || 'month'
      };

      console.log('Fetching manager account data with filters:', filters);
      console.log('API URL:', process.env.NEXT_PUBLIC_URL_API);

      // เรียก Manager Account Dashboard API
      const dashboardData = await getManagerAccountDashboardData(filters);
      
      setAccountData(dashboardData);
    } catch (error) {
      console.error('Error fetching manager account data:', error);
      // แสดง error message ให้ผู้ใช้เห็น
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-500">กำลังโหลดข้อมูล Manager Account Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-2">ไม่สามารถโหลดข้อมูลได้</div>
          <button 
            onClick={fetchAccountData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Account Dashboard</h2>
            <p className="text-sm text-gray-500">ภาพรวมการเงินและบัญชี</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">รายได้รวม</p>
              <p className="text-2xl font-bold text-gray-900">฿{accountData?.kpis?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">รายได้ทั้งหมด</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวนเงินเบิกรวม</p>
              <div className="text-2xl font-bold text-gray-900">
                ฿{(accountData?.kpis?.totalWithdrawalAmount || 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">ยอดเบิกทั้งหมด</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">จำนวนเงินรวมเคลียร์</p>
              <div className="text-2xl font-bold text-gray-900">
                ฿{(accountData?.kpis?.totalClearedAmount || 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600">ยอดเคลียร์ทั้งหมด</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดฝาก RMB</p>
              <div className="text-2xl font-bold text-gray-900">
                ¥{(accountData?.rmbTracking?.depositAmountRMB || 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">ยอดฝาก RMB ทั้งหมด</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ต้นทุนขาย</p>
              <div className="text-2xl font-bold text-gray-900">
                ฿{(accountData?.kpis?.totalAllExpenses || 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Percent className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">รายจ่ายทั้งหมด</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">กำไร-ขาดทุน</p>
              <p className={`text-2xl font-bold ${(accountData?.kpis?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ฿{(accountData?.kpis?.netProfit || 0).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${(accountData?.kpis?.netProfit || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
              <BarChart3 className={`h-6 w-6 ${(accountData?.kpis?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm ${(accountData?.kpis?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(accountData?.kpis?.netProfit || 0) >= 0 ? 'กำไร' : 'ขาดทุน'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">อัตรากำไร</p>
              <p className="text-2xl font-bold text-gray-900">
                {accountData?.kpis?.profitMargin?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Percent className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-indigo-600">อัตรากำไรสุทธิ</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดรวมบัญชี</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{(accountData?.kpis?.remainingBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-full">
              <CreditCard className="h-6 w-6 text-slate-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-slate-600">ยอดคงเหลือ</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Ratio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สัดส่วนรายรับ</h3>
          <div style={{ height: '300px' }}>
            {accountData?.revenueProportions ? (
              <ResponsivePie
                data={[
                  {
                    id: 'รายได้จากฝากชำระ',
                    label: 'รายได้จากฝากชำระ',
                    value: accountData.revenueProportions.depositRevenue,
                    color: '#10b981'
                  },
                  {
                    id: 'รายได้จากการขาย',
                    label: 'รายได้จากการขาย',
                    value: accountData.kpis.revenueBeforeVat,
                    color: '#3b82f6'
                  }
                ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                ไม่มีข้อมูลสัดส่วนรายรับ
              </div>
            )}
          </div>
        </div>

        {/* Expense Ratio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การติดตาม RMB</h3>
          <div style={{ height: '300px' }}>
            {accountData?.rmbTracking ? (
              <ResponsivePie
                data={[
                  {
                    id: 'ยอดฝาก RMB',
                    label: 'ยอดฝาก RMB',
                    value: accountData.rmbTracking.depositAmountRMB,
                    color: '#f59e0b'
                  },
                  {
                    id: 'ยอดโอน RMB',
                    label: 'ยอดโอน RMB',
                    value: accountData.rmbTracking.transferAmountRMB,
                    color: '#ef4444'
                  }
                ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                ไม่มีข้อมูลการติดตาม RMB
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">รายได้รายเดือน</h3>
          <div style={{ height: '300px' }}>
            {accountData?.monthlyData && accountData.monthlyData.length > 0 ? (
              <ResponsiveLine
                data={[
                  {
                    id: 'รายได้',
                    color: 'hsl(210, 70%, 50%)',
                    data: accountData.monthlyData.map(item => ({
                      x: item.month,
                      y: item.totalRevenue
                    }))
                  },
                  {
                    id: 'รายจ่าย',
                    color: 'hsl(0, 70%, 50%)',
                    data: accountData.monthlyData.map(item => ({
                      x: item.month,
                      y: item.totalCost
                    }))
                  }
                ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                ไม่มีข้อมูลรายได้รายเดือน
              </div>
            )}
          </div>
        </div>

        {/* Profit/Loss Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">กำไร-ขาดทุนรายเดือน</h3>
          <div style={{ height: '300px' }}>
            {accountData?.monthlyData && accountData.monthlyData.length > 0 ? (
              <ResponsiveLine
                data={[
                  {
                    id: 'กำไรสุทธิ',
                    color: 'hsl(120, 70%, 50%)',
                    data: accountData.monthlyData.map(item => ({
                      x: item.month,
                      y: item.grossProfit
                    }))
                  }
                ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                ไม่มีข้อมูลกำไร-ขาดทุนรายเดือน
              </div>
            )}
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
          <div className="overflow-x-auto">
            {accountData?.topCustomers && accountData.topCustomers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ลูกค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนรายการ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ยอดเงิน RMB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ยอดเงิน THB
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accountData.topCustomers.map((customer, index) => (
                    <tr key={customer.customerId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.customerName || customer.customerId}
                            </div>
                            <div className="text-sm text-gray-500">ID: {customer.customerId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.transactionCount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{customer.totalBillingAmount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ฿{customer.totalAmount?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                ไม่มีข้อมูลลูกค้า
              </div>
            )}
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
              <p className="text-2xl font-bold text-red-600">
                ¥{accountData?.rmbTracking?.transferAmountRMB?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <span className="text-sm font-medium text-green-800">ยอดรับ</span>
                <div className="text-xs text-green-600">รายรับทั้งหมด</div>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ¥{accountData?.rmbTracking?.depositAmountRMB?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <span className="text-sm font-medium text-blue-800">ยอดคงเหลือ</span>
                <div className="text-xs text-blue-600">รับ - จ่าย</div>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ¥{((accountData?.rmbTracking?.depositAmountRMB || 0) - (accountData?.rmbTracking?.transferAmountRMB || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAccountDashboard;