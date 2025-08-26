'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, BarChart3, FileText, Mail, Eye, ArrowUpDown, Download } from 'lucide-react';

interface SalespersonData {
  id: string;
  rank: number;
  name: string;
  contacts: number;
  pending: number;
  revenue: string;
  shipments: number;
  avgDeal: string;
  percentage: number;
  avatar?: string;
  status: 'active' | 'inactive';
}

interface SaleDashboardTableProps {
  data?: SalespersonData[];
  loading?: boolean;
  onViewDetails?: (salespersonId: string) => void;
  onSendReport?: (salespersonId: string) => void;
  onSendEmail?: (salespersonId: string) => void;
}

/**
 * Sale Dashboard Performance Table Component
 * 
 * Features:
 * - Salesperson performance ranking
 * - Sortable columns (rank, revenue, contacts, etc.)
 * - Search and filter functionality
 * - Action buttons (Details, Report, Email)
 * - Pagination and row selection
 * - Export options (Excel, PDF, Email)
 */
const SaleDashboardTable: React.FC<SaleDashboardTableProps> = ({
  data,
  loading = false,
  onViewDetails,
  onSendReport,
  onSendEmail
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - จะเชื่อมต่อกับ API จริงในภายหลัง
  const defaultData: SalespersonData[] = [
    {
      id: 'sale_a',
      rank: 1,
      name: 'Sale A',
      contacts: 45,
      pending: 8,
      revenue: '850K',
      shipments: 12,
      avgDeal: '71K',
      percentage: 18,
      status: 'active'
    },
    {
      id: 'sale_b',
      rank: 2,
      name: 'Sale B',
      contacts: 38,
      pending: 6,
      revenue: '720K',
      shipments: 10,
      avgDeal: '72K',
      percentage: 16,
      status: 'active'
    },
    {
      id: 'sale_c',
      rank: 3,
      name: 'Sale C',
      contacts: 32,
      pending: 4,
      revenue: '650K',
      shipments: 8,
      avgDeal: '81K',
      percentage: 13,
      status: 'active'
    },
    {
      id: 'sale_d',
      rank: 4,
      name: 'Sale D',
      contacts: 28,
      pending: 3,
      revenue: '480K',
      shipments: 7,
      avgDeal: '69K',
      percentage: 11,
      status: 'active'
    },
    {
      id: 'sale_e',
      rank: 5,
      name: 'Sale E',
      contacts: 23,
      pending: 2,
      revenue: '420K',
      shipments: 6,
      avgDeal: '70K',
      percentage: 9,
      status: 'active'
    }
  ];

  const tableData = data || defaultData;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="w-48 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📋 Salesperson Performance Summary
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Ranking and performance metrics for all sales team members
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search salesperson..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="contacts">Sort by Contacts</option>
                <option value="shipments">Sort by Shipments</option>
                <option value="avgDeal">Sort by Avg Deal</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Items Per Page */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>Show 5</option>
                <option value={10}>Show 10</option>
                <option value={20}>Show 20</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('rank')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Rank</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('contacts')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Contacts</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('pending')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Pending</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Revenue</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('shipments')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Shipments</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('avgDeal')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Avg Deal</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((salesperson) => (
              <tr key={salesperson.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankBadgeColor(salesperson.rank)}`}>
                    {getRankIcon(salesperson.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {salesperson.name.charAt(salesperson.name.length - 1)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {salesperson.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {salesperson.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salesperson.contacts}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salesperson.pending}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {salesperson.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salesperson.shipments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salesperson.avgDeal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {salesperson.percentage}%
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(salesperson.percentage * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails?.(salesperson.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                      title="View Details"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onSendReport?.(salesperson.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                      title="Generate Report"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onSendEmail?.(salesperson.id)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{tableData.length}</span> of{' '}
            <span className="font-medium">{tableData.length}</span> results
          </div>
          
          {/* Export Options */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">📤 Export Options:</span>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              📊 Excel
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              📄 PDF
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              📧 Email Report
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              🔗 Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDashboardTable;
