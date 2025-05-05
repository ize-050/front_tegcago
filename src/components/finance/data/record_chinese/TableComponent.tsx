"use client";

import { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit2, FiSearch } from "react-icons/fi";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import axios from '../../../../../axios';
import { useAppDispatch } from "@/stores/hooks";
import { setModalRecordMoney, setEditRecord } from "@/stores/finance";
import { getCustomerAccounts } from "@/services/finance";

interface FinancialRecord {
  id: string;
  date: string;
  title: string;
  accountOwner: string;
  type: 'PAYMENT' | 'RECEIPT';
  amountRMB: number;
  transferDate: string;
  financial_transaction_id?: string;
  details?: string;
  transferSlip?: string;
  amountTHB?: number;
  exchangeRate?: number;
  payTo?: string;
}

interface Filters {
  search: string;
  type: 'ALL' | 'PAYMENT' | 'RECEIPT';
  account: string;
  startDate: string;
  endDate: string;
}



const TableComponent = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const recordsPerPage = 10;
  const dispatch = useAppDispatch();

  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'ALL',
    account: '',
    startDate: '',
    endDate: '',
  });

  // Add new state for form values
  const [filterForm, setFilterForm] = useState<Filters>({
    search: '',
    type: 'ALL',
    account: '',
    startDate: '',
    endDate: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountOptions, setAccountOptions] = useState<any[]>([]);

  // Fetch account options
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accounts = await getCustomerAccounts();
        if (Array.isArray(accounts) && accounts.length > 0) {
          setAccountOptions(accounts);
          // ไม่ต้องกำหนดค่า default เป็นบัญชีแรก ให้เป็น "ทั้งหมด" แทน
          setFilterForm(prev => ({ ...prev, account: '' }));
          setFilters(prev => ({ ...prev, account: '' }));
        } else {
          setAccountOptions([]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccountOptions([]);
      }
    };
    
    fetchAccounts();
  }, []);

  // Fetch records from API
  const fetchRecords = async () => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.type !== 'ALL') queryParams.append('type', filters.type);
      if (filters.account) queryParams.append('account', filters.account);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', '10');
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records?${queryParams.toString()}`);
      
      if (response.data && response.data.data) {
        console.log("record",response.data.data);
        setRecords(response.data.data || []);
        setFilteredRecords(response.data.data || []);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      // Set empty data on error
      setRecords([]);
      setFilteredRecords([]);
    }
  };

  // Fetch records when filters or page changes
  useEffect(() => {
    fetchRecords();
  }, [filters, currentPage]);

  // Calculate total amount for displayed records
  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      
      filteredRecords.forEach(record => {
        if (record.type === 'RECEIPT') {
          total += record.amountRMB;
        } else {
          total -= record.amountRMB;
        }
      });

      setTotalAmount(total);
    };

    calculateTotal();
  }, [filteredRecords]);
  
  useEffect(() => {
    console.log("filteredRecords",filteredRecords)
  }, [filteredRecords]);



  // Apply filters when filters change
  useEffect(() => {
    let result = [...records];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(record => 
        (record.title && record.title.toLowerCase().includes(searchLower)) ||
        (record.details && record.details.toLowerCase().includes(searchLower)) ||
        (record.payTo && record.payTo.toLowerCase().includes(searchLower)) ||
        (record.accountOwner && record.accountOwner.toLowerCase().includes(searchLower)) ||
        (record.amountRMB && record.amountRMB.toString().includes(searchLower)) ||
        (record.amountTHB && record.amountTHB.toString().includes(searchLower))
      );
    }

    // Filter by type
    if (filters.type !== 'ALL') {
      result = result.filter(record => record.type === filters.type);
    }

    // Filter by account
    if (filters.account) {
      result = result.filter(record => record.accountOwner === filters.account);
    }

    // Filter by date range
    if (filters.startDate) {
      result = result.filter(record => new Date(record.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(record => new Date(record.date) <= new Date(filters.endDate));
    }

    setFilteredRecords(result);
  }, [filters, records]);

  // Add event listener for refreshing data
  useEffect(() => {
    // Function to handle refresh event
    const handleRefresh = () => {
      fetchRecords();
    };

    handleRefresh();

    // Add event listener
    window.addEventListener('refreshFinancialRecords', handleRefresh);

    // Clean up
    return () => {
      window.removeEventListener('refreshFinancialRecords', handleRefresh);
    };
  }, [filters]); // Re-add event listener when filters change

  const handleEdit = async (id: string, type: 'PAYMENT' | 'RECEIPT') => {
    try {
      // Set the record to edit with its type
      dispatch(setEditRecord({ id, type }));
      
      // Open the modal
      dispatch(setModalRecordMoney(true));
    } catch (error) {
      console.error('Error editing record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Confirm deletion
      if (!confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
        return;
      }
      await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilterForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log("filterForm",filterForm);
    setFilters({...filterForm});
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleReset = () => {
    const resetFilters : Filters = {
      search: '',
      type: 'ALL',
      account: '',
      startDate: '',
      endDate: '',
    };
    setFilterForm(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Function to handle Excel export
  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      
      // Prepare query parameters for the export
      const queryParams = new URLSearchParams();
      if (filters.account) queryParams.append('account', filters.account);
      if (filters.type !== 'ALL') queryParams.append('type', filters.type);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      // Make API request to export Excel using axios
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/finance/export-excel?${queryParams.toString()}`
      );
      
      const data = response.data;
      
      if (data.success && data.fileUrl) {
        // Create a download link
        const downloadUrl = `${process.env.NEXT_PUBLIC_URL_API}${data.fileUrl}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'financial_records.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">ตัวกรอง</h2>
          
          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            )}
            Export Excel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทรายการ</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={filterForm.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="PAYMENT">จ่าย</option>
              <option value="RECEIPT">รับ</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">บัญชี</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={filterForm.account}
              onChange={(e) => handleFilterChange('account', e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {accountOptions.map((account: any) => (
                <option key={account.id} value={account.finance_name}>
                  {account.finance_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range - Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={filterForm.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          {/* Date Range - End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={filterForm.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex mt-6 space-x-3">
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-sm"
          >
            <FiSearch className="mr-2" />
            ค้นหา
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300 shadow-sm"
          >
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-gray-800">รายการเงิน</h3>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-sm text-gray-600">ยอดรวม</p>
                <p className={`text-lg font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalAmount.toLocaleString()} RMB
                </p>
              </div>
              <button
                className="bg-blue-950 hover:bg-blue-800 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg mr-1 mb-1"
                onClick={() => dispatch(setModalRecordMoney(true))}
                type="button"
              >
                + เพิ่มข้อมูล
              </button>
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">วันที่ทำรายการ</th>
              <th scope="col" className="px-6 py-3">ประเภท</th>
              <th scope="col" className="px-6 py-3">หัวข้อ</th>
              <th scope="col" className="px-6 py-3">บัญชี</th>
              <th scope="col" className="px-6 py-3">จำนวนเงิน (RMB)</th>
              <th scope="col" className="px-6 py-3">ตรวจสอบ</th>
              <th scope="col" className="px-6 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(record.date).toLocaleDateString('th-TH')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.type === 'PAYMENT' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {record.type === 'PAYMENT' ? 'จ่าย' : 'รับ'}
                  </span>
                </td>
                <td className="px-6 py-4">{record.title}</td>
                <td className="px-6 py-4">
                  {record.accountOwner}
                </td>
                <td className="px-6 py-4">
                  {record.amountRMB.toLocaleString()}
                  {record.type === 'RECEIPT' && record.amountTHB && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({record.amountTHB.toLocaleString()} THB)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {record.transferSlip && record?.financial_transaction_id ? (
                    <a href={`${process.env.NEXT_PUBLIC_URL_API}${record.transferSlip}`} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      ดูสลิป
                    </a>
                  ) :
                  record.transferSlip ? (
                    <a href={`${process.env.NEXT_PUBLIC_URL_API}/images/transferSlip/${record.transferSlip}`} target="_blank" rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline">
                   ดูสลิป
                 </a>
                  ) : (
                    <span className="text-gray-400">ไม่มีสลิป</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record.id, record.type)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <BsTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 p-4">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TableComponent;