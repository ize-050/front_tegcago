import axios from '../../../axios';

// Interface สำหรับ Manager Account Dashboard API Response
export interface ManagerAccountDashboardData {
  kpis: {
    pendingShipments: number;
    totalWithdrawalAmount: number;
    totalClearedAmount: number;
    remainingBalance: number;
    totalRevenue: number;
    revenueBeforeVat: number;
    costOfSales: number;
    totalAllExpenses: number;
    costPercentage: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  shippingMetrics: {
    pendingShipments: number;
    totalWithdrawalAmount: number;
    totalClearedAmount: number;
    remainingBalance: number;
  };
  revenueMetrics: {
    totalDepositRevenue: number;
    totalExchangeRevenue: number;
    totalRevenue: number;
    revenueBeforeVat: number;
  };
  costMetrics: {
    totalPurchaseCost: number;
    totalVatAmount: number;
    costOfSales: number;
    totalShippingCost: number;
    totalChinaExpenses: number;
    totalThailandExpenses: number;
    totalAllExpenses: number;
    costPercentage: number;
    expenseBreakdown: {
      employeeCost: number;
      warehouseCost: number;
      customsCost: number;
      portFees: number;
      otherExpenses: number;
    };
  };
  monthlyData: Array<{
    month: string;
    depositRevenue: number;
    exchangeRevenue: number;
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    netProfit: number;
  }>;
  transactionAnalysis: {
    totalDepositTransactions: number;
    totalTransferTransactions: number;
    depositAmountRMB: number;
    transferAmountRMB: number;
    totalTransactionRMB: number;
    depositAmountTHB: number;
    transferAmountTHB: number;
    totalTransactionTHB: number;
  };
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalBillingAmount: number;
    totalAmount: number;
    transactionCount: number;
  }>;
  revenueProportions: {
    depositRevenue: number;
    exchangeRevenue: number;
    depositPercentage: number;
    exchangePercentage: number;
  };
  expenseProportions: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  plAnalysis: {
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    costPercentage: number;
  };
  rmbTracking: {
    depositAmountRMB: number;
    transferAmountRMB: number;
    totalTransactionRMB: number;
    depositAmountTHB: number;
    transferAmountTHB: number;
    totalTransactionTHB: number;
  };
}

export interface ManagerAccountFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'month' | 'year';
}

// API Service Function สำหรับ Manager Account Dashboard
export const getManagerAccountDashboardData = async (filters?: ManagerAccountFilters): Promise<ManagerAccountDashboardData> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/manager/dashboard/account`, {
      params: filters,
      headers: { 
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch manager account dashboard data');
    }
  } catch (error: any) {
    console.error('Error fetching manager account dashboard data:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch data');
  }
};