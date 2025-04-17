"use client";

import { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit2, FiSearch, FiEye } from "react-icons/fi";
import axios from '../../../../../axios';
import { useAppDispatch } from "@/stores/hooks";
import { setModalRecordMoney, setEditRecord } from "@/stores/finance";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Components
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import TransactionDetailsModal from "./TransactionDetailsModal";

interface Transaction {
    id: string;
    type: string;
    date: string;
    documentNumber: string;
    customerId: string;
    user:any
    salespersonId: string;
    transferDate: string;
    createdAt: string;
    updatedAt: string;
    deposit_purpose?: string;
    customerDeposit?: any;
    exchange?: any;
}

interface Props {
    onRefresh?: () => void;
}

const DataTable = ({ onRefresh }: Props) => {
    const dispatch = useAppDispatch();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [searchedVal, setSearchedVal] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [minAmountRMB, setMinAmountRMB] = useState<string>("");
    const [maxAmountRMB, setMaxAmountRMB] = useState<string>("");
    const [minExchangeRate, setMinExchangeRate] = useState<string>("");
    const [maxExchangeRate, setMaxExchangeRate] = useState<string>("");
    const [minAmountTHB, setMinAmountTHB] = useState<string>("");
    const [maxAmountTHB, setMaxAmountTHB] = useState<string>("");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/finance/record-money');
            console.log('API Response in DataTable:', response.data);
            
            // แปลงข้อมูลเพื่อให้มี deposit_purpose
            const processedRecords = response.data.data.map((record: Transaction) => {
                // ถ้ามี customerDeposit และมี deposit_purpose ใน customerDeposit
                if (record.customerDeposit && record.customerDeposit.deposit_purpose) {
                    return {
                        ...record,
                        deposit_purpose: record.customerDeposit.deposit_purpose
                    };
                }
                return record;
            });
            
            setTransactions(processedRecords || []);
            setFilteredTransactions(processedRecords || []);
            setTotalPage(Math.ceil((processedRecords?.length || 0) / 10));
        } catch (error) {
            console.error('Error fetching transactions:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลธุรกรรมได้',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchedVal, typeFilter, startDate, endDate, minAmountRMB, maxAmountRMB, minExchangeRate, maxExchangeRate, minAmountTHB, maxAmountTHB, transactions]);

    const filterData = () => {
        let filtered = [...transactions];

        // Filter by search term
        if (searchedVal) {
            filtered = filtered.filter(
                (transaction) =>
                    (transaction.documentNumber || "").toLowerCase().includes(searchedVal.toLowerCase()) ||
                    (transaction.customerId || "").toLowerCase().includes(searchedVal.toLowerCase())
            );
        }

        // Filter by type
        if (typeFilter !== "all") {
            filtered = filtered.filter((transaction) => transaction.type === typeFilter);
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(
                (transaction) => new Date(transaction.date) >= new Date(startDate)
            );
        }

        if (endDate) {
            filtered = filtered.filter(
                (transaction) => new Date(transaction.date) <= new Date(endDate)
            );
        }
        
        // Filter by amount RMB range
        if (minAmountRMB) {
            filtered = filtered.filter(transaction => {
                const amountRMB = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.amountRMB : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.amountRMB : 0;
                return amountRMB >= parseFloat(minAmountRMB);
            });
        }
        
        if (maxAmountRMB) {
            filtered = filtered.filter(transaction => {
                const amountRMB = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.amountRMB : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.amountRMB : 0;
                return amountRMB <= parseFloat(maxAmountRMB);
            });
        }
        
        // Filter by exchange rate range
        if (minExchangeRate) {
            filtered = filtered.filter(transaction => {
                const exchangeRate = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.exchangeRate : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.exchangeRate : 0;
                return exchangeRate >= parseFloat(minExchangeRate);
            });
        }
        
        if (maxExchangeRate) {
            filtered = filtered.filter(transaction => {
                const exchangeRate = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.exchangeRate : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.exchangeRate : 0;
                return exchangeRate <= parseFloat(maxExchangeRate);
            });
        }
        
        // Filter by amount THB range
        if (minAmountTHB) {
            filtered = filtered.filter(transaction => {
                const amountTHB = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.amount : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.amount : 0;
                return amountTHB >= parseFloat(minAmountTHB);
            });
        }
        
        if (maxAmountTHB) {
            filtered = filtered.filter(transaction => {
                const amountTHB = transaction.type === "deposit" && transaction.customerDeposit ? 
                    transaction.customerDeposit.amount : 
                    transaction.type === "order" && transaction.exchange ? 
                    transaction.exchange.amount : 0;
                return amountTHB <= parseFloat(maxAmountTHB);
            });
        }

        setFilteredTransactions(filtered);
        setTotalPage(Math.ceil(filtered.length / 10));
        setCurrentPage(1);
    };

    const handleEdit = (transaction: Transaction) => {
        dispatch(setEditRecord(transaction));
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
                    const response = await axios.delete(`/finance/record-money/${id}`);
                    
                    if (response.data && response.data.statusCode === 200) {
                        Swal.fire({
                            title: "ลบข้อมูลสำเร็จ",
                            text: "ข้อมูลถูกลบออกจากระบบเรียบร้อยแล้ว",
                            icon: "success",
                            confirmButtonText: "ตกลง",
                        });
                        fetchTransactions();
                        if (onRefresh) onRefresh();
                    } else {
                        throw new Error(response.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
                    }
                } catch (error: any) {
                    console.error('Error deleting transaction:', error);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: error.response?.data?.message || 'ไม่สามารถลบข้อมูลได้',
                        icon: "error",
                        confirmButtonText: "ตกลง"
                    });
                }
            }
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };
    
    const formatDate = (date: string | null | undefined) => {
        if (!date) return '-';
        return format(new Date(date), 'dd/MM/yyyy', { locale: th });
    };

    const getTransactionTypeLabel = (type: any):any => {
        switch (type) {
            case 'deposit':
                return { label: 'ฝากโอน', color: 'success' };
            case 'order':
                return { label: 'ฝากสั่งซื้อ', color: 'primary' };
            case 'topup':
                return { label: 'ฝากเติม', color: 'info' };
        }
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        return filteredTransactions.slice(startIndex, endIndex);
    };

    const handleViewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

    return (
        <>
            <div className="intro-y col-span-12 mb-5">
                {/* Filter Section with Card UI */}
                <div className="bg-white rounded-lg shadow-md p-5 mb-5">
                 
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <FormInput
                                    type="text"
                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="เลขที่เอกสาร, รหัสลูกค้า..."
                                    value={searchedVal}
                                    onChange={(e) => setSearchedVal(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทรายการ</label>
                            <FormSelect
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="deposit">ฝากโอน</option>
                                <option value="order">ฝากสั่งซื้อ</option>
                            </FormSelect>
                        </div>

                        {/* Date Range - Start */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
                            <FormInput
                                type="date"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* Date Range - End */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                            <FormInput
                                type="date"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                        {/* Amount RMB Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ยอดฝากชำระ/โอน (RMB)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="ต่ำสุด"
                                    value={minAmountRMB}
                                    onChange={(e) => setMinAmountRMB(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="สูงสุด"
                                    value={maxAmountRMB}
                                    onChange={(e) => setMaxAmountRMB(e.target.value)}
                                    min={minAmountRMB || "0"}
                                    step="0.01"
                                />
                            </div>
                        </div>
                        
                        {/* Exchange Rate Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">อัตราแลกเปลี่ยน</label>
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="ต่ำสุด"
                                    value={minExchangeRate}
                                    onChange={(e) => setMinExchangeRate(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="สูงสุด"
                                    value={maxExchangeRate}
                                    onChange={(e) => setMaxExchangeRate(e.target.value)}
                                    min={minExchangeRate || "0"}
                                    step="0.01"
                                />
                            </div>
                        </div>
                        
                        {/* Amount THB Range */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ยอดฝาก/โอนรวม (THB)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="ต่ำสุด"
                                    value={minAmountTHB}
                                    onChange={(e) => setMinAmountTHB(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                                <FormInput
                                    type="number"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="สูงสุด"
                                    value={maxAmountTHB}
                                    onChange={(e) => setMaxAmountTHB(e.target.value)}
                                    min={minAmountTHB || "0"}
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Filter Actions */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                setSearchedVal("");
                                setTypeFilter("all");
                                setStartDate("");
                                setEndDate("");
                                setMinAmountRMB("");
                                setMaxAmountRMB("");
                                setMinExchangeRate("");
                                setMaxExchangeRate("");
                                setMinAmountTHB("");
                                setMaxAmountTHB("");
                            }}
                        >
                            <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                            รีเซ็ต
                        </Button>
                        <Button
                            variant="primary"
                            onClick={filterData}
                        >
                            <Lucide icon="Filter" className="w-4 h-4 mr-2" />
                            กรองข้อมูล
                        </Button>
                    </div>
                </div>
                
                {/* Add Record Button */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium">รายการข้อมูลทั้งหมด</h2>
                    <button
                        className="bg-blue-950 hover:bg-blue-800 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg mr-1 mb-1"
                        onClick={() => dispatch(setModalRecordMoney(true))}
                        type="button"
                    >
                        + เพิ่มข้อมูล
                    </button>
                </div>
            </div>

            <div className="intro-y box p-5 mt-5">
                <div className="overflow-x-auto">
                    <Table className="border-spacing-y-[10px] border-separate">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">ลำดับ</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">เลขที่เอกสาร</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">ประเภท</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">ฝากเรื่อง</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">รหัสลูกค้า</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">พนักงานขาย</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap text-right">ยอดฝาก/โอน (RMB)</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap text-right">อัตราแลกเปลี่ยน</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap text-right">ยอดฝาก/โอนรวม (THB)</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">วันที่โอน</Table.Th>
                               
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">จัดการ</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={11} className="text-center py-4">
                                        กำลังโหลดข้อมูล...
                                    </Table.Td>
                                </Table.Tr>
                            ) : getCurrentPageData().length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={11} className="text-center py-4">
                                        ไม่พบข้อมูลธุรกรรม
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                getCurrentPageData().map((transaction, index) => {
                                    const details = transaction.customerDeposit || transaction.exchange;
                                    return (
                                        <Table.Tr key={transaction.id} className="intro-x">
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                             {index+1}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {transaction.documentNumber || '-'}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <div className={`whitespace-nowrap text-${getTransactionTypeLabel(transaction.type).color}`}>
                                                    {getTransactionTypeLabel(transaction.type).label}
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {transaction.type === "deposit" ? (
                                                    <div className="text-sm font-medium text-blue-600">
                                                        {transaction.deposit_purpose || transaction.customerDeposit?.deposit_purpose || "-"}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {transaction.customerId}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                             {transaction.user.fullname}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-right">
                                                {transaction.type === "deposit" && transaction.customerDeposit ? 
                                                    formatCurrency(transaction.customerDeposit.amountRMB || 0) : 
                                                    transaction.type === "order" && transaction.exchange ? 
                                                    formatCurrency(transaction.exchange.amountRMB || 0) : "-"}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-right">
                                                {transaction.type === "deposit" && transaction.customerDeposit ? 
                                                    formatCurrency(transaction.customerDeposit.exchangeRate || 0) : 
                                                    transaction.type === "order" && transaction.exchange ? 
                                                    formatCurrency(transaction.exchange.exchangeRate || 0) : "-"}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-right">
                                                {transaction.type === "deposit" && transaction.customerDeposit ? 
                                                    formatCurrency(transaction.customerDeposit.amount || 0) : 
                                                    transaction.type === "order" && transaction.exchange ? 
                                                    formatCurrency(transaction.exchange.amount || 0) : "-"}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {formatDate(transaction.date)}
                                            </Table.Td>
                                      
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="flex items-center mr-2"
                                                        onClick={() => handleViewDetails(transaction)}
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </Button>
                                                    {/* <Button
                                                        variant="secondary"
                                                        className="flex items-center mr-2"
                                                        onClick={() => handleEdit(transaction)}
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </Button> */}
                                                    <Button
                                                        variant="soft-danger"
                                                        className="flex items-center"
                                                        onClick={() => handleDelete(transaction.id)}
                                                    >
                                                        <BsTrash className="w-4 h-4" />
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
            <TransactionDetailsModal
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                transaction={selectedTransaction}
            />
        </>
    );
};

export default DataTable;
