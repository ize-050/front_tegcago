import axios from '../../../axios';

// Interfaces
export interface AccountKPIs {
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
}

export interface ShippingMetrics {
  pendingShipments: number;
  totalWithdrawalAmount: number;
  totalClearedAmount: number;
  remainingBalance: number;
}

export interface RevenueMetrics {
  totalDepositRevenue: number;
  totalExchangeRevenue: number;
  totalRevenue: number;
  revenueBeforeVat: number;
}

export interface CostMetrics {
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
}

export interface MonthlyRevenueExpense {
  month: string;
  depositRevenue: number;
  exchangeRevenue: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
}

export interface TransactionAnalysis {
  depositAmountRMB: number;
  transferAmountRMB: number;
  totalTransactionRMB: number;
  depositAmountTHB: number;
  transferAmountTHB: number;
  totalTransactionTHB: number;
}

export interface CustomerRanking {
  customerId: string;
  customerName: string;
  totalDepositAmount: number;
  totalExchangeAmount: number;
  totalAmount: number;
  transactionCount: number;
}

export interface RevenueProportions {
  depositRevenue: number;
  exchangeRevenue: number;
  depositPercentage: number;
  exchangePercentage: number;
}

export interface ExpenseProportions {
  category: string;
  amount: number;
  percentage: number;
}

export interface AccountFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'month' | 'year';
}

// API Service Functions
export const getAccountKPIs = async (filters?: AccountFilters): Promise<AccountKPIs> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/kpis`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getShippingMetrics = async (filters?: AccountFilters): Promise<ShippingMetrics> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/shipping`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getRevenueMetrics = async (filters?: AccountFilters): Promise<RevenueMetrics> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/revenue`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getCostMetrics = async (filters?: AccountFilters): Promise<CostMetrics> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/costs`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getMonthlyRevenueExpense = async (filters?: AccountFilters): Promise<MonthlyRevenueExpense[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/monthly`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getTransactionAnalysis = async (filters?: AccountFilters): Promise<TransactionAnalysis> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/transactions`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getTopCustomers = async (filters?: AccountFilters): Promise<CustomerRanking[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/customers`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getRevenueProportions = async (filters?: AccountFilters): Promise<RevenueProportions> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/proportions/revenue`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getExpenseProportions = async (filters?: AccountFilters): Promise<ExpenseProportions[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/proportions/expense`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getRevenuePieChartData = async (filters?: AccountFilters) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/charts/revenue-pie`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getExpensePieChartData = async (filters?: AccountFilters) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/charts/expense-pie`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getTransactionBarChartData = async (filters?: AccountFilters) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/charts/transaction-bar`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getRevenueExpenseComparisonData = async (filters?: AccountFilters) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/charts/revenue-expense-comparison`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};

export const getCompleteAccountDashboard = async (filters?: AccountFilters) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/account/complete`, {
    params: filters,
    headers: { 
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzUzNDUsImV4cCI6MTc1NjgyMTc0NX0.Bfu273EKkck7MxmDmgiKsa6gSRivr4uMWpvFMbFjiKU'
    }
  });
  return response.data.data;
};
