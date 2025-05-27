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
    const [filterWorkType, setFilterWorkType] = useState<string>("");
    const [filterSalesOwner, setFilterSalesOwner] = useState<string>("");
    const [filterCommissionStatus, setFilterCommissionStatus] = useState<string>("");

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

            console.log('Fetching data with params:', {
                page: paginationData.currentPage,
                limit: paginationData.itemsPerPage,
                search: searchTerm,
                status: filterCommissionStatus,
                bookNumber: searchTerm,
                startDate: filterMonth && filterYear ? `${filterYear}-${filterMonth}-01` : undefined,
                endDate: filterMonth && filterYear ? getLastDayOfMonth(filterYear, filterMonth) : undefined,
                employeeId: filterSalesOwner || undefined
            });

            // ดึงข้อมูลจาก API endpoint /hr/work
            const response = await axios.get("/hr/work", {
                params: {
                    page: paginationData.currentPage,
                    limit: paginationData.itemsPerPage,
                    search: searchTerm,
                    status: filterCommissionStatus,
                    bookNumber: searchTerm, // ใช้ searchTerm เป็น bookNumber ด้วย
                    startDate: filterMonth && filterYear ? `${filterYear}-${filterMonth}-01` : undefined,
                    endDate: filterMonth && filterYear ? getLastDayOfMonth(filterYear, filterMonth) : undefined,
                    employeeId: filterSalesOwner || undefined
                }
            });

    

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
                            
                            // แปลงสถานะเป็นภาษาไทย
                            if (commissionData.status === 'paid') {
                                commissionStatusText = 'จ่ายแล้ว';
                            } else if (commissionData.status === 'saved') {
                                commissionStatusText = 'บันทึกแล้ว';
                            } else {
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
                }

                // สร้างรายละเอียดค่าคอมมิชชั่นสำหรับพนักงานแต่ละคน
                const commissionDetails: CommissionDetail[] = [];


                // กำหนดประเภทงาน
                const workType = item.d_term;
                // เพิ่มข้อมูลเพิ่มเติมที่จำเป็น
                const enhancedItem :any = {
                    ...item,
                    workType,
                    commissionStatusText,
                    hasCommission,
                    employeeCommissions,
                    csCommission,
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
                // กรองเฉพาะพนักงานที่มีบทบาทเป็นพนักงานขาย
                const salesEmployees = response.data.data.filter((emp: any) => 
                    emp.role === 'Sales'
                );
                console.log('Sales employees:', salesEmployees);
                setEmployees(salesEmployees);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoadingEmployees(false);
        }
    };
    
    // โหลดข้อมูลเมื่อ component โหลดหรือเมื่อ filter เปลี่ยน
    useEffect(() => {
        fetchData();
    }, [
        paginationData.currentPage,
        paginationData.itemsPerPage,
        filterMonth,
        filterYear,
        filterWorkType,
        filterSalesOwner,
        filterCommissionStatus
    ]);
    
    // โหลดข้อมูลพนักงานเมื่อ component โหลด
    useEffect(() => {
        fetchEmployees();
    }, []);

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
            const finance :any  = item.purchase_finance && item.purchase_finance[0];
            const totalProfit = finance && finance.net_profit ? parseFloat(finance.net_profit.toString()) : 0;
            return total + totalProfit;
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
            toast.loading('กำลังส่งออกข้อมูล...', { id: 'export-toast' });
            
            // เรียกใช้ API endpoint สำหรับส่งออกข้อมูล พร้อมส่ง query params เดือนและปี
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/export-commission-data`, {
                params: {
                    month: exportMonth,
                    year: exportYear
                },
                responseType: 'blob'
            });
            
            // สร้าง URL object จาก blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // สร้าง element a สำหรับดาวน์โหลดไฟล์
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `commission_data_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            
            // คลิกลิงก์เพื่อดาวน์โหลด
            link.click();
            
            // ลบลิงก์หลังจากดาวน์โหลดเสร็จ
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('ส่งออกข้อมูลสำเร็จ', { id: 'export-toast' });
        } catch (error) {
            console.error('Error exporting commission data:', error);
            toast.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล', { id: 'export-toast' });
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

    // ฟังก์ชันสำหรับบันทึกการเปลี่ยนแปลงค่าบริหาร
    const handleSaveAdministrativeFee = () => {
        // ในอนาคตจะส่งค่าไปยัง API
        toast.success(`บันทึกค่าบริหาร ${administrativeFeePercentage}% เรียบร้อยแล้ว`);
    };


    

    return (
        <div className="bg-white p-5 rounded-lg shadow">
            {/* ส่วนหัว */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">ข้อมูลค่าคอมมิชชั่น</h2>

                <div className="flex items-center space-x-4">
                    {/* ตัวเลือกเดือนและปีสำหรับการ export */}
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="exportMonth" className="text-sm mb-1">เดือน</label>
                            <FormSelect
                                id="exportMonth"
                                value={exportMonth}
                                onChange={(e) => setExportMonth(e.target.value)}
                                className="w-32"
                            >
                                {monthOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </FormSelect>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="exportYear" className="text-sm mb-1">ปี</label>
                            <FormSelect
                                id="exportYear"
                                value={exportYear}
                                onChange={(e) => setExportYear(e.target.value)}
                                className="w-28"
                            >
                                {yearOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </FormSelect>
                        </div>
                    </div>

                    <Button
                        variant="outline-secondary"
                        onClick={() => fetchData()}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4">ตัวกรองข้อมูล</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน</label>
                        <FormSelect
                            value={filterWorkType}
                            onChange={(e) => setFilterWorkType(e.target.value)}
                            className="w-full"
                        >
                            <option value="">ทุกประเภท</option>
                            <option value="All-in">All-in</option>
                            <option value="เคลียร์ฝั่งไทย">เคลียร์ฝั่งไทย</option>
                            <option value="เคลียร์ฝั่งจีน">เคลียร์ฝั่งจีน</option>
                            <option value="CIF">CIF</option>
                            <option value="EXW">EXW</option>
                            <option value="CIF">CIF</option>
                            <option value="GREEN">GREEN</option>
                            <option value="FOB">FOB</option>
                            <option value="EXW">EXW</option>
                        </FormSelect>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">สถานะคอมมิชชั่น</label>
                        <FormSelect
                            value={filterCommissionStatus}
                            onChange={(e) => setFilterCommissionStatus(e.target.value)}
                            className="w-full"
                        >
                            <option value="">ทุกสถานะ</option>
                            <option value="pending">รอดำเนินการ</option>
                            <option value="approved">อนุมัติแล้ว</option>
                            <option value="paid">จ่ายแล้ว</option>
                        </FormSelect>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">พนักงานขาย</label>
                        <FormSelect
                            value={filterSalesOwner}
                            onChange={(e) => setFilterSalesOwner(e.target.value)}
                            className="w-full"
                            disabled={loadingEmployees}
                        >
                            <option value="">ทั้งหมด</option>
                            {loadingEmployees ? (
                                <option value="" disabled>กำลังโหลดข้อมูล...</option>
                            ) : employees.length > 0 ? (
                                employees.map((employee: any) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name + (employee.email ? ' (' + employee.email + ')' : '')}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>ไม่พบข้อมูลพนักงาน</option>
                            )}
                        </FormSelect>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
                        <div className="flex">
                            <FormInput
                                type="text"
                                placeholder="ค้นหาเลขที่ Booking, ลูกค้า..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-end space-x-2">
                        <Button
                            variant="primary"
                            onClick={handleSearch}
                            className="flex-1"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            ค้นหา
                        </Button>
                    </div>
                </div>
            </div>

            {/* ส่วนตาราง */}
            <div className="overflow-x-auto">
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="w-16">ลำดับ</Table.Th>
                            <Table.Th className="w-20">เดือน/ปี</Table.Th>
                            <Table.Th className="w-32">เลขตู้</Table.Th>
                            <Table.Th className="w-32">เลขที่ Booking</Table.Th>
                            <Table.Th className="w-28">วันที่</Table.Th>
                            <Table.Th className="w-28">ประเภทงาน</Table.Th>
                            <Table.Th className="w-32">พนักงานขาย</Table.Th>
                            <Table.Th className="w-28">ประเภทตู้</Table.Th>
                            <Table.Th className="w-28">ผลกำไร</Table.Th>
                            <Table.Th className="w-28">ค่าบริหาร</Table.Th>
                            <Table.Th className="w-28">กำไร/ขาดทุน</Table.Th>
                            <Table.Th className="w-36">สถานะคอมมิชชั่น</Table.Th>
                            <Table.Th className="w-36 text-center">จัดการ</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
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
                                // ใช้ purchase_finance รายการแรกหรือรายการที่มีสถานะ "ชำระครบแล้ว" ถ้ามี
                                const paidFinance = item.purchase_finance.find(
                                    (finance: any) => finance.finance_status === "ชำระครบแล้ว"
                                ) || item.purchase_finance[0] || {};

                                console.log('Item in table:', item.id, item.book_number, 'Finance:', paidFinance);

                                console.log('Customer data:', item.customer);
                                const customerName = item.customer && typeof item.customer === 'object' && item.customer.cus_fullname
                                    ? item.customer.cus_fullname
                                    : "-";

                                // ตรวจสอบว่ามีข้อมูลการเงินหรือไม่
                                const billingAmount = paidFinance && paidFinance.billing_amount
                                    ? parseFloat(paidFinance.billing_amount)
                                    : 0;

                                const profitLossValue = paidFinance && paidFinance.total_profit_loss
                                    ? parseFloat(paidFinance.total_profit_loss)
                                    : 0;

                                const adminFee = billingAmount * (administrativeFeePercentage / 100);
                                const netProfit = profitLossValue - adminFee;

                                return (
                                    <Table.Tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Td>{index + 1 + ((paginationData.currentPage - 1) * paginationData.itemsPerPage)}</Table.Td>
                                        <Table.Td>
                                            {item.createdAt ? format(new Date(item.createdAt), "MM/yy") : "-"}
                                        </Table.Td>
                                        <Table.Td>{item.d_shipment_number || "-"}</Table.Td>
                                        <Table.Td>{item.book_number}</Table.Td>
                                   
                                        <Table.Td>
                                            {item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy", { locale: th }) : "-"}
                                        </Table.Td>
                                        <Table.Td>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.workType === "All-in" ? "bg-blue-100 text-blue-800" :
                                                item.workType === "Select" ? "bg-purple-100 text-purple-800" :
                                                    item.workType === "งานส่วนกลาง" ? "bg-green-100 text-green-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {item.workType}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            {item.salesOwner}
                                        </Table.Td>
                                        <Table.Td>{item.d_term || "-"}</Table.Td>
                                        <Table.Td className={`text-right ${profitLossValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {item.purchase_finance[0]?.total_profit_loss ? item.purchase_finance[0].total_profit_loss.toLocaleString("th-TH", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }) : "-"}
                                        </Table.Td>
                                        <Table.Td className="text-right">
                                            {item.purchase_finance[0]?.profit_loss ? item.purchase_finance[0].profit_loss.toLocaleString("th-TH", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }) : "-"}
                                        </Table.Td>
                                        <Table.Td className={`text-right ${item.purchase_finance[0]?.net_profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {item.purchase_finance[0]?.net_profit ? item.purchase_finance[0].net_profit.toLocaleString("th-TH", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }) : "-"}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex space-x-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                    ${item.commissionStatusText === 'จ่ายแล้ว' ? 'bg-green-100 text-green-800' : 
                                                    item.commissionStatusText === 'บันทึกแล้ว' ? 'bg-blue-100 text-blue-800' : 
                                                    'bg-gray-100 text-gray-800'}`}>
                                                    {item.commissionStatusText}
                                                </span>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex justify-center space-x-2">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleShowCommissionDetails(item)}
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
    );
};

export default EnhancedCommissionTable;