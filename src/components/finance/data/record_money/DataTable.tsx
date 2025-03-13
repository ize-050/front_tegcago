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
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/finance/record-money');
            if (response.data && response.data.data) {
                setTransactions(response.data.data);
                setFilteredTransactions(response.data.data);
                setTotalPage(Math.ceil(response.data.data.length / 10));
            }
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
    }, [searchedVal, typeFilter, startDate, endDate, transactions]);

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
        return new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
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
                        <option value="order">ฝากสั่งซื้อ</option>
                        <option value="topup">ฝากเติม</option>
                    </FormSelect>
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
                    <Table className="border-spacing-y-[10px] border-separate">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">ลำดับ</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">เลขที่เอกสาร</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">ประเภท</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">รหัสลูกค้า</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">พนักงานขาย</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">วันที่โอน</Table.Th>
                               
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">จัดการ</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={8} className="text-center py-4">
                                        กำลังโหลดข้อมูล...
                                    </Table.Td>
                                </Table.Tr>
                            ) : getCurrentPageData().length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={8} className="text-center py-4">
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
                                                {transaction.customerId}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                             {transaction.user.fullname}
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
