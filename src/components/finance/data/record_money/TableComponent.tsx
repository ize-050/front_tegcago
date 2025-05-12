"use client";

import { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import axios from '../../../../../axios';
import { useAppDispatch } from "@/stores/hooks";
import { setModalRecordMoney, setEditRecord } from "@/stores/finance";
import Swal from "sweetalert2";

// Components
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";

interface RecordMoneyData {
  id: string;
  date: string;
  invoiceNumber: string;
  referenceNumber: string;
  type: string;
  deposit_purpose?: string; // เพิ่มฟิลด์สำหรับเก็บข้อมูลว่าฝากเรื่องอะไร
  customerName: string;
  productType: string;
  productDetail: string;
  amountRMB: number;
  exchangeRate: number;
  amountTHB: number;
  transferFee: number;
  exchangeRateFee: number;
  totalAmountTHB: number;
  transferDate: string;
  transferSlipUrl: string;
  recipientBank: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onRefresh?: () => void;
}

const TableComponent = ({ onRefresh }: Props) => {
  const dispatch = useAppDispatch();
  const [records, setRecords] = useState<RecordMoneyData[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RecordMoneyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchedVal, setSearchedVal] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/finance/record-money');
      console.log('API Response:', response.data);
      console.log('Records from API:', response.data.records);
      
      // เพิ่มการแสดงข้อมูล deposit_purpose ในคอนโซล
      if (response.data.records && response.data.records.length > 0) {
        console.log('First record:', response.data.records[0]);
        console.log('deposit_purpose in first record:', response.data.records[0].deposit_purpose);
        
        // แปลงข้อมูลเพื่อให้มี deposit_purpose
        const processedRecords = response.data.records.map((record: any) => {
          // ถ้ามี customerDeposit และมี deposit_purpose ใน customerDeposit
          if (record.customerDeposit && record.customerDeposit.deposit_purpose) {
            return {
              ...record,
              deposit_purpose: record.customerDeposit.deposit_purpose
            };
          }
          return record;
        });
        
        setRecords(processedRecords || []);
        setFilteredRecords(processedRecords || []);
        setTotalPage(Math.ceil((processedRecords?.length || 0) / 10));
        return;
      }
      
      setRecords(response.data.records || []);
      setFilteredRecords(response.data.records || []);
      setTotalPage(Math.ceil((response.data.records?.length || 0) / 10));
    } catch (error) {
      console.error("Error fetching records:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchedVal, typeFilter, startDate, endDate, records]);

  const filterData = () => {
    let filtered = [...records];

    // Filter by search term
    if (searchedVal) {
      filtered = filtered.filter(
        (record) =>
          record.customerName.toLowerCase().includes(searchedVal.toLowerCase()) ||
          record.invoiceNumber.toLowerCase().includes(searchedVal.toLowerCase()) ||
          record.referenceNumber.toLowerCase().includes(searchedVal.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) <= new Date(endDate)
      );
    }

    setFilteredRecords(filtered);
    setTotalPage(Math.ceil(filtered.length / 10));
    setCurrentPage(1);
  };

  const handleEdit = (record: RecordMoneyData) => {
    dispatch(setEditRecord(record));
    dispatch(setModalRecordMoney(true));
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล",
      text: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/finance/record-money/${id}`);
          Swal.fire({
            title: "ลบข้อมูลสำเร็จ",
            text: "ข้อมูลถูกลบออกจากระบบเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
          fetchRecords();
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error("Error deleting record:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Function to export data to Excel
  const exportToExcel = async () => {
    try {
      // Create URL with query parameters
      const baseUrl = `${process.env.NEXT_PUBLIC_URL_API}/finance/export-record-money`;
      const queryParams = new URLSearchParams();
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      if (searchedVal) queryParams.append('search', searchedVal);
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      
      // Make request with authorization header
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob', // Important for file downloads
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'รายงานการเงิน.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return { label: "ฝากสั่ง", color: "success" };
      case "payment":
        return { label: "ชำระ", color: "primary" };
      default:
        return { label: "อื่นๆ", color: "dark" };
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredRecords.slice(startIndex, endIndex);
  };

  return (
    <>
      <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 mb-5">
        <div className="w-full sm:w-auto flex gap-2">
          <FormInput
            type="text"
            className="w-56 box"
            placeholder="ค้นหา..."
            value={searchedVal}
            onChange={(e) => setSearchedVal(e.target.value)}
          />
          <FormSelect
            className="w-40 box"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">ทั้งหมด</option>
            <option value="deposit">ฝากสั่ง</option>
            <option value="payment">ชำระ</option>
            <option value="other">อื่นๆ</option>
          </FormSelect>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center ml-2"
          >
            <FaFileExcel className="w-4 h-4 mr-1" />
            Export Excel
          </button>
        </div>
        <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto flex gap-2">
          <FormInput
            type="date"
            className="w-40 box"
            placeholder="วันที่เริ่มต้น"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <FormInput
            type="date"
            className="w-40 box"
            placeholder="วันที่สิ้นสุด"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>
      </div>

      <div className="intro-y box p-5 mt-5">
        <div className="overflow-x-auto">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">วันที่</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">เลขที่เอกสาร</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">ประเภท</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">ฝากเรื่อง</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">ลูกค้า</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap text-right">จำนวนเงิน (RMB)</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap text-right">จำนวนเงิน (THB)</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap text-right">รวม (THB)</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">วันที่โอน</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap text-center">จัดการ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={9} className="text-center py-4">
                    กำลังโหลดข้อมูล...
                  </Table.Td>
                </Table.Tr>
              ) : getCurrentPageData().length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={9} className="text-center py-4">
                    ไม่พบข้อมูล
                  </Table.Td>
                </Table.Tr>
              ) : (
                getCurrentPageData().map((record) => (
                  <Table.Tr key={record.id} className="intro-x">
                    <Table.Td>
                      {new Date(record.date).toLocaleDateString("th-TH")}
                    </Table.Td>
                    <Table.Td>{record.invoiceNumber || "-"}</Table.Td>
                    <Table.Td>
                      <div className={`flex items-center justify-center whitespace-nowrap text-${getTypeLabel(record.type).color}`}>
                        {/* <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" /> */}
                        {getTypeLabel(record.type).label}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {record.type === "deposit" ? (
                        <div className="text-sm font-medium text-blue-600">
                          {record.deposit_purpose || "-"}
                        </div>
                      ) : (
                        "-"
                      )}
                    </Table.Td>
                    <Table.Td>{record.customerName}</Table.Td>
                    <Table.Td className="text-right">{formatCurrency(record.amountRMB)}</Table.Td>
                    <Table.Td className="text-right">{formatCurrency(record.amountTHB)}</Table.Td>
                    <Table.Td className="text-right font-medium">{formatCurrency(record.totalAmountTHB)}</Table.Td>
                    <Table.Td>
                      {record.transferDate
                        ? new Date(record.transferDate).toLocaleDateString("th-TH")
                        : "-"}
                    </Table.Td>
                    <Table.Td className="table-report__action w-56">
                      <div className="flex justify-center items-center">
                        <a
                          className="flex items-center mr-3 bg-blue-100 hover:bg-blue-200 text-primary px-2 py-1 rounded cursor-pointer"
                          onClick={() => handleEdit(record)}
                        >
                          <Lucide icon="PenLine" className="w-4 h-4 mr-1" />
                          แก้ไข
                        </a>
                        <a
                          className="flex items-center text-danger cursor-pointer"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                          ลบ
                        </a>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>

        <div className="flex justify-end mt-5 bg-gray-100 flex-wrap items-center p-1 flex-reverse gap-y-2 sm:flex-row">
          <nav className="relative z-0 inline-flex rounded-md shadow-md -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="inline-flex">
              {totalPage > 0 && [...Array(totalPage)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={currentPage === pageNumber}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === pageNumber
                        ? "text-primary-600 bg-gray-400 rounded-lg"
                        : "text-gray-700"
                    } hover:bg-gray-50 disabled:opacity-50`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
