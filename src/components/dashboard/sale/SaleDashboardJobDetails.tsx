'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Calendar, Filter, Eye, FileText, Mail, X, TrendingUp, TrendingDown } from 'lucide-react';

interface JobTypeBreakdown {
  jobType: string;
  count: number;
  revenue: string;
  avgValue: string;
  status: string;
  successRate: number;
  monthlyTrend: {
    value: number;
    isPositive: boolean;
    text: string;
  };
}

interface JobDetail {
  id: string;
  customerName: string;
  route: string;
  value: string;
  status: string;
  date: string;
}

interface SalespersonJobDetails {
  salespersonId: string;
  salespersonName: string;
  month: string;
  year: string;
  breakdown: JobTypeBreakdown[];
  totalJobs: number;
  totalRevenue: string;
  totalClosed: number;
  overallSuccessRate: number;
  monthlyChange: number;
}

interface SaleDashboardJobDetailsProps {
  data?: SalespersonJobDetails[];
  loading?: boolean;
}

/**
 * Sale Dashboard Job Details Breakdown Component
 * 
 * Features:
 * - Monthly job breakdown by salesperson and job type
 * - Expandable rows showing job type details
 * - Drill-down modal with individual job list
 * - Search and filter functionality within job details
 * - Export options for detailed job reports
 * - Interactive trend indicators and success rates
 */
const SaleDashboardJobDetails: React.FC<SaleDashboardJobDetailsProps> = ({
  data,
  loading = false
}) => {
  const [expandedSalesperson, setExpandedSalesperson] = useState<string | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<{ salesperson: string; jobType: string } | null>(null);
  const [jobListModal, setJobListModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - จะเชื่อมต่อกับ API จริงในภายหลัง
  const defaultData: SalespersonJobDetails[] = [
    {
      salespersonId: 'sale_a',
      salespersonName: 'Sale A',
      month: 'January',
      year: '2024',
      breakdown: [
        {
          jobType: 'Import-SEA',
          count: 8,
          revenue: '320K',
          avgValue: '40K',
          status: '6 Closed',
          successRate: 75,
          monthlyTrend: { value: 2, isPositive: true, text: '+2 vs Dec' }
        },
        {
          jobType: 'Export-AIR',
          count: 5,
          revenue: '275K',
          avgValue: '55K',
          status: '4 Closed',
          successRate: 80,
          monthlyTrend: { value: 1, isPositive: true, text: '+1 vs Dec' }
        },
        {
          jobType: 'Import-AIR',
          count: 4,
          revenue: '180K',
          avgValue: '45K',
          status: '3 Closed',
          successRate: 75,
          monthlyTrend: { value: 0, isPositive: true, text: 'Same as Dec' }
        },
        {
          jobType: 'Export-SEA',
          count: 3,
          revenue: '125K',
          avgValue: '42K',
          status: '2 Closed',
          successRate: 67,
          monthlyTrend: { value: -1, isPositive: false, text: '-1 vs Dec' }
        },
        {
          jobType: 'ALL IN',
          count: 2,
          revenue: '90K',
          avgValue: '45K',
          status: '2 Closed',
          successRate: 100,
          monthlyTrend: { value: 1, isPositive: true, text: '+1 vs Dec' }
        },
        {
          jobType: 'CIF',
          count: 1,
          revenue: '35K',
          avgValue: '35K',
          status: '1 Closed',
          successRate: 100,
          monthlyTrend: { value: 0, isPositive: true, text: 'Same as Dec' }
        }
      ],
      totalJobs: 23,
      totalRevenue: '1.025M',
      totalClosed: 18,
      overallSuccessRate: 78,
      monthlyChange: 3
    }
  ];

  // Mock job details for drill-down
  const mockJobDetails: JobDetail[] = [
    { id: '001', customerName: 'ABC Company', route: 'TH→CN SEA', value: '45K', status: 'ปิดการขาย', date: '15/01/24' },
    { id: '002', customerName: 'XYZ Trading', route: 'CN→TH SEA', value: '38K', status: 'ปิดการขาย', date: '18/01/24' },
    { id: '003', customerName: 'DEF Logistics', route: 'TH→JP SEA', value: '52K', status: 'ปิดการขาย', date: '22/01/24' },
    { id: '004', customerName: 'GHI Import', route: 'VN→TH SEA', value: '41K', status: 'ปิดการขาย', date: '25/01/24' },
    { id: '005', customerName: 'JKL Export', route: 'TH→SG SEA', value: '35K', status: 'ปิดการขาย', date: '28/01/24' },
    { id: '006', customerName: 'MNO Shipping', route: 'MY→TH SEA', value: '48K', status: 'ปิดการขาย', date: '30/01/24' },
    { id: '007', customerName: 'PQR Freight', route: 'TH→ID SEA', value: '33K', status: 'Sale ตีราคา', date: '31/01/24' },
    { id: '008', customerName: 'STU Commerce', route: 'KR→TH SEA', value: '28K', status: 'รอ CS ตีราคา', date: '31/01/24' }
  ];

  const jobDetailsData = data || defaultData;

  const handleExpandSalesperson = (salespersonId: string) => {
    setExpandedSalesperson(expandedSalesperson === salespersonId ? null : salespersonId);
  };

  const handleJobTypeClick = (salesperson: string, jobType: string) => {
    setSelectedJobType({ salesperson, jobType });
    setJobListModal(true);
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: { value: number; isPositive: boolean }) => {
    if (trend.value === 0) return '↔️';
    return trend.isPositive ? '↗️' : '↘️';
  };

  const getTrendColor = (trend: { value: number; isPositive: boolean }) => {
    if (trend.value === 0) return 'text-gray-600';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="w-64 h-6 bg-gray-200 rounded"></div>
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="w-48 h-5 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="flex space-x-4">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-18 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📋 Job Details Breakdown
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Monthly job breakdown by salesperson and job type with drill-down capability
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              📈 View Trend
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              📧 Send Report
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              📤 Export Details
            </button>
          </div>
        </div>
      </div>

      {/* Job Details Cards */}
      {jobDetailsData.map((salesperson) => (
        <div key={salesperson.salespersonId} className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Salesperson Header */}
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleExpandSalesperson(salesperson.salespersonId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {expandedSalesperson === salesperson.salespersonId ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <h4 className="text-lg font-semibold text-gray-900">
                    📋 {salesperson.salespersonName} - {salesperson.month} {salesperson.year} Job Details
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{salesperson.totalJobs}</div>
                  <div className="text-gray-500">Total Jobs</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{salesperson.totalRevenue}</div>
                  <div className="text-gray-500">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{salesperson.totalClosed}</div>
                  <div className="text-gray-500">Closed</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getSuccessRateColor(salesperson.overallSuccessRate)}`}>
                    {salesperson.overallSuccessRate}%
                  </div>
                  <div className="text-gray-500">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSalesperson === salesperson.salespersonId && (
            <div className="border-t border-gray-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Job Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Count</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Success Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Monthly Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesperson.breakdown.map((jobType, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleJobTypeClick(salesperson.salespersonId, jobType.jobType)}
                      >
                        <td className="py-3 px-4 font-medium text-blue-600 hover:text-blue-800">
                          {jobType.jobType}
                        </td>
                        <td className="py-3 px-4">{jobType.count}</td>
                        <td className="py-3 px-4 font-medium">{jobType.revenue}</td>
                        <td className="py-3 px-4">{jobType.avgValue}</td>
                        <td className="py-3 px-4">{jobType.status}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSuccessRateColor(jobType.successRate)}`}>
                            {jobType.successRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center space-x-1 text-sm ${getTrendColor(jobType.monthlyTrend)}`}>
                            <span>{getTrendIcon(jobType.monthlyTrend)}</span>
                            <span>{jobType.monthlyTrend.text}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">📊 Quick Actions:</span>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📈 View Trend
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📋 Job List
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📧 Send Report
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📤 Export Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Job List Modal */}
      {jobListModal && selectedJobType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📋 {selectedJobType.salesperson} - {selectedJobType.jobType} Jobs (January 2024)
                </h3>
                <p className="text-sm text-gray-500 mt-1">Individual job details and status</p>
              </div>
              <button
                onClick={() => setJobListModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="closed">ปิดการขาย</option>
                    <option value="pending">Sale ตีราคา</option>
                    <option value="waiting">รอ CS ตีราคา</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">#</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Route</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockJobDetails.map((job) => (
                      <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{job.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.customerName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.route}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{job.value}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'ปิดการขาย' ? 'bg-green-100 text-green-800' :
                            job.status === 'Sale ตีราคา' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
                              <FileText className="h-4 w-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors">
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  📊 Summary: 8 jobs, 320K revenue, 6 closed (75% success rate)
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">📤 Export:</span>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📊 Excel
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📄 PDF
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    📧 Email List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleDashboardJobDetails;
