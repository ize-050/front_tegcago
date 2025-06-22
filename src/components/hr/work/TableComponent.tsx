"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  Truck,
  MapPin,
  Calendar,
  Eye,
  X,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { FormInput, FormSelect } from "@/components/Base/Form";
import CommissionModal from "./CommissionModal";
import CommissionDetailsModal from "./CommissionDetailsModal";

interface Employee {
  id: string;
  user_id: string;
  fullname: string;
  email: string;
}

interface SalesEmployee {
  id: string;
  name?: string;
  fullname?: string;
  email?: string;
  role?: string;
}

interface PurchaseData {
  id: string;
  book_number: string;
  customer_number?: string;
  d_route?: string;
  d_transport?: string;
  d_term?: string;
  d_origin?: string;
  d_destination?: string;
  d_size_cabinet?: string;
  d_weight?: string;
  d_status?: string;
  createdAt: string;
  customer?: any;
  employees: Employee[];
  purchase_finance: {
    id: string;
    finance_status: string;
    ch_freight: string;
    th_total_shipping: string;
    total_all_th: string;
    billing_amount: string;
    total_profit_loss?: string;
  }[];
  commissionStatus?: {
    hasEmployeeCommission: boolean;
    hasCsCommission: boolean;
    employeeCommissionStatus: string | null;
    csCommissionStatus: string | null;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const TableComponent: React.FC = () => {
  // State for purchases data
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // State for filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBookingNumber, setFilterBookingNumber] = useState<string>("");
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [salesEmployees, setSalesEmployees] = useState<SalesEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCommissionDetailsModalOpen, setIsCommissionDetailsModalOpen] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(null);

  // Add commission rank state
  const [commissionRanks, setCommissionRanks] = useState<any[]>([]);
  const [loadingRanks, setLoadingRanks] = useState<boolean>(false);

  // Fetch sales employees
  const fetchSalesEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/employee/role/Sales`);
      if (response.data && response.data.success) {
        setSalesEmployees(response.data.data || []);
      } else {
        setSalesEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching sales employees:", error);
      setSalesEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch data with filters
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", paginationData.itemsPerPage.toString());
      
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      
      if (filterBookingNumber) {
        params.append("bookNumber", filterBookingNumber);
      }
      
      if (filterEmployeeId) {
        params.append("employeeId", filterEmployeeId);
      }
      
      if (filterStartDate) {
        params.append("startDate", filterStartDate);
      }
      
      if (filterEndDate) {
        params.append("endDate", filterEndDate);
      }

      // Fetch purchases data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/work?${params.toString()}`
      );

      // Check commission status for each purchase
      const purchasesWithCommissionStatus = await Promise.all(
        response.data.data.map(async (purchase: PurchaseData) => {
          try {
            const commissionStatusResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/status/${purchase.id}`);
            return {
              ...purchase,
              commissionStatus: commissionStatusResponse.data
            };
          } catch (error) {
            console.error(`Error fetching commission status for purchase ${purchase.id}:`, error);
            return purchase;
          }
        })
      );

      console.log("purchasesWithCommissionStatus",purchasesWithCommissionStatus)

      setPurchases(purchasesWithCommissionStatus);
      setPaginationData({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
        itemsPerPage: response.data.limit,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleApplyFilters = () => {
    setPaginationData(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterStatus("all");
    setFilterBookingNumber("");
    setFilterEmployeeId("");
    setFilterStartDate("");
    setFilterEndDate("");
    setPaginationData(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1);
  };

  useEffect(() => {
    fetchData();
    fetchSalesEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setPaginationData(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationData.totalPages) return;
    setPaginationData(prev => ({ ...prev, currentPage: page }));
    fetchData(page);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: th });
    } catch (error) {
      return "-";
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return "-";
    try {
      const numValue = parseFloat(value || "0");
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 2,
      }).format(numValue);
    } catch (error) {
      return "-";
    }
  };

  // Format profit/loss with color
  const formatProfitLoss = (value: string | undefined) => {
    if (!value) return "-";
    
    const numValue = parseFloat(value);
    const formattedValue = numValue.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    if (numValue > 0) {
      return (
        <span className="text-green-600 font-medium">{formattedValue}</span>
      );
    } else if (numValue < 0) {
      return (
        <span className="text-red-600 font-medium">{formattedValue}</span>
      );
    } else {
      return <span className="text-gray-600">{formattedValue}</span>;
    }
  };

  const handleOpenModal = (purchase: PurchaseData) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleOpenCommissionDetailsModal = (purchase: PurchaseData) => {
    setSelectedPurchase(purchase);
    setIsCommissionDetailsModalOpen(true);
  };

  const handleCloseCommissionDetailsModal = () => {
    setIsCommissionDetailsModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleSaveCommission = async (commissionData: any) => {
    try {
      console.log("Saving commission data:", commissionData);
      // ตัวอย่างการส่งข้อมูลไปยัง API
      // await axios.post("/hr/work/commission", commissionData);
      // หลังจากบันทึกสำเร็จ อาจจะต้องดึงข้อมูลใหม่
      // fetchData();
      alert("บันทึกข้อมูลค่าคอมมิชชั่นสำเร็จ");
    } catch (error) {
      console.error("Error saving commission data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // Function to handle Excel export
  const handleExportExcel = async () => {
    try {
      setLoading(true);
      
      // Build query parameters - ใช้ parameters เท่ากันกับตารางหลัก
      const params = new URLSearchParams();
      
      if (filterEmployeeId) {
        params.append('employeeId', filterEmployeeId);
      }
      
      if (filterStatus !== "all") {
        params.append('status', filterStatus);
      }
      
      if (filterBookingNumber) {
        params.append('bookNumber', filterBookingNumber);
      }
      
      if (filterStartDate) {
        params.append('startDate', filterStartDate);
      }
      
      if (filterEndDate) {
        params.append('endDate', filterEndDate);
      }
      
      // เพิ่ม month/year parameters จาก date filter
      if (filterStartDate) {
        const startDate = new Date(filterStartDate);
        params.append('month', (startDate.getMonth() + 1).toString());
        params.append('year', startDate.getFullYear().toString());
      }

      // Make API request to download Excel file
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/export?${params.toString()}`,
        method: 'GET',
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;

      // Set filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'commission_summary.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast.error('Failed to download Excel file');
    } finally {
      setLoading(false);
    }
  };

  // Filter data for display
  const filteredData = purchases.filter(item => {
    const paidFinance = item.purchase_finance.find(
      (finance) => finance.finance_status === "ชำระครบแล้ว"
    );
    return paidFinance !== undefined;
  });

  const totalPages = Math.ceil(paginationData.totalItems / paginationData.itemsPerPage);

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">ข้อมูลงานทั้งหมด</h2>
        
        {/* Filter Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="text-lg font-semibold">ค้นหาและกรอง</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่บุ๊คกิ้ง
              </label>
              <FormInput
                type="text"
                placeholder="ค้นหาเลขที่บุ๊คกิ้ง"
                value={filterBookingNumber}
                onChange={(e) => setFilterBookingNumber(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                พนักงานขาย
              </label>
              <FormSelect
                value={filterEmployeeId}
                onChange={(e) => setFilterEmployeeId(e.target.value)}
                className="w-full"
              >
                <option value="">ทั้งหมด</option>
                {salesEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name || employee.fullname}
                  </option>
                ))}
              </FormSelect>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สถานะการเงิน
              </label>
              <FormSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ชำระครบแล้ว">ชำระครบแล้ว</option>
                <option value="ชำระบางส่วน">ชำระบางส่วน</option>
                <option value="ยังไม่ชำระ">ยังไม่ชำระ</option>
              </FormSelect>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่เริ่มต้น
              </label>
              <FormInput
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่สิ้นสุด
              </label>
              <FormInput
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              ล้างตัวกรอง
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              ค้นหา
            </Button>
          </div>
        </div>
        
        {/* Table Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            แสดง {filteredData.length} รายการ จากทั้งหมด {paginationData.totalItems} รายการ
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
              onClick={handleExportExcel}
              disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-12 text-center">ลำดับ</Table.Th>
                <Table.Th className="w-52">เลขที่ Booking</Table.Th>
                <Table.Th className="w-28">เลขที่ลูกค้า</Table.Th>
                <Table.Th className="w-28">วันที่</Table.Th>
                <Table.Th className="w-32">เส้นทาง</Table.Th>
                <Table.Th className="w-28">ประเภทขนส่ง</Table.Th>
                <Table.Th className="w-32">ต้นทาง</Table.Th>
                <Table.Th className="w-32">ปลายทาง</Table.Th>
                <Table.Th className="w-28">ยอดบิล</Table.Th>
                <Table.Th className="w-28">กำไร/ขาดทุน</Table.Th>
                <Table.Th className="w-36">สถานะคอมมิชชั่น</Table.Th>
                <Table.Th className="w-36 text-center">จัดการ</Table.Th>
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
              ) : filteredData.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={12} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-gray-500">ไม่พบข้อมูล</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredData.map((item, index) => {
                  // หา purchase_finance ที่มีสถานะ "ชำระครบแล้ว"
                  const paidFinance = item.purchase_finance.find(
                    (finance) => finance.finance_status === "ชำระครบแล้ว"
                  );

                  // ถ้าไม่มี purchase_finance ที่มีสถานะ "ชำระครบแล้ว" ให้ข้ามรายการนี้
                  if (!paidFinance) return null;

                  const customerName = item.customer && typeof item.customer === 'object' && item.customer.cus_fullname 
                    ? item.customer.cus_fullname 
                    : "-";
                  
                  const profitLossValue = paidFinance && paidFinance.total_profit_loss
                    ? parseFloat(paidFinance.total_profit_loss)
                    : 0;

                  return (
                    <Table.Tr 
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Table.Td className="text-center">{(paginationData.currentPage - 1) * paginationData.itemsPerPage + index + 1}</Table.Td>
                      <Table.Td className="font-medium whitespace-nowrap">{item.book_number || "-"}</Table.Td>
                      <Table.Td className="whitespace-nowrap">{customerName}</Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {item.createdAt
                          ? formatDate(item.createdAt)
                          : "-"}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap">{item.d_route || "-"}</Table.Td>
                      <Table.Td>{item.d_transport || "-"}</Table.Td>
                      <Table.Td>{item.d_origin || "-"}</Table.Td>
                      <Table.Td>{item.d_destination || "-"}</Table.Td>
                      <Table.Td>
                        {paidFinance
                          ? formatCurrency(paidFinance.billing_amount)
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        {paidFinance
                          ? formatProfitLoss(paidFinance.total_profit_loss)
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.commissionStatus ? (
                          <div className="flex flex-col gap-1">
                            {item.commissionStatus.employeeCommissionStatus ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                พนักงาน: {item.commissionStatus.employeeCommissionStatus}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                พนักงาน: ยังไม่ได้ทำ
                              </span>
                            )}
                            
                            {item.commissionStatus.csCommissionStatus ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                CS: {item.commissionStatus.csCommissionStatus}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                CS: ยังไม่ได้ทำ
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            ยังไม่ได้ทำ
                          </span>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            className="w-full flex items-center justify-center"
                            onClick={() => handleOpenModal(item)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            คำนวณคอมมิชชั่น
                          </Button>
                          
                          <Button
                            size="sm"
                            className="w-full bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex items-center justify-center"
                            onClick={() => handleOpenCommissionDetailsModal(item)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            ดูรายละเอียด
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            แสดง {filteredData.length} จาก {paginationData.totalItems} รายการ
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => handlePageChange(paginationData.currentPage - 1)}
              disabled={paginationData.currentPage === 1}
              className={paginationData.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-md">
              หน้า {paginationData.currentPage} จาก {totalPages || 1}
            </div>
            <Button
              size="sm"
              onClick={() => handlePageChange(paginationData.currentPage + 1)}
              disabled={paginationData.currentPage === totalPages || totalPages === 0}
              className={paginationData.currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <FormSelect
              className="w-[120px] border-gray-300 rounded-md"
              value={paginationData.itemsPerPage.toString()}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setPaginationData(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }));
                handlePageChange(1);
              }}
            >
              <option value="10">10 รายการ</option>
              <option value="20">20 รายการ</option>
              <option value="50">50 รายการ</option>
              <option value="100">100 รายการ</option>
            </FormSelect>
          </div>
        </div>
      </div>

      {/* Commission Modal */}
      {isModalOpen && selectedPurchase && (
        <CommissionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          purchaseData={selectedPurchase}
          onSave={handleSaveCommission}
        />
      )}

      {/* Commission Details Modal */}
      {isCommissionDetailsModalOpen && selectedPurchase && (
        <CommissionDetailsModal
          isOpen={isCommissionDetailsModalOpen}
          onClose={handleCloseCommissionDetailsModal}
          purchaseId={selectedPurchase.id}
          purchaseDetails={{
            book_number: selectedPurchase.book_number,
            customer_number: selectedPurchase.customer_number,
            d_route: selectedPurchase.d_route,
            d_transport: selectedPurchase.d_transport,
            d_origin: selectedPurchase.d_origin,
            d_destination: selectedPurchase.d_destination,
            profit_loss: selectedPurchase.purchase_finance[0]?.total_profit_loss 
              ? parseFloat(selectedPurchase.purchase_finance[0].total_profit_loss) 
              : undefined,
            billing_amount: selectedPurchase.purchase_finance[0]?.billing_amount 
              ? parseFloat(selectedPurchase.purchase_finance[0].billing_amount) 
              : undefined
          }}
        />
      )}
    </div>
  );
};

export default TableComponent;
