"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
    Search, FileText, ChevronLeft, ChevronRight, Filter, RefreshCw,
    TrendingUp, DollarSign, Users, Truck, MapPin, Calendar, Eye, X, Download,
    Settings, User, UserPlus, Briefcase
} from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Tabs from "@/components/Base/Tabs";
import CommissionModal from "./CommissionModal";

// ส่วนของ Interface
interface Employee {
    id: string;
    user_id: string;
    fullname: string;
    email: string;
    role?: string;
    name?: string;
    department?: string;
}

interface SalesEmployee {
    id: string;
    name?: string;
    fullname?: string;
    email?: string;
    role?: string;
}

interface CommissionDetail {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeRole: string;
    amount: number;
    percentage: number;
    status: string;
    paidDate?: string;
}

interface PurchaseData {
    id: string;
    book_number: string;
    customer_name?: string;
    customer_number?: string;
    d_route?: string;
    d_transport?: string;
    d_term?: string;
    d_origin?: string;
    d_destination?: string;
    d_size_cabinet?: string;
    // ข้อมูลค่าคอมมิชชั่น
    employeeCommissions?: any[];
    csCommission?: any;
    commissionStatusText?: string;
    hasCommission?: boolean;
    d_weight?: string;
    d_status?: string;
    created_at: string;
    createdAt: string; // สำหรับการแสดงผลในบางส่วน
    customer?: any; // ข้อมูลลูกค้า
    employees: Employee[]; // พนักงานที่เกี่ยวข้อง
    purchase_finance: {
        id: string;
        finance_status: string;
        ch_freight?: string;
        th_total_shipping?: string;
        total_all_th?: string;
        billing_amount: string;
        total_profit_loss?: string;
        administrative_fee_percentage?: number; // ค่าบริหาร (%)
        administrative_fee_amount?: number; // จำนวนเงินค่าบริหาร
    }[];
    commissionStatus?: {
        hasEmployeeCommission: boolean;
        hasCsCommission: boolean;
        employeeCommissionStatus: string | null;
        csCommissionStatus: string | null;
    };
    workType: string; // ประเภทงาน (All-in, Select, งานส่วนกลาง, อื่นๆ)
    salesOwner?: Employee; // เซลล์เจ้าของงาน
    salesSupport?: Employee; // เซลล์ซัพพอร์ต
    salesHead?: Employee; // หัวหน้าเซลล์
    seeker?: Employee; // Seeker
    commissionDetails: CommissionDetail[]; // รายละเอียดค่าคอมมิชชั่น
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

// Component หลัก
const EnhancedCommissionTable: React.FC = () => {
    // State สำหรับข้อมูล
    const [purchases, setPurchases] = useState<PurchaseData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [showCommissionDetails, setShowCommissionDetails] = useState<boolean>(false);
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(null);
    const [administrativeFeePercentage, setAdministrativeFeePercentage] = useState<number>(10);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);

    // State สำหรับค่าคอมมิชชั่น
    const [employeeCommissions, setEmployeeCommissions] = useState<any[]>([]);
    const [totalCommission, setTotalCommission] = useState<number>(0);
    const [commissionRank, setCommissionRank] = useState<any>(null);
    const [isLoadingRank, setIsLoadingRank] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    // State สำหรับ pagination
    const [paginationData, setPaginationData] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });

    // State สำหรับ filters
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterMonth, setFilterMonth] = useState<string>("");
    const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterWorkType, setFilterWorkType] = useState<string>("");
    const [filterEmployee, setFilterEmployee] = useState<string>("");
    const [searchBookNumber, setSearchBookNumber] = useState<string>("");
    const [dateFilterType, setDateFilterType] = useState<"booking" | "commission">("commission"); // เพิ่ม state สำหรับประเภทการกรองวันที่

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

    // ฟังก์ชันสำหรับหาวันสุดท้ายของเดือน
    const getLastDayOfMonth = (year: string, month: string): string => {
        // สร้างวันที่ 1 ของเดือนถัดไป แล้วลบ 1 วัน
        const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
        const nextMonthYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
        const lastDay = new Date(nextMonthYear, nextMonth - 1, 0);
        return `${year}-${month}-${lastDay.getDate()}`;
    };

    // ฟังก์ชันสำหรับดึงข้อมูล
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: paginationData.currentPage,
                limit: paginationData.itemsPerPage,
                search: searchTerm,
                status: filterStatus,
                workType: filterWorkType,
                bookNumber: searchTerm,
                startDate: filterMonth && filterYear ? `${filterYear}-${filterMonth}-01` : undefined,
                endDate: filterMonth && filterYear ? getLastDayOfMonth(filterYear, filterMonth) : undefined,
                employeeId: filterEmployee || undefined,
                dateFilterType: dateFilterType // เพิ่ม parameter สำหรับประเภทการกรองวันที่
            };
            // ดึงข้อมูลจาก API endpoint /hr/work
            const response = await axios.get("/hr/work", { params });

            if (!response.data.success) {
                throw new Error(response.data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
            }

            // แปลงข้อมูลที่ได้จาก API ให้เข้ากับโครงสร้างที่ต้องการ
            const enhancedData = await Promise.all(response.data.data.map(async (item: any) => {


                // ตรวจสอบว่ามี employees หรือไม่
                const employees = item.d_purchase_emp || [];

                // ดึงข้อมูลพนักงานจาก employees
                const salesOwner = item.employees[0]
                const salesSupport = employees.find((emp: any) => emp.user?.role === 'sales_support') || null;
                const salesHead = employees.find((emp: any) => emp.user?.role === 'sales_head') || null;
                const seeker = employees.find((emp: any) => emp.user?.role === 'seeker') || null;

                // ตรวจสอบว่ามีข้อมูลการเงินหรือไม่
                const financeData = item.purchase_finance || [];

                // คำนวณค่าคอมมิชชั่นจากข้อมูลการเงิน
                const finance = financeData[0] || {};
                const totalBilling = parseFloat(finance.billing_amount || '0');
                const adminFeePercentage = administrativeFeePercentage;
                const adminFeeAmount = (totalBilling * adminFeePercentage) / 100;

                // ดึงข้อมูลค่าคอมมิชชั่นจาก API เส้น /hr/commission-ranks/purchase-commission-status
                let employeeCommissions = [];
                let csCommission = null;
                let commissionStatusText = 'ยังไม่ได้บันทึก';
                let hasCommission = false;
                let commissionDate = null;

                try {
                    // ดึงข้อมูลค่าคอมมิชชั่นจาก API ใหม่
                    if (item.id) {
                        const commissionResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/purchase-commission-status/${item.id}`);
                        console.log('Commission Status API Response:', commissionResponse.data);

                        if (commissionResponse.data.success && commissionResponse.data.data) {
                            const commissionData = commissionResponse.data.data;
                            hasCommission = commissionData.hasCommission;
                            employeeCommissions = commissionData.employeeCommissions || [];
                            csCommission = commissionData.csCommission;

                            // หาวันที่ล่าสุดจาก employee commissions หรือ cs commission
                            let latestDate = null;
                            if (employeeCommissions.length > 0) {
                                const employeeDates = employeeCommissions.map((comm: any) => new Date(comm.createdAt || comm.created_at));
                                latestDate = new Date(Math.max(...employeeDates.map((date: Date) => date.getTime())));
                            }
                            if (csCommission && csCommission.createdAt) {
                                const csDate = new Date(csCommission.createdAt);
                                if (!latestDate || csDate > latestDate) {
                                    latestDate = csDate;
                                }
                            }
                            commissionDate = latestDate;

                            // แปลงสถานะเป็นภาษาไทย
                            if (commissionData.status === 'paid') {
                                commissionStatusText = 'จ่ายแล้ว';
                            } else if (commissionData.status === 'pending') {
                                commissionStatusText = 'ยังไม่ได้บันทึก';
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching commission status:', error);
                    // ใช้ข้อมูลจาก API เดิมถ้าดึงข้อมูลจาก API ใหม่ไม่ได้
                    const localCommissionData = item.commission_data || [];
                    const localCsCommission = item.cs_commission || [];

                    hasCommission = localCommissionData.length > 0 || localCsCommission.length > 0;
                    commissionStatusText = hasCommission ?
                        (localCommissionData[0]?.is_paid ? 'จ่ายแล้ว' : 'บันทึกแล้ว') : 'ยังไม่ได้บันทึก';
                    
                    // หาวันที่จากข้อมูลท้องถิ่น
                    if (localCommissionData.length > 0 && localCommissionData[0].createdAt) {
                        commissionDate = new Date(localCommissionData[0].createdAt);
                    } else if (localCsCommission.length > 0 && localCsCommission[0].createdAt) {
                        commissionDate = new Date(localCsCommission[0].createdAt);
                    }
                }

                // สร้างรายละเอียดค่าคอมมิชชั่นสำหรับพนักงานแต่ละคน
                const commissionDetails: CommissionDetail[] = [];


                // กำหนดประเภทงาน
                const workType = item.d_term;
                // เพิ่มข้อมูลเพิ่มเติมที่จำเป็น
                const enhancedItem: any = {
                    ...item,
                    workType,
                    commissionStatusText,
                    hasCommission,
                    employeeCommissions,
                    csCommission,
                    commissionDate,
                    salesOwner: salesOwner ? salesOwner.fullname : '',
                    salesSupport: salesSupport ? {
                        id: salesSupport.user_id,
                        user_id: salesSupport.user_id,
                        fullname: salesSupport.user?.fullname || '',
                        email: salesSupport.user?.email || '',
                        role: 'sales_support'
                    } : null,
                    salesHead: salesHead ? {
                        id: salesHead.user_id,
                        user_id: salesHead.user_id,
                        fullname: salesHead.user?.fullname || '',
                        email: salesHead.user?.email || '',
                        role: 'sales_head'
                    } : null,
                    seeker: seeker ? {
                        id: seeker.user_id,
                        user_id: seeker.user_id,
                        fullname: seeker.user?.fullname || '',
                        email: seeker.user?.email || '',
                        role: 'seeker'
                    } : null,
                    commissionDetails,
                    purchase_finance: financeData.map((finance: any) => ({
                        ...finance,
                        profit_loss: Number(finance.payment_prefix?.profit_loss) * Number(adminFeePercentage) / 100,
                        administrative_fee_percentage: finance.payment_prefix?.administrative_fee_percentage || 0,
                        administrative_fee_amount: 0,
                        total_profit_loss: Number(finance.payment_prefix?.profit_loss),
                        net_profit: Number(finance.payment_prefix?.net_profit),
                    }))
                };

                return enhancedItem;
            }));

            console.log("Enhanced data:", enhancedData);

            setPurchases(enhancedData);

            setPaginationData({
                currentPage: response.data.currentPage || 1,
                totalPages: response.data.totalPages || 1,
                totalItems: response.data.totalItems || 0,
                itemsPerPage: paginationData.itemsPerPage,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("ไม่สามารถดึงข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log("purchases", purchases)
    }, [purchases]);

    // ฟังก์ชันสำหรับดึงข้อมูลพนักงาน
    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await axios.get("/employee");
            console.log('Employee data:', response.data);

            if (response.data && Array.isArray(response.data.data)) {
                // กรองเฉพาะพนักงานที่มีบทบาทเป็น sale
                const salesEmployees = response.data.data.filter((emp: any) =>
                    emp.role === 'Sales'
                );
                console.log('Sales employees:', salesEmployees);
                setEmployees(salesEmployees);
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployees([]);
        } finally {
            setLoadingEmployees(false);
        }
    };

    // โหลดข้อมูลพนักงานเมื่อ component โหลด
    useEffect(() => {
        fetchEmployees();
        fetchData(); // Initial load
    }, []);

    // Auto-trigger fetchData เมื่อ filter values เปลี่ยนแปลง
    useEffect(() => {
        // Skip initial render when all filters are empty
        if (!filterWorkType && !filterStatus && !filterEmployee && !filterMonth && !filterYear) {
            return;
        }

        // Debounce การเรียก API
        const timeoutId = setTimeout(() => {
            setPaginationData(prev => ({
                ...prev,
                currentPage: 1,
            }));
            fetchData();
        }, 500); // debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [filterWorkType, filterStatus, filterEmployee, filterMonth, filterYear, dateFilterType]);

    // ดึงข้อมูลเปอร์เซ็นต์จาก commission ranks ตามช่วงกำไร
    const fetchCommissionRank = async (profitAmount: number) => {
        try {
            setIsLoadingRank(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/calculate`, {
                profit_amount: profitAmount
            });

            if (response.data && response.data.rank) {
                setCommissionRank(response.data.rank);
                return response.data.rank;
            } else {
                console.warn("No commission rank found for profit amount:", profitAmount);
                setCommissionRank(null);
                return null;
            }
        } catch (error) {
            console.error("Error fetching commission rank:", error);
            setCommissionRank(null);
            return null;
        } finally {
            setIsLoadingRank(false);
        }
    };

    // คำนวณค่าคอมมิชชั่นตามประเภทและค่าที่กำหนด
    const calculateCommissionAmount = (
        type: "percentage" | "fixed",
        value: string,
        baseAmount: number
    ): number => {
        if (type === "percentage") {
            const percentage = parseFloat(value || "0");
            return (percentage / 100) * baseAmount;
        } else {
            return parseFloat(value || "0");
        }
    };

    // ฟังก์ชันสำหรับแสดงรายละเอียดค่าคอมมิชชั่น
    const handleShowCommissionDetails = async (purchase: PurchaseData) => {
        setSelectedPurchase(purchase);
        setIsCommissionModalOpen(true);
    };

    // ฟังก์ชันสำหรับบันทึกค่าคอมมิชชั่น
    const handleSaveCommission = (commissionData: any) => {
        console.log('Commission data saved:', commissionData);
        // รีเฟรชข้อมูลหลังจากบันทึก
        fetchData();
        setIsCommissionModalOpen(false);
        toast.success('บันทึกค่าคอมมิชชั่นเรียบร้อยแล้ว');
    };

    // ฟังก์ชันสำหรับปิด modal รายละเอียดค่าคอมมิชชั่น
    const handleCloseCommissionDetails = () => {
        setShowCommissionDetails(false);
        setSelectedPurchase(null);
    };

    // ฟังก์ชันสำหรับคำนวณยอดบิลรวม
    const calculateTotalBilling = (): number => {
        if (!purchases || purchases.length === 0) return 0;

        return purchases.reduce((total, item) => {
            const finance = item.purchase_finance && item.purchase_finance[0];
            const billingAmount = finance && finance.billing_amount ? parseFloat(finance.billing_amount) : 0;
            return total + billingAmount;
        }, 0);
    };

    // ฟังก์ชันสำหรับคำนวณกำไรรวม
    const calculateTotalProfit = (): number => {
        if (!purchases || purchases.length === 0) return 0;

        return purchases.reduce((total, item) => {
            const finance: any = item.purchase_finance && item.purchase_finance[0];

            // คำนวณกำไรสุทธิจาก profit_loss - management_fee
            let netProfit = 0;
            if (finance && finance.payment_prefix) {
                const profitLoss = finance.payment_prefix.profit_loss ?
                    parseFloat(finance.payment_prefix.profit_loss.toString()) : 0;
                const managementFee = finance.payment_prefix.management_fee ?
                    parseFloat(finance.payment_prefix.management_fee.toString()) : 0;
                netProfit = profitLoss - managementFee;
            }

            return total + netProfit;
        }, 0);
    };

    // ฟังก์ชันสำหรับคำนวณค่าคอมมิชชั่นรวม
    const calculateTotalCommission = (): number => {
        if (!purchases || purchases.length === 0) return 0;

        return purchases.reduce((total, item) => {
            let commissionTotal = 0;

            // คำนวณจากข้อมูลค่าคอมมิชชั่นของพนักงานขาย
            if (item.employeeCommissions && Array.isArray(item.employeeCommissions)) {
                commissionTotal += item.employeeCommissions.reduce((sum, comm) => {
                    return sum + (parseFloat(comm.commission_amount) || 0);
                }, 0);
            }

            // คำนวณจากข้อมูลค่าคอมมิชชั่นของ CS
            if (item.csCommission) {
                commissionTotal += parseFloat(item.csCommission.commission_amount) || 0;
            }


            return total + commissionTotal;
        }, 0);
    };

    // ฟังก์ชันสำหรับส่งออกข้อมูลคอมมิชชั่นเป็นไฟล์ Excel
    // เพิ่ม state สำหรับเก็บเดือนและปีที่ต้องการ export
    const [exportMonth, setExportMonth] = useState<string>('all');
    const [exportYear, setExportYear] = useState<string>('all');

    // สร้างตัวเลือกเดือน
    const monthOptions = [
        { value: 'all', label: 'ทั้งหมด' },
        { value: '1', label: 'มกราคม' },
        { value: '2', label: 'กุมภาพันธ์' },
        { value: '3', label: 'มีนาคม' },
        { value: '4', label: 'เมษายน' },
        { value: '5', label: 'พฤษภาคม' },
        { value: '6', label: 'มิถุนายน' },
        { value: '7', label: 'กรกฎาคม' },
        { value: '8', label: 'สิงหาคม' },
        { value: '9', label: 'กันยายน' },
        { value: '10', label: 'ตุลาคม' },
        { value: '11', label: 'พฤศจิกายน' },
        { value: '12', label: 'ธันวาคม' }
    ];

    // สร้างตัวเลือกปี
    const currentYear = new Date().getFullYear();
    const yearOptions = [
        { value: 'all', label: 'ทั้งหมด' },
        { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() },
        { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
        { value: currentYear.toString(), label: currentYear.toString() },
        { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() }
    ];

    const handleExportCommissionData = async () => {
        try {
            // Create date strings only if specific month and year are selected
            let startDateParam: string | undefined;
            let endDateParam: string | undefined;

            // Only create date parameters if specific month/year are selected (not 'all')
            if (exportMonth && exportMonth !== 'all' && exportYear && exportYear !== 'all') {
                const monthNum = parseInt(exportMonth);
                const yearNum = parseInt(exportYear);
                
                // Validate month and year
                if (monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
                    startDateParam = `${exportYear}-${exportMonth.padStart(2, '0')}-01`;
                    endDateParam = getLastDayOfMonth(exportYear, exportMonth);
                } else {
                    toast.error('เดือนหรือปีที่เลือกไม่ถูกต้อง');
                    return;
                }
            }

            const params: any = {
                status: filterStatus || undefined,
                bookNumber: searchBookNumber || undefined,
                dateFilterType: dateFilterType
            };

            // เพิ่ม month และ year เฉพาะเมื่อไม่ใช่ 'all'
            if (exportMonth && exportMonth !== 'all') {
                params.month = exportMonth;
            }
            
            if (exportYear && exportYear !== 'all') {
                params.year = exportYear;
            }

            // เพิ่ม startDate และ endDate เฉพาะเมื่อมีค่าที่ valid
            if (startDateParam && endDateParam) {
                params.startDate = startDateParam;
                params.endDate = endDateParam;
            }

            // ลบ undefined values ออกจาก params
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            console.log('Export params:', params); // Debug log

            const response = await axios.get("/hr/commission-ranks/export-commission-data", { 
                params,
                responseType: 'blob' 
            });

            // สร้างไฟล์ Excel และดาวน์โหลด
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const dateTypeLabel = dateFilterType === 'booking' ? 'วันที่ปิดใบจองชำระเงินสำเร็จ' : 'วันที่บันทึกคอมมิชชั่น';
            const monthLabel = exportMonth && exportMonth !== 'all' 
                ? months.find(m => m.value === exportMonth)?.label 
                : 'ทุกเดือน';
            const yearLabel = exportYear && exportYear !== 'all' ? exportYear : 'ทุกปี';
            
            link.download = `Commission_Report_${dateTypeLabel}_${monthLabel}_${yearLabel}.xlsx`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('ส่งออกข้อมูลสำเร็จ');
        } catch (error: any) {
            console.error('Export error:', error);
            
            // แสดง error message ที่เฉพาะเจาะจงมากขึ้น
            if (error.response?.data?.error) {
                toast.error(`เกิดข้อผิดพลาด: ${error.response.data.error}`);
            } else if (error.response?.status === 400) {
                toast.error('ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า');
            } else {
                toast.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
            }
        }
    };

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const handlePageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page,
        });
    };

    // ฟังก์ชันสำหรับค้นหา
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPaginationData({
            ...paginationData,
            currentPage: 1,
        });
        fetchData();
    };

    // ฟังก์ชันสำหรับเปลี่ยนเดือน
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterMonth(e.target.value);
        setPaginationData({
            ...paginationData,
            currentPage: 1,
        });
    };

    // ฟังก์ชันสำหรับเปลี่ยนปี
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterYear(e.target.value);
        setPaginationData({
            ...paginationData,
            currentPage: 1,
        });
    };

    // ฟังก์ชันสำหรับเปลี่ยนประเภทงาน
    const handleWorkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterWorkType(e.target.value);
        setPaginationData({
            ...paginationData,
            currentPage: 1,
        });
    };

    // ฟังก์ชันสำหรับเปลี่ยนประเภทการกรองวันที่
    const handleDateFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDateFilterType(e.target.value as "booking" | "commission");
        setPaginationData({
            ...paginationData,
            currentPage: 1,
        });
    };

    // ฟังก์ชันสำหรับบันทึกการเปลี่ยนแปลงค่าบริหาร
    const handleSaveAdministrativeFee = () => {
        // ในอนาคตจะส่งค่าไปยัง API
        toast.success(`บันทึกค่าบริหาร ${administrativeFeePercentage}% เรียบร้อยแล้ว`);
    };

    // ฟังก์ชันสำหรับรีเฟรชข้อมูล
    const handleRefresh = () => {
        // รีเซ็ต filters
        setFilterWorkType("");
        setFilterStatus("");
        setFilterEmployee("");
        setFilterMonth("");
        setFilterYear(new Date().getFullYear().toString());
        setSearchTerm("");
        setSearchBookNumber("");
        setDateFilterType("commission"); // รีเซ็ตกลับเป็น default

        // เรียก API ใหม่
        fetchData();
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow">
            {/* ส่วนหัว */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">ข้อมูลค่าคอมมิชชั่น</h2>
                        <p className="text-sm text-gray-600 mt-1">จัดการและติดตามข้อมูลคอมมิชชั่นพนักงาน</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        {/* ตัวเลือกเดือนและปีสำหรับการ export */}
                        <div className="flex items-end gap-3">
                            <div className="flex flex-col">
                                <label htmlFor="exportMonth" className="text-sm font-medium text-gray-700 mb-1">เดือน</label>
                                <FormSelect
                                    id="exportMonth"
                                    value={exportMonth}
                                    onChange={(e) => setExportMonth(e.target.value)}
                                    className="w-32 text-sm"
                                >
                                    {monthOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </FormSelect>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="exportYear" className="text-sm font-medium text-gray-700 mb-1">ปี</label>
                                <FormSelect
                                    id="exportYear"
                                    value={exportYear}
                                    onChange={(e) => setExportYear(e.target.value)}
                                    className="w-28 text-sm"
                                >
                                    {yearOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </FormSelect>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => fetchData()}
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                รีเฟรช
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleExportCommissionData}
                                title="ส่งออกข้อมูลคอมมิชชั่นเป็นไฟล์ Excel"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ส่วนแสดงสรุปข้อมูล */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm text-blue-500 font-medium mb-2">จำนวนรายการทั้งหมด</h3>
                        <p className="text-2xl font-bold">{paginationData.totalItems}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm text-green-500 font-medium mb-2">ยอดบิลรวม</h3>
                        <p className="text-2xl font-bold">฿ {calculateTotalBilling().toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm text-purple-500 font-medium mb-2">กำไรรวม</h3>
                        <p className="text-2xl font-bold">฿ {calculateTotalProfit().toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm text-amber-500 font-medium mb-2">ค่าคอมมิชชั่นรวม</h3>
                        <p className="text-2xl font-bold">฿ {calculateTotalCommission().toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* ส่วนค้นหาและกรอง */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">ตัวกรองข้อมูล</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>รีเฟรช</span>
                            </button>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">กรองตาม</label>
                            <FormSelect
                                value={dateFilterType}
                                onChange={handleDateFilterTypeChange}
                                className="w-full text-sm"
                            >
                                <option value="commission">วันที่บันทึกคอมมิชชั่น</option>
                                <option value="booking">วันที่ปิดใบจองชำระเงินสำเร็จ</option>
                            </FormSelect>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <FormSelect
                                        value={filterYear}
                                        onChange={handleYearChange}
                                        className="w-full text-sm"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>ปี {year}</option>
                                        ))}
                                    </FormSelect>
                                </div>
                                <div>
                                    <FormSelect
                                        value={filterMonth}
                                        onChange={handleMonthChange}
                                        className="w-full text-sm"
                                    >
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </FormSelect>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะคอมมิชชั่น</label>
                            <FormSelect
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full text-sm"
                            >
                                <option value="">ทุกสถานะ</option>
                                <option value="pending">รอดำเนินการ</option>
                                <option value="paid">จ่ายแล้ว</option>
                            </FormSelect>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทงาน</label>
                            <FormSelect
                                value={filterWorkType}
                                onChange={handleWorkTypeChange}
                                className="w-full text-sm"
                            >
                                <option value="">เลือก</option>
                                <option value="ALL IN">ALL IN</option>
                                <option value="เคลียร์ฝั่งไทย">เคลียร์ฝั่งไทย</option>
                                <option value="เคลียร์ฝั่งจีน">เคลียร์ฝั่งจีน</option>
                                <option value="GREEN">GREEN</option>
                                <option value="FOB">FOB</option>
                                <option value="EXW">EXW</option>
                                <option value="CIF">CIF</option>
                                <option value="CUSTOMER CLEAR">CUSTOMER CLEAR</option>
                            </FormSelect>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">พนักงานขาย</label>
                            <FormSelect
                                value={filterEmployee}
                                onChange={(e) => setFilterEmployee(e.target.value)}
                                className="w-full text-sm"
                                disabled={loadingEmployees}
                            >
                                <option value="">ทุกคน</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </FormSelect>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาเลขที่ใบจอง</label>
                            <input
                                type="text"
                                value={searchBookNumber}
                                onChange={(e) => setSearchBookNumber(e.target.value)}
                                placeholder="ค้นหาเลขที่ใบจอง..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ส่วนตาราง */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <Table className="min-w-full">
                        <Table.Thead className="bg-gray-50">
                            <Table.Tr>
                                <Table.Th className="w-16 text-center whitespace-nowrap">ลำดับ</Table.Th>
                                <Table.Th className="w-24 text-center whitespace-nowrap">เดือน/ปี</Table.Th>
                                <Table.Th className="w-32 whitespace-nowrap">เลขตู้</Table.Th>
                                <Table.Th className="w-36 whitespace-nowrap">เลขที่ Booking</Table.Th>
                                <Table.Th className="w-28 text-center whitespace-nowrap">ปิดงาน</Table.Th>
                                <Table.Th className="w-28 text-center whitespace-nowrap">ประเภทตู้</Table.Th>
                                <Table.Th className="w-40 whitespace-nowrap">Sale เจ้าของงาน</Table.Th>
                              
                                <Table.Th className="w-32 text-right whitespace-nowrap">ผลกำไร</Table.Th>
                                <Table.Th className="w-32 text-right whitespace-nowrap">ค่าบริหาร</Table.Th>
                                <Table.Th className="w-32 text-right whitespace-nowrap">กำไร/ขาดทุน</Table.Th>
                                <Table.Th className="w-40 text-center whitespace-nowrap">สถานะคอมมิชชั่น</Table.Th>
                                <Table.Th className="w-32 text-center whitespace-nowrap">วันที่ทำคอมมิชชั่น</Table.Th>
                                <Table.Th className="w-36 text-center whitespace-nowrap">จัดการ</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={14} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center">
                                            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                            <span>กำลังโหลดข้อมูล...</span>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ) : purchases.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={14} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-gray-500">ไม่พบข้อมูล</span>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                purchases.map((item: any, index: number) => {
                                    // ใช้ purchase_finance รายการที่มีสถานะ "ชำระครบแล้ว" ถ้ามี
                                    const paidFinance = item.purchase_finance.find(
                                        (finance: any) => finance.payment_status === "ชำระครบแล้ว"
                                    ) || item.purchase_finance[0] || {};

                                    console.log('Item in table:', item.id, item.book_number, 'Finance:', paidFinance);
                                    console.log('All finance records:', item.purchase_finance);
                                    console.log('total_profit_loss raw:', paidFinance?.total_profit_loss);
                                    console.log('management_fee raw:', paidFinance?.management_fee);


                                    console.log('Customer data:', item.customer);
                                    const customerName = item.customer && typeof item.customer === 'object' && item.customer.cus_fullname
                                        ? item.customer.cus_fullname
                                        : "-";

                                    // ตรวจสอบว่ามีข้อมูลการเงินหรือไม่
                                    const billingAmount = paidFinance && paidFinance.billing_amount
                                        ? parseFloat(paidFinance.billing_amount)
                                        : 0;

                                    let profitLossValue = 0;
                                    if (paidFinance && paidFinance.payment_prefix && paidFinance.payment_prefix.profit_loss !== null && paidFinance.payment_prefix.profit_loss !== undefined) {
                                        const profitStr = String(paidFinance.payment_prefix.profit_loss);
                                        profitLossValue = parseFloat(profitStr) || 0;
                                    }

                                    let managementFee = 0;
                                    if (paidFinance && paidFinance.payment_prefix && paidFinance.payment_prefix.management_fee !== null && paidFinance.payment_prefix.management_fee !== undefined) {
                                        const feeStr = String(paidFinance.payment_prefix.management_fee);
                                        managementFee = parseFloat(feeStr) || 0;
                                    }

                                    const netProfit = profitLossValue - managementFee;

                                    return (
                                        <Table.Tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <Table.Td className="text-center whitespace-nowrap">{index + 1 + ((paginationData.currentPage - 1) * paginationData.itemsPerPage)}</Table.Td>
                                            <Table.Td className="text-center whitespace-nowrap">
                                                {paidFinance.updatedAt ? format(new Date(paidFinance.updatedAt), "MM/yy") : 
                                                 paidFinance.updated_at ? format(new Date(paidFinance.updated_at), "MM/yy") :
                                                 item.updatedAt ? format(new Date(item.updatedAt), "MM/yy") : "-"}
                                            </Table.Td>
                                            <Table.Td className="whitespace-nowrap">{item.d_shipment_number || "-"}</Table.Td>
                                            <Table.Td className="whitespace-nowrap font-medium">{item.book_number}</Table.Td>

                                            <Table.Td className="text-center whitespace-nowrap">
                                                {paidFinance.updatedAt ? format(new Date(paidFinance.updatedAt), "dd MMM yyyy", { locale: th }) : 
                                                 paidFinance.updated_at ? format(new Date(paidFinance.updated_at), "dd MMM yyyy", { locale: th }) :
                                                 item.updatedAt ? format(new Date(item.updatedAt), "dd MMM yyyy", { locale: th }) : "-"}
                                            </Table.Td>
                                            <Table.Td className="text-center whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${item.workType === "ALL IN" ? "bg-blue-100 text-blue-800" :
                                                    item.workType === "เคลียร์ฝั่งไทย" ? "bg-purple-100 text-purple-800" :
                                                        item.workType === "เคลียร์ฝั่งจีน" ? "bg-green-100 text-green-800" :
                                                            "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {item.workType}
                                                </span>
                                            </Table.Td>
                                            <Table.Td className="whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{item.salesOwner}</span>
                                            </Table.Td>
                                            <Table.Td className="text-right whitespace-nowrap font-medium">{profitLossValue.toLocaleString()} ฿</Table.Td>
                                            <Table.Td className="text-right whitespace-nowrap">{managementFee.toLocaleString()} ฿</Table.Td>
                                            <Table.Td className="text-right whitespace-nowrap">{netProfit.toLocaleString()} ฿</Table.Td>
                                            <Table.Td className="text-center whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                                        ${item.commissionStatusText === 'จ่ายแล้ว' ? 'bg-green-100 text-green-800' :
                                                            item.commissionStatusText === 'บันทึกแล้ว' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {item.commissionStatusText}
                                                    </span>
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="text-center whitespace-nowrap">
                                                {item.commissionDate ? format(new Date(item.commissionDate), "dd/MM/yy") : "-"}
                                            </Table.Td>
                                            <Table.Td className="text-center whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => handleShowCommissionDetails(item)}
                                                        className="whitespace-nowrap"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        รายละเอียด
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

                {/* ส่วน Pagination */}
                {!loading && purchases.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-500">
                            แสดง {((paginationData.currentPage - 1) * paginationData.itemsPerPage) + 1} ถึง {Math.min(paginationData.currentPage * paginationData.itemsPerPage, paginationData.totalItems)} จาก {paginationData.totalItems} รายการ
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={paginationData.currentPage === 1}
                                onClick={() => handlePageChange(paginationData.currentPage - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={pageNumber === paginationData.currentPage ? "primary" : "outline-secondary"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={paginationData.currentPage === paginationData.totalPages}
                                onClick={() => handlePageChange(paginationData.currentPage + 1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {selectedPurchase && (
                    <CommissionModal
                        isOpen={isCommissionModalOpen}
                        onClose={() => setIsCommissionModalOpen(false)}
                        purchaseData={purchases.find((purchase) => purchase.id === selectedPurchase.id)}
                        onSave={handleSaveCommission}
                    />
                )}
            </div>
        </div>
    );
};

export default EnhancedCommissionTable;