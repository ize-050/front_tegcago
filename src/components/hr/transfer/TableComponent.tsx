"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "../../../../axios";
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Download,
  Calendar,
  User,
  DollarSign,
  Loader2,
  Filter
} from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommissionModal from "./CommissionModal";
import CommissionStatusButton from "./CommissionStatusButton";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface SalesSupportEmployee {
  id: string;
  fullname: string;
  email: string;
}

interface TransferData {
  id: string;
  type: string;
  date: string;
  documentNumber: string;
  customerId: string;
  salespersonId: string;
  amountRMB: number;
  transferDate: string;
  createdAt: string;
  customerDeposit?: {
    amountRMB: number;
    amount: number;
    exchangeRate: number;
    fee: number;
    receivingAccount: string;
    notes: string;
  };
  exchange?: {
    amountRMB: number;
    amount: number;
    exchangeRate: number;
    fee: number;
    type: string;
    receivingAccount: string;
    notes: string;
  };
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
  commission?: {
    id: string;
    amount: number;
    status: string;
    employee: {
      id: string;
      fullname: string;
      email: string;
    };
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const TransferTableComponent: React.FC = () => {
  // State for data
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // State for filters
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [salesSupportEmployees, setSalesSupportEmployees] = useState<SalesSupportEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);

  // State for modal
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);

  // State for export
  const [exportStartDate, setExportStartDate] = useState<Date | null>(null);
  const [exportEndDate, setExportEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch sales support employees
  const fetchSalesSupportEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/employees/salesupport`);
      if (response.data && response.data.success) {
        setSalesSupportEmployees(response.data.data || []);
      } else {
        setSalesSupportEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching sales support employees:", error);
      setSalesSupportEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch transfer data
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      
      if (filterEmployeeId) {
        params.append("employeeId", filterEmployeeId);
      }
      
      if (filterStartDate) {
        params.append("startDate", filterStartDate.toISOString().split('T')[0]);
      }
      
      if (filterEndDate) {
        params.append("endDate", filterEndDate.toISOString().split('T')[0]);
      }
      
      if (filterType) {
        params.append("type", filterType);
      }

      // Fetch transfers data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer?${params.toString()}`
      );
      
      if (response.data && response.data.success) {
        const transfersData = response.data.data || [];
        
        // Fetch commission data for each transfer
        const transfersWithCommission = await Promise.all(
          transfersData.map(async (transfer: TransferData) => {
            try {
              const commissionResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/${transfer.id}`
              );
              
              if (commissionResponse.data && commissionResponse.data.success && commissionResponse.data.data) {
                return {
                  ...transfer,
                  commission: commissionResponse.data.data
                };
              }
              
              return transfer;
            } catch (error) {
              console.error(`Error fetching commission for transfer ${transfer.id}:`, error);
              return transfer;
            }
          })
        );
        
        setTransfers(transfersWithCommission);
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
          itemsPerPage: response.data.limit || 10,
        });
      } else {
        setTransfers([]);
        setError(response.data?.message || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error: any) {
      console.error("Error fetching transfers:", error);
      setTransfers([]);
      setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Handle commission status update
  const handleCommissionStatusUpdate = (transferId: string, newStatus: string) => {
    // Update the transfers state with the new status
    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => {
        if (transfer.id === transferId && transfer.commission) {
          return {
            ...transfer,
            commission: {
              ...transfer.commission,
              status: newStatus
            }
          };
        }
        return transfer;
      })
    );
  };

  // Function to handle Excel export
  const handleExportExcel = async () => {
    try {
      if (!exportStartDate || !exportEndDate) {
        Swal.fire({
          title: 'คำเตือน',
          text: 'กรุณาเลือกช่วงเวลาสำหรับการส่งออกข้อมูล',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        });
        return;
      }
      
      setIsExporting(true);
      
      // Format dates for API request
      const formattedStartDate = format(exportStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(exportEndDate, "yyyy-MM-dd");
      
      // Create URL with query parameters
      const url = `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/export?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      
      // Use axios to get the file as a blob
      const response = await axios.get(url, {
        responseType: 'blob', // Important: responseType must be 'blob'
      });
      
      // Create a blob URL
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `commission_summary_${formattedStartDate}_to_${formattedEndDate}.xlsx`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the blob URL to free up memory
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchSalesSupportEmployees();
    fetchData();
  }, []);

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    fetchData(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterEmployeeId("");
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterType("");
    fetchData(1);
  };

  // Handle commission calculation
  const handleCalculateCommission = (transfer: TransferData) => {
    setSelectedTransfer(transfer);
    setIsCommissionModalOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) return "-";
    
    try {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 2,
      }).format(numValue);
    } catch (error) {
      return "-";
    }
  };

  // Get transaction type display text
  const getTransactionTypeDisplay = (transaction: TransferData) => {
    // Debug log เพื่อตรวจสอบข้อมูลที่ได้รับจาก API
    console.log("Transaction data:", {
      id: transaction.id,
      type: transaction.type,
      hasCustomerDeposit: !!transaction.customerDeposit,
      hasExchange: !!transaction.exchange,
      exchangeType: transaction.exchange?.type
    });
    
    // ตรวจสอบว่า type เป็นภาษาไทยอยู่แล้วหรือไม่
    const thaiTypes = ["ฝากโอน", "ฝากสั่ง", "ฝากเติม", "ฝากสั่งซื้อ", "ฝากชำระ"];
    if (transaction.type && thaiTypes.includes(transaction.type)) {
      return transaction.type;
    }
    
    // แปลงประเภทรายการเป็นภาษาไทย
    const typeMapping: Record<string, string> = {
      'DEPOSIT': 'ฝากโอน',
      'deposit': 'ฝากโอน',
      'PURCHASE': 'ฝากสั่ง',
      'purchase': 'ฝากสั่ง',
      'TOPUP': 'ฝากเติม',
      'topup': 'ฝากเติม',
      'ORDER': 'ฝากสั่งซื้อ',
      'order': 'ฝากสั่งซื้อ',
      'PAYMENT': 'ฝากชำระ',
      'payment': 'ฝากชำระ',
      'PAY': 'ฝากชำระ',
      'pay': 'ฝากชำระ'
    };
    
    if (transaction.type && typeMapping[transaction.type]) {
      return typeMapping[transaction.type];
    }
    
    // ตรวจสอบประเภทรายการจากข้อมูลที่มี
    // 1. ตรวจสอบจาก customerDeposit และ exchange ก่อน เนื่องจากเป็นข้อมูลที่ชัดเจนกว่า
    if (transaction.customerDeposit) {
      return "ฝากโอน";
    }
    
    if (transaction.exchange) {
      const exchangeType = transaction.exchange.type?.toLowerCase() || "";
      
      if (exchangeType === "purchase") {
        return "ฝากสั่ง";
      } else if (exchangeType === "topup") {
        return "ฝากเติม";
      } else if (exchangeType === "order") {
        return "ฝากสั่งซื้อ";
      } else if (exchangeType === "payment" || exchangeType === "pay") {
        return "ฝากชำระ";
      }
      
      // แสดงค่า type จาก exchange ถ้ามี
      return transaction.exchange.type || "ไม่ระบุ";
    }
    
    return transaction.type || "ไม่ระบุ";
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">ข้อมูลฝากสั่งฝากโอนทั้งหมด</h2>
        
        {/* Filter Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="text-lg font-semibold">ค้นหาและกรอง</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Filter by Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทรายการ
              </label>
              <div className="relative">
                <FormSelect
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="ฝากโอน">ฝากโอน</option>
                  <option value="ฝากสั่ง">ฝากสั่ง</option>
                  <option value="ฝากเติม">ฝากเติม</option>
                  <option value="ฝากสั่งซื้อ">ฝากสั่งซื้อ</option>
                  <option value="ฝากชำระ">ฝากชำระ</option>
                </FormSelect>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Filter by Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                พนักงาน
              </label>
              <div className="relative">
                <FormSelect
                  value={filterEmployeeId}
                  onChange={(e) => setFilterEmployeeId(e.target.value)}
                  className="pl-10"
                >
                  <option value="">ทั้งหมด</option>
                  {salesSupportEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullname}
                    </option>
                  ))}
                </FormSelect>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Date Range Filter - Combined in one column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ช่วงวันที่
              </label>
              <div className="flex space-x-2">
                {/* Start Date */}
                <div className="relative flex-1">
                  <DatePicker
                    selected={filterStartDate}
                    onChange={(date) => setFilterStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="เริ่มต้น"
                    className="form-input w-full pl-10 py-2 rounded-md border border-gray-300 text-sm"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                <span className="self-center text-gray-500">-</span>
                
                {/* End Date */}
                <div className="relative flex-1">
                  <DatePicker
                    selected={filterEndDate}
                    onChange={(date) => setFilterEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="สิ้นสุด"
                    className="form-input w-full pl-10 py-2 rounded-md border border-gray-300 text-sm"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleFilterChange}
              className="flex items-center"
              variant="primary"
            >
              <Search className="h-4 w-4 mr-2" />
              ค้นหา
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="secondary"
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              รีเซ็ตตัวกรอง
            </Button>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="mb-2 md:mb-0 text-sm text-gray-500">
            แสดง {transfers.length} รายการ จากทั้งหมด {paginationData.totalItems} รายการ
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => fetchData(paginationData.currentPage)}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              รีเฟรช
            </Button>
            <Button
              color="success"
              onClick={() => {
                if (!filterStartDate || !filterEndDate) {
                  Swal.fire({
                    title: "กรุณาเลือกช่วงวันที่",
                    text: "กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุดก่อนส่งออกข้อมูล",
                    icon: "warning",
                    confirmButtonText: "ตกลง",
                  });
                  return;
                }
                setExportStartDate(filterStartDate);
                setExportEndDate(filterEndDate);
              }}
              disabled={isExporting}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังส่งออก...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Export Options */}
        {exportStartDate && exportEndDate && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Export excel</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <p className="text-sm font-medium mb-1">Start Date:</p>
                <p className="text-base">{formatDate(exportStartDate.toISOString())}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">End Date:</p>
                <p className="text-base">{formatDate(exportEndDate.toISOString())}</p>
              </div>
              
              <div>
                <Button
                  onClick={handleExportExcel}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-12 text-center">ลำดับ</Table.Th>
                <Table.Th className="w-28">วันที่</Table.Th>
                <Table.Th className="w-52 whitespace-nowrap">เลขที่เอกสาร</Table.Th>
                <Table.Th className="w-32">ประเภท</Table.Th>
                <Table.Th className="w-40">พนักงาน</Table.Th>
                {/* <Table.Th className="w-28">จำนวนเงิน (RMB)</Table.Th>
                <Table.Th className="w-28">จำนวนเงิน (THB)</Table.Th>
                <Table.Th className="w-28">อัตราแลกเปลี่ยน</Table.Th>
                <Table.Th className="w-28">ค่าธรรมเนียม</Table.Th> */}
                <Table.Th className="w-40">บัญชีรับเงิน</Table.Th>
                <Table.Th className="w-28">ค่าคอม</Table.Th>
                <Table.Th className="w-28">สถานะ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={12} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : transfers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={12} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-gray-500">ไม่พบข้อมูล</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                transfers.map((item, index) => {
                  const isDeposit = !!item.customerDeposit;
                  const isExchange = !!item.exchange;
                  
                  // Get the appropriate data based on transaction type
                  const amountRMB = item.amountRMB || 
                    (isDeposit ? item.customerDeposit?.amountRMB : 
                     isExchange ? item.exchange?.amountRMB : 0);
                  
                  const amountTHB = isDeposit ? item.customerDeposit?.amount : 
                                    isExchange ? item.exchange?.amount : 0;
                  
                  const exchangeRate = isDeposit ? item.customerDeposit?.exchangeRate : 
                                       isExchange ? item.exchange?.exchangeRate : 0;
                  
                  const fee = isDeposit ? item.customerDeposit?.fee : 
                              isExchange ? item.exchange?.fee : 0;
                  
                  const receivingAccount = isDeposit ? item.customerDeposit?.receivingAccount : 
                                           isExchange ? item.exchange?.receivingAccount : "-";

                  return (
                    <Table.Tr 
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Table.Td className="text-center">{(paginationData.currentPage - 1) * paginationData.itemsPerPage + index + 1}</Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {item.date ? formatDate(item.date) : "-"}
                      </Table.Td>
                      <Table.Td className="font-medium whitespace-nowrap">{item.documentNumber || "-"}</Table.Td>
                      <Table.Th>{getTransactionTypeDisplay(item)}</Table.Th>
                      <Table.Td className="whitespace-nowrap">{item.user?.fullname || "-"}</Table.Td>
                      {/* <Table.Td>{amountRMB ? formatCurrency(amountRMB).replace("฿", "¥") : "-"}</Table.Td>
                      <Table.Td>{formatCurrency(amountTHB)}</Table.Td>
                      <Table.Td>{exchangeRate || "-"}</Table.Td>
                      <Table.Td>{formatCurrency(fee)}</Table.Td> */}
                      <Table.Td className="whitespace-nowrap">{receivingAccount || "-"}</Table.Td>
                      <Table.Td className="text-center">
                        <div className="flex space-x-1">
                          {item.commission ? (
                            <span className="text-xs font-medium">
                              {formatCurrency(item.commission.amount)}
                            </span>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              className="px-2 py-1 text-xs"
                              onClick={() => handleCalculateCommission(item)}
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              ค่าคอม
                            </Button>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        {item.commission ? (
                          <CommissionStatusButton 
                            commissionId={item.commission.id}
                            currentStatus={item.commission.status}
                            onStatusUpdate={(newStatus) => handleCommissionStatusUpdate(item.id, newStatus)}
                          />
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </div>
        
        {/* Pagination */}
        {paginationData.totalPages > 1 && (
          <div className="flex justify-center mt-5">
            <div className="flex space-x-1">
              <Button
                onClick={() => handlePageChange(1)}
                disabled={paginationData.currentPage === 1}
                className="px-3 py-1 text-sm"
                variant="secondary"
              >
                หน้าแรก
              </Button>
              
              <Button
                onClick={() => handlePageChange(paginationData.currentPage - 1)}
                disabled={paginationData.currentPage === 1}
                className="px-3 py-1 text-sm"
                variant="secondary"
              >
                ก่อนหน้า
              </Button>
              
              {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                let pageNum;
                if (paginationData.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (paginationData.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (paginationData.currentPage >= paginationData.totalPages - 2) {
                  pageNum = paginationData.totalPages - 4 + i;
                } else {
                  pageNum = paginationData.currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm ${
                      paginationData.currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    variant={paginationData.currentPage === pageNum ? "primary" : "secondary"}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => handlePageChange(paginationData.currentPage + 1)}
                disabled={paginationData.currentPage === paginationData.totalPages}
                className="px-3 py-1 text-sm"
                variant="secondary"
              >
                ถัดไป
              </Button>
              
              <Button
                onClick={() => handlePageChange(paginationData.totalPages)}
                disabled={paginationData.currentPage === paginationData.totalPages}
                className="px-3 py-1 text-sm"
                variant="secondary"
              >
                หน้าสุดท้าย
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Commission Modal */}
      {isCommissionModalOpen && selectedTransfer && (
        <CommissionModal
          isOpen={isCommissionModalOpen}
          onClose={() => {
            setIsCommissionModalOpen(false);
            setSelectedTransfer(null);
          }}
          transferId={selectedTransfer.id}
          transferType={getTransactionTypeDisplay(selectedTransfer)}
          salespersonId={selectedTransfer.salespersonId}
        />
      )}
    </div>
  );
};

export default TransferTableComponent;
