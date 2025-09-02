'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Calendar, Phone, Clock, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface KPIData {
  totalRevenue: number;
  totalShipments: number;
  totalCustomers: number;
  monthlyGrowth: number;
  revenueGrowth: number;
  shipmentsGrowth: number;
  customersGrowth: number;
}

interface KPICardData {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  color: {
    bg: string;
    icon: string;
    trend: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SaleDashboardKPICardsProps {
  data?: KPICardData[];
  loading?: boolean;
}

/**
 * Sale Dashboard KPI Cards Component
 * 
 * Features:
 * - 4 main KPI cards (Contacts, Pending Deals, Revenue, Shipments)
 * - Trend indicators with percentage change
 * - Color-coded cards with icons
 * - Action buttons for drill-down
 * - Loading states and responsive design
 */
const SaleDashboardKPICards: React.FC<SaleDashboardKPICardsProps> = ({
  data,
  loading = false
}) => {
  const [kpiData, setKpiData] = useState<KPICardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSaleKPIs();
  }, []);

  const fetchSaleKPIs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/sale/kpis`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const apiData = response.data.data;
        setKpiData([
          {
            id: 'contacts',
            title: 'Total Contacts',
            value: apiData.totalContacts || 0,
            icon: <Phone className="w-6 h-6" />,
            trend: {
              value: apiData.contactsTrend || 0,
              isPositive: (apiData.contactsTrend || 0) >= 0,
              period: 'vs last month'
            },
            color: {
              bg: 'bg-blue-50',
              icon: 'text-blue-600',
              trend: (apiData.contactsTrend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }
          },
          {
            id: 'pending',
            title: 'Pending Deals',
            value: apiData.pendingDeals || 0,
            icon: <Clock className="w-6 h-6" />,
            trend: {
              value: apiData.pendingTrend || 0,
              isPositive: (apiData.pendingTrend || 0) >= 0,
              period: 'vs last month'
            },
            color: {
              bg: 'bg-orange-50',
              icon: 'text-orange-600',
              trend: (apiData.pendingTrend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }
          },
          {
            id: 'revenue',
            title: 'Total Revenue',
            value: `฿${(apiData.totalRevenue || 0).toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6" />,
            trend: {
              value: apiData.revenueTrend || 0,
              isPositive: (apiData.revenueTrend || 0) >= 0,
              period: 'vs last month'
            },
            color: {
              bg: 'bg-green-50',
              icon: 'text-green-600',
              trend: (apiData.revenueTrend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }
          },
          {
            id: 'shipments',
            title: 'Total Shipments',
            value: apiData.totalShipments || 0,
            icon: <Package className="w-6 h-6" />,
            trend: {
              value: apiData.shipmentsTrend || 0,
              isPositive: (apiData.shipmentsTrend || 0) >= 0,
              period: 'vs last month'
            },
            color: {
              bg: 'bg-purple-50',
              icon: 'text-purple-600',
              trend: (apiData.shipmentsTrend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching sale KPIs:', error);
      // Fallback to default data
      setKpiData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data - fallback when API fails
  const defaultData: KPICardData[] = [
    {
      id: 'contacts',
      title: 'Total Contacts',
      value: '156',
      icon: <Phone className="h-6 w-6" />,
      trend: {
        value: 12.5,
        isPositive: true,
        period: 'vs last month'
      },
      color: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        trend: 'text-green-600'
      },
      action: {
        label: 'Details',
        onClick: () => console.log('View contacts details')
      }
    },
    {
      id: 'pending',
      title: 'Pending Deals',
      value: '23',
      icon: <Clock className="h-6 w-6" />,
      trend: {
        value: -8.0,
        isPositive: false,
        period: 'vs last month'
      },
      color: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        trend: 'text-red-600'
      },
      action: {
        label: 'View List',
        onClick: () => console.log('View pending deals')
      }
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: '2.5M THB',
      icon: <DollarSign className="h-6 w-6" />,
      trend: {
        value: 18.2,
        isPositive: true,
        period: 'vs last month'
      },
      color: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        trend: 'text-green-600'
      },
      action: {
        label: 'Breakdown',
        onClick: () => console.log('View revenue breakdown')
      }
    },
    {
      id: 'shipments',
      title: 'Shipments',
      value: '45',
      icon: <Package className="h-6 w-6" />,
      trend: {
        value: 15.4,
        isPositive: true,
        period: 'vs last month'
      },
      color: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        trend: 'text-green-600'
      },
      action: {
        label: 'Job List',
        onClick: () => console.log('View job list')
      }
    }
  ];

  const displayData = data || kpiData;

  if (loading || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-4"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayData.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color.bg}`}>
              <div className={card.color.icon}>
                {card.icon}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                📊 KPI
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              {card.title}
            </h3>
          </div>

          {/* Value */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">
              {card.value}
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              {card.trend.isPositive ? (
                <TrendingUp className={`h-4 w-4 ${card.color.trend}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${card.color.trend}`} />
              )}
              <span className={`text-sm font-medium ${card.color.trend}`}>
                {card.trend.isPositive ? '↗️' : '↘️'} {Math.abs(card.trend.value)}%
              </span>
            </div>
          </div>

          {/* Period */}
          <div className="mb-4">
            <div className="text-xs text-gray-500">
              {card.trend.period}
            </div>
          </div>

          {/* Action Button */}
          {card.action && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={card.action.onClick}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{card.action.label}</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SaleDashboardKPICards;
