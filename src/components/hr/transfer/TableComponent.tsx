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
  Filter,
  Check,
  X,
  CheckCircle
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
import EditCommissionModal from "./EditCommissionModal"; // Import EditCommissionModal
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [salesSupportEmployees, setSalesSupportEmployees] = useState<SalesSupportEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);

  // State for modal
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);
  const [isEditCommissionModalOpen, setIsEditCommissionModalOpen] = useState<boolean>(false); // Add state for EditCommissionModal

  // State for export
  const [exportMonth, setExportMonth] = useState<string>('');
  const [exportYear, setExportYear] = useState<string>('');
  const [exportStartDate, setExportStartDate] = useState<Date | null>(null);
  const [exportEndDate, setExportEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // State สำหรับ bulk commission
  const [selectedTransfers, setSelectedTransfers] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState<boolean>(false);
  const [isBulkStatusUpdating, setIsBulkStatusUpdating] = useState<boolean>(false);

  // ข้อมูลปีและเดือน
  const years = [
    new Date().getFullYear().toString(),
    (new Date().getFullYear() - 1).toString(),
    (new Date().getFullYear() - 2).toString(),
  ];

  const months = [
    { value: "", label: "ทุกเดือน" },
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

  // Generate months and years for dropdowns
  const currentYear = new Date().getFullYear();
  const exportYears = [
    { value: '', label: 'ทั้งหมด' },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  // ฟังก์ชันสำหรับหาวันสุดท้ายของเดือน
  const getLastDayOfMonth = (year: string, month: string): string => {
    // สร้างวันที่ 1 ของเดือนถัดไป แล้วลบ 1 วัน
    const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const nextMonthYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const lastDay = new Date(nextMonthYear, nextMonth - 1, 0);
    return `${year}-${month}-${lastDay.getDate()}`;
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงเดือน
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    setFilterMonth(selectedMonth);
    
    // รีเซ็ตวันที่เริ่มต้นและสิ้นสุดเมื่อเลือกเดือน
    setFilterStartDate(null);
    setFilterEndDate(null);
    
    if (selectedMonth && filterYear) {
      // ถ้าเลือกเดือนและปี ให้กำหนดช่วงวันที่ของเดือนนั้น
      const startDate = new Date(`${filterYear}-${selectedMonth}-01`);
      const lastDay = getLastDayOfMonth(filterYear, selectedMonth);
      const endDate = new Date(lastDay);
      
      // ไม่ต้องเซ็ต filterStartDate และ filterEndDate เพราะจะใช้ filterMonth และ filterYear แทน
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงปี
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    setFilterYear(selectedYear);
    
    // รีเซ็ตวันที่เริ่มต้นและสิ้นสุดเมื่อเลือกปี
    setFilterStartDate(null);
    setFilterEndDate(null);
    
    if (filterMonth && selectedYear) {
      // ถ้าเลือกเดือนและปี ให้กำหนดช่วงวันที่ของเดือนนั้น
      const startDate = new Date(`${selectedYear}-${filterMonth}-01`);
      const lastDay = getLastDayOfMonth(selectedYear, filterMonth);
      const endDate = new Date(lastDay);
      
      // ไม่ต้องเซ็ต filterStartDate และ filterEndDate เพราะจะใช้ filterMonth และ filterYear แทน
    }
  };

  // Fetch sales support employees
  const fetchSalesSupportEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/salesupport/employees`);
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
      
      if (searchTerm.trim()) {
        params.append("searchTerm", searchTerm.trim());
      }
      
      if (filterEmployeeId) {
        params.append("employeeId", filterEmployeeId);
      }
      
      // จัดการ date parameters
      if (filterMonth && filterYear) {
        // ถ้าเลือกทั้งเดือนและปี
        params.append("startDate", `${filterYear}-${filterMonth}-01`);
        params.append("endDate", getLastDayOfMonth(filterYear, filterMonth));
      } else if (filterYear && !filterMonth) {
        // ถ้าเลือกเฉพาะปี
        params.append("startDate", `${filterYear}-01-01`);
        params.append("endDate", `${filterYear}-12-31`);
      } else {
        // ใช้ date picker
        if (filterStartDate) {
          params.append("startDate", filterStartDate.toISOString().split('T')[0]);
        }
        
        if (filterEndDate) {
          params.append("endDate", filterEndDate.toISOString().split('T')[0]);
        }
      }
      
      if (filterType) {
        params.append("type", filterType);
      }

      // Debug log เพื่อตรวจสอบ parameters
      console.log("Filter parameters:", {
        searchTerm,
        filterEmployeeId,
        filterMonth,
        filterYear,
        filterType,
        apiUrl: `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer?${params.toString()}`
      });

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

  // ฟังก์ชันสำหรับ bulk selection
  const handleSelectTransfer = (transferId: string) => {
    const newSelected = new Set(selectedTransfers);
    if (newSelected.has(transferId)) {
      newSelected.delete(transferId);
    } else {
      newSelected.add(transferId);
    }
    setSelectedTransfers(newSelected);
    
    // Update select all status
    const eligibleTransfers = transfers.filter(t => !t.commission || t.commission.status === 'PENDING');
    setIsSelectAll(newSelected.size === eligibleTransfers.length && eligibleTransfers.length > 0);
  };

  const handleSelectAll = () => {
    const eligibleTransfers = transfers.filter(t => !t.commission || t.commission.status === 'PENDING');
    
    if (isSelectAll) {
      // Deselect all
      setSelectedTransfers(new Set());
      setIsSelectAll(false);
    } else {
      // Select all eligible transfers
      const allIds = new Set(eligibleTransfers.map(t => t.id));
      setSelectedTransfers(allIds);
      setIsSelectAll(true);
    }
  };

  // ฟังก์ชันสำหรับ bulk commission processing
  const handleBulkCommission = async () => {
    if (selectedTransfers.size === 0) {
      toast.error("กรุณาเลือกรายการที่ต้องการทำค่าคอมมิชชั่น");
      return;
    }

    try {
      setIsBulkProcessing(true);
      
      // ดึงข้อมูล transfer types ก่อน
      const transferTypesResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types`);
      
      if (!transferTypesResponse.data.success) {
        toast.error("ไม่สามารถดึงข้อมูลอัตราค่าคอมมิชชั่นได้");
        return;
      }
      
      const transferTypesData = transferTypesResponse.data.data;
      const selectedIds = Array.from(selectedTransfers);
      
      // สร้าง array ของข้อมูลที่จะส่งไป API พร้อมกับ commission rate
      const commissionData = selectedIds.map(transferId => {
        const transfer = transfers.find(t => t.id === transferId);
        if (!transfer) return null;
        
        // หา transfer type ที่ตรงกัน
        const transferTypeDisplay = getTransactionTypeDisplay(transfer);
        let matchingType = null;
        
        // แปลงประเภทให้ตรงกับ API
        if (transferTypeDisplay === "ฝากโอน") {
          matchingType = transferTypesData.find((type: any) => type.type_name.includes("ฝากโอน"));
        } else if (transferTypeDisplay === "ฝากสั่ง") {
          matchingType = transferTypesData.find((type: any) => type.type_name.includes("ฝากสั่ง"));
        } else if (transferTypeDisplay === "ฝากเติม") {
          matchingType = transferTypesData.find((type: any) => type.type_name.includes("ฝากเติม"));
        }
        
        return {
          transferId: transferId,
          salespersonId: transfer.salespersonId,
          commission: matchingType ? matchingType.commission_rate : 0
        };
      }).filter(item => item !== null);
      
      // เรียก API หลายครั้งสำหรับแต่ละรายการ
      let successCount = 0;
      let failCount = 0;
      
      for (const item of commissionData) {
        try {
          const transfer = transfers.find(t => t.id === item.transferId);
          let response;
          
          console.log(`Processing transfer ${item.transferId}:`, {
            hasCommission: !!transfer?.commission,
            commissionId: transfer?.commission?.id,
            currentAmount: transfer?.commission?.amount,
            newAmount: item.commission
          });
          
          // ใช้ POST method เหมือนใน CommissionModal (API จะจัดการ upsert เอง)
          console.log(`Processing commission for transfer ${item.transferId} with amount ${item.commission}`);
          response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission`, item);
          console.log('API response:', response.data);
          
          if (response.data.success) {
            successCount++;
          } else {
            console.error('API returned success: false', response.data);
            failCount++;
          }
        } catch (error) {
          console.error(`Error processing commission for transfer ${item.transferId}:`, error);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
          failCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`คำนวณค่าคอมมิชชั่นสำเร็จ ${successCount} รายการ${failCount > 0 ? ` (ล้มเหลว ${failCount} รายการ)` : ''}`);
        
        // Clear selections
        setSelectedTransfers(new Set());
        setIsSelectAll(false);
        
        // Refresh data
        fetchData(paginationData.currentPage);
      } else {
        toast.error("ไม่สามารถคำนวณค่าคอมมิชชั่นได้");
      }
    } catch (error: any) {
      console.error("Error in bulk commission:", error);
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการคำนวณค่าคอมมิชชั่น");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // ฟังก์ชันสำหรับ bulk status update
  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedTransfers.size === 0) {
      toast.error("กรุณาเลือกรายการที่ต้องการอัปเดตสถานะ");
      return;
    }

    // กรองเฉพาะรายการที่มี commission
    const transfersWithCommission = Array.from(selectedTransfers).filter(transferId => {
      const transfer = transfers.find(t => t.id === transferId);
      return transfer && transfer.commission;
    });

    if (transfersWithCommission.length === 0) {
      toast.error("ไม่พบรายการที่มีค่าคอมมิชชั่นในรายการที่เลือก");
      return;
    }

    try {
      setIsBulkStatusUpdating(true);
      
      // รวบรวม commission IDs ที่ต้องอัปเดต
      const commissionIds = transfersWithCommission.map(transferId => {
        const transfer = transfers.find(t => t.id === transferId);
        return transfer?.commission?.id;
      }).filter(id => id); // กรองเฉพาะ ID ที่มีค่า

      console.log('Updating commission status for IDs:', commissionIds);

      // เรียก API สำหรับ bulk update
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/bulk-status`,
        {
          commissionIds,
          status
        }
      );

      if (response.data && response.data.success) {
        const statusDisplay = status === 'PAID' ? 'จ่ายแล้ว' : 
                             status === 'APPROVED' ? 'อนุมัติแล้ว' : 
                             status === 'PENDING' ? 'รอดำเนินการ' : status;
        
        toast.success(`อัปเดตสถานะเป็น "${statusDisplay}" สำเร็จ ${commissionIds.length} รายการ`);
        
        // Clear selections
        setSelectedTransfers(new Set());
        setIsSelectAll(false);
        
        // Refresh data
        fetchData(paginationData.currentPage);
      } else {
        toast.error(response.data?.message || "ไม่สามารถอัปเดตสถานะได้");
      }
    } catch (error: any) {
      console.error("Error in bulk status update:", error);
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setIsBulkStatusUpdating(false);
    }
  };

  // Function to handle Excel export
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      
      // Create URL with optional query parameters
      let url = `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/export`;
      
      // Add month/year parameters if selected
      if (exportMonth && exportYear) {
        url += `?month=${exportMonth}&year=${exportYear}`;
      }
      
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
      
      // Generate filename based on date selection
      const filename = (exportMonth && exportYear) 
        ? `commission_summary_${exportMonth}_${exportYear}.xlsx`
        : `commission_summary_all_data.xlsx`;
      
      link.setAttribute("download", filename);
      
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

  // Auto search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchData(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto filter when filter values change
  useEffect(() => {
    fetchData(1);
  }, [filterEmployeeId, filterMonth, filterYear, filterType]);

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
    setSearchTerm("");
    setFilterEmployeeId("");
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterType("");
    setFilterMonth("");
    setFilterYear(new Date().getFullYear().toString());
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

  // Format date to MM/YYYY format
  const formatMonthYear = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      // Format as MM/YYYY
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
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
      'ORDER': 'ฝากสั่ง',
      'order': 'ฝากสั่ง',
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
        return "ฝากสั่ง";
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
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
              <div className="relative">
                <FormInput
                  type="text"
                  placeholder="ค้นหาตามเลขที่เอกสาร หรือ รหัสลูกค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">พนักงาน</label>
              <FormSelect
                value={filterEmployeeId}
                onChange={(e) => setFilterEmployeeId(e.target.value)}
                className="w-full"
              >
                <option value="">ทั้งหมด</option>
                {salesSupportEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullname}
                  </option>
                ))}
              </FormSelect>
            </div>

            {/* เพิ่มตัวกรองตามปีและเดือน */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">ช่วงเวลา</label>
              <div className="flex space-x-2">
                <FormSelect
                  value={filterYear}
                  onChange={handleYearChange}
                  className="w-full"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </FormSelect>

                <FormSelect
                  value={filterMonth}
                  onChange={handleMonthChange}
                  className="w-full"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </FormSelect>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
              <FormSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full"
              >
                <option value="">ทั้งหมด</option>
                <option value="DEPOSIT">ฝากโอน</option>
                <option value="PURCHASE">ฝากสั่ง</option>
              </FormSelect>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleFilterChange}
              className="flex items-center"
              variant="primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              กรอง
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
        
        {/* Export Options - Always visible */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold mb-2">Export Excel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {exportStartDate && exportEndDate ? (
              <>
                <div>
                  <p className="text-sm font-medium mb-1">Start Date:</p>
                  <p className="text-base">{formatDate(exportStartDate.toISOString())}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">End Date:</p>
                  <p className="text-base">{formatDate(exportEndDate.toISOString())}</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>จะส่งออกข้อมูลในช่วงวันที่ที่เลือก</p>
                </div>
              </>
            ) : (exportMonth && exportYear) ? (
              <>
                <div>
                  <p className="text-sm font-medium mb-1">Month:</p>
                  <p className="text-base">{months.find(m => m.value === exportMonth)?.label}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Year:</p>
                  <p className="text-base">{exportYear}</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>จะส่งออกข้อมูลของเดือนและปีที่เลือก</p>
                </div>
              </>
            ) : (
              <div className="md:col-span-3 text-sm text-gray-600">
                <p>ไม่ได้เลือกช่วงวันที่ - จะส่งออกข้อมูลทั้งหมด</p>
              </div>
            )}
            
            <div>
              <Button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="w-full"
                color="success"
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
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
              <FormSelect
                value={exportMonth}
                onChange={(e) => setExportMonth(e.target.value)}
                className="w-full"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </FormSelect>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
              <FormSelect
                value={exportYear}
                onChange={(e) => setExportYear(e.target.value)}
                className="w-full"
              >
                {exportYears.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </FormSelect>
            </div>
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
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTransfers.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  เลือก {selectedTransfers.size} รายการ
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  onClick={handleBulkCommission}
                  disabled={isBulkProcessing || isBulkStatusUpdating}
                  className="flex items-center"
                >
                  {isBulkProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังประมวลผล...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      คำนวณค่าคอมทั้งหมด
                    </>
                  )}
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleBulkStatusUpdate('PAID')}
                  disabled={isBulkProcessing || isBulkStatusUpdating}
                  className="flex items-center"
                >
                  {isBulkStatusUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังอัปเดต...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-white" />
                      <span className="text-white">ปรับสถานะจ่ายแล้ว</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedTransfers(new Set());
                    setIsSelectAll(false);
                  }}
                  className="flex items-center"
                  disabled={isBulkProcessing || isBulkStatusUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  ยกเลิกเลือก
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
                <Table.Th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </Table.Th>
                <Table.Th className="w-12 text-center">ลำดับ</Table.Th>
                <Table.Th className="w-28">เดือน/ปี</Table.Th>
                <Table.Th className="w-28">วันที่ทำรายการ</Table.Th>

                <Table.Th className="w-52 whitespace-nowrap">เลขที่เอกสาร</Table.Th>
                <Table.Th className="w-32">รหัสลูกค้า</Table.Th>
                <Table.Th className="w-32">ประเภท</Table.Th>
                <Table.Th className="w-40">พนักงาน</Table.Th>
                {/* <Table.Th className="w-28">จำนวนเงิน (RMB)</Table.Th>
                <Table.Th className="w-28">จำนวนเงิน (THB)</Table.Th>
                <Table.Th className="w-28">อัตราแลกเปลี่ยน</Table.Th>
                <Table.Th className="w-28">ค่าธรรมเนียม</Table.Th> */}
                <Table.Th className="w-28">ค่าคอม</Table.Th>
                <Table.Th className="w-28">สถานะ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={9} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : transfers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={9} className="text-center py-10">
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
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedTransfers.has(item.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Table.Td className="text-center">
                        {(!item.commission || item.commission.status === 'PENDING') && (
                          <input
                            type="checkbox"
                            checked={selectedTransfers.has(item.id)}
                            onChange={() => handleSelectTransfer(item.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        )}
                      </Table.Td>
                      <Table.Td className="text-center">{(paginationData.currentPage - 1) * paginationData.itemsPerPage + index + 1}</Table.Td>
                      <Table.Td>{formatMonthYear(item.date)}</Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {item.date ? formatDate(item.date) : "-"}
                      </Table.Td>

                      <Table.Td className="whitespace-nowrap">{item.documentNumber || "-"}</Table.Td>
                      <Table.Td className="whitespace-nowrap">{item.customerId || "-"}</Table.Td>
                      <Table.Th>{getTransactionTypeDisplay(item)}</Table.Th>
                      <Table.Td className="whitespace-nowrap">{item.user?.fullname || "-"}</Table.Td>
                      {/* <Table.Td>{amountRMB ? formatCurrency(amountRMB).replace("฿", "¥") : "-"}</Table.Td>
                      <Table.Td>{formatCurrency(amountTHB)}</Table.Td>
                      <Table.Td>{exchangeRate || "-"}</Table.Td>
                      <Table.Td>{formatCurrency(fee)}</Table.Td> */}
                      <Table.Td className="text-center">
                        <div className="flex space-x-1">
                          {item.commission ? (
                            <>
                              <span className="text-xs font-medium">
                                {formatCurrency(item.commission.amount)}
                              </span>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="px-2 py-1 text-xs ml-2"
                                onClick={() => {
                                  setSelectedTransfer(item);
                                  setIsEditCommissionModalOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                แก้ไข
                              </Button>
                            </>
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
      
      {/* Edit Commission Modal */}
      {isEditCommissionModalOpen && selectedTransfer && selectedTransfer.commission && (
        <EditCommissionModal
          isOpen={isEditCommissionModalOpen}
          onClose={() => {
            setIsEditCommissionModalOpen(false);
            setSelectedTransfer(null);
          }}
          commissionId={selectedTransfer.commission.id}
          onSuccess={() => {
            // Refresh data after successful update
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default TransferTableComponent;
