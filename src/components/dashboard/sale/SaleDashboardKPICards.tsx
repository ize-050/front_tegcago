'use client';

import React from 'react';
import { Phone, Clock, DollarSign, Package, TrendingUp, TrendingDown, BarChart3, List } from 'lucide-react';

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
  // Mock data - จะเชื่อมต่อกับ API จริงในภายหลัง
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

  const kpiData = data || defaultData;

  if (loading) {
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
      {kpiData.map((card) => (
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
