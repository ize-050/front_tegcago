import axios from '../../../axios';

export interface HRFilters {
  year?: string;
  month?: string;
  employeeId?: string;
  commissionType?: string;
}

export interface HROverviewMetrics {
  totalCommission: number;
  salesCount: number;
  shipmentCount: number;
  averageCommissionPerEmployee: number;
  pendingCommissions: number;
  paidCommissions: number;
}

export interface MonthlyHRData {
  month: string;
  totalCommission: number;
  shipmentCount: number;
  revenue: number;
}

export interface CommissionByType {
  type: string;
  commission: number;
  shipmentCount: number;
  percentage: number;
}

export interface EmployeePerformance {
  employeeId: string;
  name: string;
  shipments: number;
  commission: number;
  revenue: number;
  commissionRate: number;
}

export interface CommissionStatus {
  status: string;
  count: number;
  totalAmount: number;
}

export interface HRDashboardData {
  overview: HROverviewMetrics;
  monthlyData: MonthlyHRData[];
  commissionByType: CommissionByType[];
  employeePerformance: EmployeePerformance[];
  commissionStatus: {
    statusSummary: { pending: number; paid: number; saved: number };
    details: CommissionStatus[];
  };
  revenueCommissionChart: Array<{
    id: string;
    color: string;
    data: Array<{ x: string; y: number }>;
  }>;
}

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzQwNDMxNS04YjRjLTQyNGUtYjNlMC0wN2MyYjU1ODIzYTciLCJpYXQiOjE3NTY3MzYyMDAsImV4cCI6MTc1NjgyMjYwMH0.eaUNwObT2w2_n2cg5D49MB5uSH-Drh6FGxyRxvulA24";

/**
 * Get complete HR dashboard data
 */
export const getHRCompleteDashboard = async (filters: HRFilters): Promise<HRDashboardData> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.commissionType) params.append('commissionType', filters.commissionType);

    const response = await axios.get(`/dashboard/hr/complete?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching complete HR dashboard data:', error);
    throw error;
  }
};

/**
 * Get HR overview metrics
 */
export const getHROverview = async (filters: HRFilters): Promise<HROverviewMetrics> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);

    const response = await axios.get(`/dashboard/hr/overview?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching HR overview:', error);
    throw error;
  }
};

/**
 * Get monthly HR data
 */
export const getHRMonthlyData = async (filters: HRFilters): Promise<MonthlyHRData[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);

    const response = await axios.get(`/dashboard/hr/monthly-data?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching monthly HR data:', error);
    throw error;
  }
};

/**
 * Get commission by type
 */
export const getHRCommissionByType = async (filters: HRFilters): Promise<CommissionByType[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);

    const response = await axios.get(`/dashboard/hr/commission-by-type?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching commission by type:', error);
    throw error;
  }
};

/**
 * Get employee performance
 */
export const getHREmployeePerformance = async (filters: HRFilters): Promise<EmployeePerformance[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);

    const response = await axios.get(`/dashboard/hr/employee-performance?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee performance:', error);
    throw error;
  }
};

/**
 * Get commission status
 */
export const getHRCommissionStatus = async (filters: HRFilters): Promise<{
  statusSummary: { pending: number; paid: number; saved: number };
  details: CommissionStatus[];
}> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);

    const response = await axios.get(`/dashboard/hr/commission-status?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching commission status:', error);
    throw error;
  }
};

/**
 * Get revenue and commission chart data
 */
export const getHRRevenueCommissionChart = async (filters: HRFilters): Promise<Array<{
  id: string;
  color: string;
  data: Array<{ x: string; y: number }>;
}>> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);

    const response = await axios.get(`/dashboard/hr/revenue-commission-chart?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching revenue commission chart:', error);
    throw error;
  }
};
