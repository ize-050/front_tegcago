import axios from '../../../axios';

export interface CSKPIData {
  newRequests: number;
  quotations: number;
  proposals: number;
  acceptedJobs: number;
}

export interface ShipmentAnalysisData {
  route: Array<{ route: string; count: number }>;
  transport: Array<{ transport: string; count: number }>;
  term: Array<{ term: string; count: number }>;
  groupWork: Array<{ groupWork: string; count: number }>;
  jobType: Array<{ jobType: string; count: number }>;
}

export interface PortAnalysisData {
  origin: Array<{ port: string; count: number }>;
  destination: Array<{ port: string; count: number }>;
}

export interface ProductTypeData {
  productTypes: Array<{ productType?: string; productName?: string; count: number }>;
}

export interface CSStatusData {
  containerStatus: Array<{ status: string; count: number }> | { total: number; label: string };
  documentStatus: Array<{ status: string; count: number }> | { total: number; label: string };
  departureStatus: Array<{ status: string; count: number }> | { total: number; label: string };
  deliveryStatus: Array<{ status: string; count: number }> | { total: number; label: string };
}

export interface CSFiltersData {
  transports: string[];
  routes: string[];
  terms: string[];
}

export interface CSDateFilter {
  startDate?: string;
  endDate?: string;
}

export interface CSFilters extends CSDateFilter {
  transport?: string;
  route?: string;
  term?: string;
}

export interface CompleteCSDashboardData {
  kpis: CSKPIData;
  shipmentAnalysis: ShipmentAnalysisData;
  portAnalysis: PortAnalysisData;
  productTypeAnalysis: ProductTypeData;
  statusTracking: CSStatusData;
  availableFilters: CSFiltersData;
  appliedFilters: CSFilters;
}

class CSDashboardService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Get CS Dashboard KPIs
   */
  async getCSKPIs(filters?: CSFilters): Promise<CSKPIData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/kpis?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch CS KPIs');
      }
    } catch (error) {
      console.error('Error fetching CS KPIs:', error);
      throw error;
    }
  }

  /**
   * Get Shipment Analysis Data
   */
  async getShipmentAnalysis(filters?: CSFilters): Promise<ShipmentAnalysisData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/shipment-analysis?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch shipment analysis');
      }
    } catch (error) {
      console.error('Error fetching shipment analysis:', error);
      throw error;
    }
  }

  /**
   * Get Port Analysis Data
   */
  async getPortAnalysis(filters?: CSFilters): Promise<PortAnalysisData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/port-analysis?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch port analysis');
      }
    } catch (error) {
      console.error('Error fetching port analysis:', error);
      throw error;
    }
  }

  /**
   * Get Product Type Analysis Data
   */
  async getProductTypeAnalysis(filters?: CSFilters): Promise<ProductTypeData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/product-type-analysis?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch product type analysis');
      }
    } catch (error) {
      console.error('Error fetching product type analysis:', error);
      throw error;
    }
  }

  /**
   * Get CS Status Tracking Data
   */
  async getCSStatusTracking(filters?: CSFilters): Promise<CSStatusData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/status-tracking?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch CS status tracking');
      }
    } catch (error) {
      console.error('Error fetching CS status tracking:', error);
      throw error;
    }
  }

  /**
   * Get Available Filters
   */
  async getAvailableFilters(): Promise<CSFiltersData> {
    try {
      const response = await axios.get(
        `/dashboard/cs/filters`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch available filters');
      }
    } catch (error) {
      console.error('Error fetching available filters:', error);
      throw error;
    }
  }

  /**
   * Get Complete CS Dashboard Data
   */
  async getCompleteDashboardData(filters?: CSFilters): Promise<CompleteCSDashboardData> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/complete?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch complete dashboard data');
      }
    } catch (error) {
      console.error('Error fetching complete dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get CS Dashboard Overview (KPIs + basic charts)
   */
  async getDashboardOverview(filters?: CSFilters): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      const response = await axios.get(
        `/dashboard/cs/overview?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard overview');
      }
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Transform Product Types for Chart Display
   */
  transformProductTypesForChart(productTypes: Array<{ productType?: string; productName?: string; count: number }>): Array<{ id: string; label: string; value: number; color?: string }> {
    return productTypes.map((item, index) => ({
      id: item.productType || item.productName || `Product ${index + 1}`,
      label: item.productType || item.productName || `Product ${index + 1}`,
      value: item.count,
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
    }));
  }

  /**
   * Get Complete CS Dashboard Data
   */
  async getCompleteDashboard(filters?: CSFilters): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.transport) params.append('transport', filters.transport);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.term) params.append('term', filters.term);

      console.log('Calling complete dashboard API with params:', params.toString());
      
      const response = await axios.get(
        `/dashboard/cs/complete?${params.toString()}`
      );

      console.log('Complete dashboard API response:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch complete dashboard');
      }
    } catch (error) {
      console.error('Error fetching complete dashboard:', error);
      throw error;
    }
  }

  /**
   * Transform Status Data for Display
   */
  transformStatusDataForDisplay(statusData: Array<{ status: string; count: number }> | { total: number; label: string }): Array<{ status: string; count: number }> {
    if (Array.isArray(statusData)) {
      return statusData;
    } else {
      // If it's a summary object, return as single item array
      return [{ status: statusData.label, count: statusData.total }];
    }
  }
}

export default new CSDashboardService();
