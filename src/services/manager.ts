import axios from '../../axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3001';

// Interfaces
export interface DateFilter {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
  salespersonId?: string;
}

export interface SaleDashboardData {
  kpis: {
    totalContacts: number;
    pendingDeals: number;
    totalSales: number;
    shipmentCount: number;
  };
  salesData: Array<{
    period: string;
    sales: number;
    revenue: number;
    contacts: number;
    pending: number;
  }>;
  shipmentData: Array<{
    period: string;
    shipments: number;
    value: number;
  }>;
  salespersonPerformance: Array<{
    name: string;
    contacts: number;
    deals: number;
    revenue: number;
    conversion: number;
  }>;
}

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CSDashboardData {
  kpis: {
    totalJobs: number;
    inProgress: number;
    completed: number;
    pendingDocuments: number;
  };
  // Add more CS-specific interfaces as needed
}

export interface AccountDashboardData {
  kpis: {
    totalRevenue: number;
    pendingPayments: number;
    completedTransactions: number;
    monthlyGrowth: number;
  };
  // Add more Account-specific interfaces as needed
}

export interface HRDashboardData {
  kpis: {
    totalCommission: number;
    pendingCommission: number;
    paidCommission: number;
    totalEmployees: number;
  };
  // Add more HR-specific interfaces as needed
}

// API Functions
export const getSaleDashboardData = async (filters: DateFilter): Promise<ApiResponse<SaleDashboardData>> => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.period) params.append('period', filters.period);
    if (filters.salespersonId && filters.salespersonId !== 'all') {
      params.append('salespersonId', filters.salespersonId);
    }

    const response = await axios.get(`${API_BASE_URL}/manager/dashboard/sale?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching sale dashboard data:', error);
    throw error;
  }
};

export const getCSDashboardData = async (filters: DateFilter): Promise<CSDashboardData> => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.period) params.append('period', filters.period);

    const response = await axios.get(`${API_BASE_URL}/manager/dashboard/cs?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching CS dashboard data:', error);
    throw error;
  }
};

export const getAccountDashboardData = async (filters: DateFilter): Promise<AccountDashboardData> => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.period) params.append('period', filters.period);

    const response = await axios.get(`${API_BASE_URL}/manager/dashboard/account?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching Account dashboard data:', error);
    throw error;
  }
};

export const getHRDashboardData = async (filters: DateFilter): Promise<HRDashboardData> => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.period) params.append('period', filters.period);

    const response = await axios.get(`${API_BASE_URL}/manager/dashboard/hr?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching HR dashboard data:', error);
    throw error;
  }
};

// Get list of salespersons for filter dropdown
export const getSalespersonList = async (): Promise<ApiResponse<Array<{salespersonId: string; salespersonName: string}>>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee/role/salesupport`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Transform the response to match the expected format
    const salespersons = response.data.map((emp: any) => ({
      salespersonId: emp.id || emp.user_id,
      salespersonName: emp.name || `${emp.first_name} ${emp.last_name}`.trim()
    }));

    return {
      success: true,
      data: salespersons
    };
  } catch (error) {
    console.error('Error fetching salesperson list:', error);
    // Return fallback data if API fails
    return {
      success: false,
      data: []
    };
  }
};
