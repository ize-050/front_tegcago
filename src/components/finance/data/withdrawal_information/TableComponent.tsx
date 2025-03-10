"use client"
import moment from "moment"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { useAppDispatch, useAppSelector } from "@/stores/hooks"
import { purchaseData } from "@/stores/purchase"
import { setModalWithdrawal, setFormWithdrawal } from '@/stores/finance'
import { getWidhdrawalInformation } from "@/services/finance";

//component
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import axios from "../../../../../axios"
import Swal from "sweetalert2"

interface Props {
    datawidhdrawalInformation: any
    onRefresh: () => void
}

const TableComponent = ({ datawidhdrawalInformation, onRefresh }: Props) => {

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const [searchedVal, setSearchedVal] = useState("")
    const [currentData, setCurrentData] = useState<any[]>([])
    const [bookNumbers, setBookNumbers] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        console.log("dataWidhdrawalInformation", datawidhdrawalInformation)
        if (!datawidhdrawalInformation?.widhdrawalInformation) return
        setCurrentData(datawidhdrawalInformation?.widhdrawalInformation)
        setFilteredData(datawidhdrawalInformation?.widhdrawalInformation)
        setTotalPage(Math.ceil(datawidhdrawalInformation?.total / 10))
    }, [datawidhdrawalInformation])


    useEffect(() => {
        console.log("currentData", currentData)
    }, [currentData])



    const filteredSuggestions = bookNumbers.filter(number =>
        number.toLowerCase().includes(searchedVal.toLowerCase())
    );

    const handleSearch = (e: any) => {
        setSearchedVal(e.target.value);
        setShowSuggestions(true);
    }

    const handleSelectSuggestion = (value: string) => {
        setSearchedVal(value);
        setShowSuggestions(false);
    }

    // Helper function to check if a date is within range
    const isDateInRange = (dateToCheck: string, start: string, end: string): boolean => {
        if (!dateToCheck) return false;

        const date = moment(dateToCheck).startOf('day');
        const startDateObj = start ? moment(start).startOf('day') : null;
        const endDateObj = end ? moment(end).startOf('day') : null;

        if (startDateObj && endDateObj) {
            return date.isBetween(startDateObj, endDateObj, null, '[]'); // inclusive range
        } else if (startDateObj) {
            return date.isSameOrAfter(startDateObj);
        } else if (endDateObj) {
            return date.isSameOrBefore(endDateObj);
        }

        return true;
    };

    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        setFilteredData(currentData);
    }, [currentData]);

    const handleSearchData = async () => {
        try {
            setIsLoading(true);
            // Only include date parameters if they are set
            const data_params: any = {
                page: currentPage
            };

            // Only add date filters if they are set
            if (startDate) data_params.startDate = startDate;
            if (endDate) data_params.endDate = endDate;
            if (searchedVal) data_params.search = searchedVal;

            const response: any = await getWidhdrawalInformation(data_params);

            // Update the current data with the filtered results
            setCurrentData(response.widhdrawalInformation || []);
            setFilteredData(response.widhdrawalInformation || []);
            setTotalPage(Math.ceil((response.total || 0) / 10));

        } catch (error) {
            console.error("Error searching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setIsLoading(true);

            // Build parameters for the axios request
            const params: any = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (searchedVal) params.search = searchedVal;

            // Make axios request with responseType blob to handle file download
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_URL_API}/finance/export-withdrawal-excel`,
                {
                    params,
                    responseType: 'blob',
                    headers: {
                        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }
                }
            );

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;

            // Set the filename
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'withdrawal_information.xlsx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);

            // Append to the document, click and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error downloading Excel file:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดาวน์โหลดไฟล์ Excel ได้',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        await handleSearchData();
    }

    // แก้ไขฟังก์ชัน handleDelete ให้ลบตาม group_id
    const handleDelete = async (group_id?: string) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณจะไม่สามารถย้อนกลับได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบข้อมูล!",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let response;

                    response = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}/finance/withdrawal_information/group/${group_id}`);

                    if (response?.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบข้อมูลสำเร็จ!',
                            text: 'ลบข้อมูลการเบิกเงินเรียบร้อยแล้ว',
                            confirmButtonText: 'ตกลง'
                        });
                        onRefresh();
                    }
                } catch (error) {
                    console.error("Error deleting withdrawal information:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                        confirmButtonText: 'ตกลง'
                    });
                }
            }
        });
    }

    const handleEdit = async (data: any) => {
        try {
            // If there's a group_id, we need to fetch all related records
            if (data.group_id) {
                // Get all records with the same group_id
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/withdrawal_information/group/${data.group_id}`);

                if (response.status === 200 && response.data.data) {
                    const groupRecords = response.data.data;

                    // Filter out the summary record
                    const regularRecords = groupRecords.filter((record: any) => record.invoice_package !== 'SUMMARY_RECORD');

                    // Find the summary record
                    const summaryRecord = groupRecords.find((record: any) => record.invoice_package === 'SUMMARY_RECORD');

                    // Extract common data from the first record
                    const commonData = {
                        id: data.id,
                        group_id: data.group_id,
                        d_purchase_id: data.d_purchase_id,
                        withdrawal_person: data.withdrawal_person,
                        transfer_amount: data.transfer_amount,
                        transfer_date: data.transfer_date ? moment(data.transfer_date).format('YYYY-MM-DD') : '',
                        pay_gasoline: summaryRecord?.pay_gasoline || data.pay_gasoline,
                        pay_price: summaryRecord?.pay_price || data.pay_price,
                        pay_total: summaryRecord?.pay_total || data.pay_total,
                        return_people: data.return_people,
                        withdrawal_date: data.withdrawal_date ? moment(data.withdrawal_date).format('YYYY-MM-DD') : '',
                    };

                    // Create withdrawal items array from regular records
                    const withdrawalItems = regularRecords.map((record: any) => ({
                        invoice_package: record.invoice_package,
                        consignee: record.consignee,
                        head_tractor: record.head_tractor,
                        withdrawal_date: record.withdrawal_date ? moment(record.withdrawal_date).format('YYYY-MM-DD') : '',
                        withdrawal_amount: record.withdrawal_amount,
                        d_purchase_id: record.d_purchase_id,
                        // ใช้ค่า pay_gasoline และ pay_price ของแต่ละรายการเป็น gasoline_cost และ other_cost
                        gasoline_cost: record.pay_gasoline,
                        other_cost: record.pay_price
                    }));

                    // Set the form data with all items
                    dispatch(setFormWithdrawal({
                        ...commonData,
                        withdrawalItems,
                        action: "edit"
                    }));
                }
            } else {
                // Single record without group_id (legacy data)
                const formData = {
                    id: data.id,
                    invoice_package: data.invoice_package,
                    consignee: data.consignee,
                    head_tractor: data.head_tractor,
                    withdrawal_date: data.withdrawal_date ? moment(data.withdrawal_date).format('YYYY-MM-DD') : '',
                    withdrawal_amount: data.withdrawal_amount,
                    pay_price: data.pay_price,
                    pay_gasoline: data.pay_gasoline,
                    pay_total: data.pay_total,
                    return_people: data.return_people,
                    d_purchase_id: data.d_purchase_id,
                    // Create a single withdrawal item
                    withdrawalItems: [{
                        invoice_package: data.invoice_package,
                        consignee: data.consignee,
                        head_tractor: data.head_tractor,
                        withdrawal_date: data.withdrawal_date ? moment(data.withdrawal_date).format('YYYY-MM-DD') : '',
                        withdrawal_amount: data.withdrawal_amount,
                        d_purchase_id: data.d_purchase_id,
                        // ใช้ค่า pay_gasoline และ pay_price เป็น gasoline_cost และ other_cost
                        gasoline_cost: data.pay_gasoline,
                        other_cost: data.pay_price
                    }]
                };

                dispatch(setFormWithdrawal(formData));
            }

            // Open the modal
            dispatch(setModalWithdrawal(true));
        } catch (error) {
            console.error("Error preparing edit data:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลสำหรับการแก้ไขได้',
                confirmButtonText: 'ตกลง'
            });
        }
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-y-10 gap-x-6">
                <div className="col-span-12">
                    <div className="mt-1">
                        <div className="flex p-4 flex-col box box--stacked">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                                <div className="flex justify-between mb-5">
                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2">
                                            <label className="font-medium text-gray-700">วันที่เริ่มต้น:</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="font-medium text-gray-700">วันที่สิ้นสุด:</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setStartDate("");
                                                setEndDate("");
                                            }}
                                            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            ล้างตัวกรอง
                                        </button>
                                        <button
                                            onClick={handleSearchData}
                                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="animate-spin">⟳</span>
                                                    กำลังค้นหา...
                                                </>
                                            ) : (
                                                'ค้นหา'
                                            )}
                                        </button>
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
                                </div>
                                <Table className="border-b border-gray-100  ">
                                    <Table.Thead>
                                        <Table.Tr
                                            style={{
                                                background: "#FAFAFA",

                                            }}
                                            className="text-sm font-bold"
                                        >
                                            <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                                No
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                                Invoice & PackingList No.
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                Consignee
                                            </Table.Td>
                                            {/* <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                หัวจ่าย
                                            </Table.Td> */}

                                            <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                                รอบเบิก
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                ยอดเบิก
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                ยอดโอน
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                ยอดจ่าย
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                ค่าน้ำมัน
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                คงเหลือ
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                คืนใคร
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {filteredData?.length > 0 &&
                                            // Group data by group_id
                                            Object.entries(
                                                filteredData.reduce((groups: Record<string, any[]>, item: any) => {
                                                    // Skip summary records for grouping
                                                    if (item.invoice_package === 'SUMMARY_RECORD') return groups;

                                                    // Create a new group if it doesn't exist
                                                    const groupId = item.group_id || 'ungrouped';
                                                    if (!groups[groupId]) {
                                                        groups[groupId] = [];
                                                    }

                                                    // Add the item to its group
                                                    groups[groupId].push(item);
                                                    return groups;
                                                }, {} as Record<string, any[]>)
                                            ).map(([groupId, groupItems]: [string, any[]], groupIndex: number) => {
                                                // Find the summary record for this group
                                                const summaryRecord = filteredData.find(
                                                    (item: any) => item.invoice_package === 'SUMMARY_RECORD' && item.group_id === groupId
                                                );

                                                return (
                                                    <React.Fragment key={groupId}>

                                                        {/* Group Header */}
                                                        <Table.Tr className="bg-gray-100 font-medium">
                                                            <Table.Td className="text-center border-slate-200/60 text-gray-900" colSpan={10}>
                                                                <span className="font-medium">กลุ่มรายการที่ {groupIndex + 1} - {moment(groupItems[0]?.withdrawal_date).format('DD/MM/YYYY')} ({groupItems.length} รายการ)</span>
                                                            </Table.Td>
                                                            <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleEdit(groupItems[0])}
                                                                        title="แก้ไขทั้งกลุ่ม"
                                                                    >
                                                                        <Lucide
                                                                            color="#6C9AB5"
                                                                            icon="Pencil"
                                                                            className="inset-y-0 justify-center m-auto w-5 h-5"
                                                                        ></Lucide>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDelete(groupId)
                                                                        }}
                                                                        title="ลบทั้งกลุ่ม"
                                                                    >
                                                                        <Lucide
                                                                            color="#FF5555"
                                                                            icon="Trash2"
                                                                            className="inset-y-0 justify-center m-auto w-5 h-5"
                                                                        ></Lucide>
                                                                    </button>
                                                                </div>
                                                            </Table.Td>
                                                        </Table.Tr>

                                                        {/* Group Items */}
                                                        {groupItems
                                                            .filter((row: any) =>
                                                                !searchedVal?.length
                                                                || row?.invoice_package.toString()
                                                                    .toLowerCase()
                                                                    .includes(searchedVal.toString().toLowerCase())
                                                                || row?.consignee.toString()
                                                                    .toLowerCase()
                                                                    .includes(searchedVal.toString().toLowerCase())
                                                                || row?.d_status?.toString()
                                                                    .toLowerCase()
                                                                    .includes(searchedVal.toString().toLowerCase())
                                                                || row?.d_term?.toString()
                                                                    .toLowerCase()
                                                                    .includes(searchedVal.toString().toLowerCase())
                                                                || row?.d_transport?.toString()
                                                                    .toLowerCase()
                                                                    .includes(searchedVal.toString().toLowerCase())
                                                                || (row?.d_shipment_number && row.d_shipment_number.toString().toLowerCase().includes(searchedVal.toString().toLowerCase()))
                                                            )
                                                            .map((data: any, key: number) => {
                                                                return (
                                                                    <Table.Tr key={data.id} className="text-sm">
                                                                        <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                            {key + 1}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.invoice_package}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.consignee}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {moment(data.withdrawal_date).format('DD/MM/YYYY')}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.withdrawal_amount}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {/* แสดงยอดโอนเฉพาะรายการแรกของกลุ่ม
                                                                            {key === 0 ? data.transfer_amount : ''} */}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.pay_price}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.pay_gasoline}
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            <div className="flex flex-col items-center">
                                                                                <span className="font-medium text-green-600">{data.pay_total}</span>
                                                                                <span className="text-xs text-gray-500 mt-1">
                                                                                    = {data.withdrawal_amount} - {data.pay_price} - {data.pay_gasoline}
                                                                                </span>
                                                                            </div>
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                            {data.return_people === "คืนShipping"
                                                                                ? <p className="bg-purple-500 text-white px-2 rounded">{data.return_people}</p>
                                                                                : <p className="bg-green-500 text-white px-2 rounded">{data.return_people}</p>
                                                                            }
                                                                        </Table.Td>
                                                                        <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                        </Table.Td>
                                                                    </Table.Tr>
                                                                );
                                                            })}

                                                        {/* Group Summary */}
                                                        {summaryRecord && (
                                                            <Table.Tr className="bg-blue-50 font-medium border-t-2 border-blue-200">
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900" colSpan={4}>
                                                                    {/* <span className="font-medium text-blue-700">รายการสรุปกลุ่มที่ {groupIndex + 1}</span> */}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                    {groupItems
                                                                        .reduce((sum: number, item: any) => sum + Number(item.withdrawal_amount || 0), 0)
                                                                        .toLocaleString()}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                    {summaryRecord.transfer_amount || '0'}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                    {summaryRecord.pay_price || '0'}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                    {summaryRecord.pay_gasoline || '0'}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-green-600 font-medium">
                                                                    {(
                                                                        (
                                                                            groupItems.reduce((sum: number, item: any) => sum + Number(item.withdrawal_amount || 0), 0) +
                                                                            Number(summaryRecord.pay_gasoline || 0) +
                                                                            Number(summaryRecord.pay_price || 0)
                                                                        ) -
                                                                        Number(summaryRecord.transfer_amount || 0)
                                                                    ).toLocaleString()}
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                    {summaryRecord.return_people === "คืนShipping"
                                                                        ? <p className="bg-purple-500 text-white px-2 rounded">{summaryRecord.return_people}</p>
                                                                        : <p className="bg-green-500 text-white px-2 rounded">{summaryRecord.return_people}</p>
                                                                    }
                                                                </Table.Td>
                                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        )}

                                                        {/* Separator between groups */}
                                                        <Table.Tr>
                                                            <Table.Td colSpan={11} className="p-1 bg-gray-200"></Table.Td>
                                                        </Table.Tr>
                                                    </React.Fragment>
                                                );
                                            })
                                        }

                                        {/* Overall Total Row */}
                                        {filteredData?.length > 0 && (
                                            <Table.Tr className="bg-gray-50 font-medium">
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900" colSpan={4}>
                                                    <span className="font-medium">รวมทั้งหมด</span>
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                    {filteredData
                                                        .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                        .reduce((sum: number, item: any) => sum + Number(item.withdrawal_amount || 0), 0)
                                                        .toLocaleString()}
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                    {/* คำนวณยอดโอนรวมจากยอดโอนของแต่ละกลุ่ม (เลือกเฉพาะรายการแรกของแต่ละกลุ่ม) */}
                                                    {Object.entries(
                                                        filteredData
                                                            .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                            .reduce((groups: Record<string, any[]>, item: any) => {
                                                                const groupId = item.group_id || 'ungrouped';
                                                                if (!groups[groupId]) {
                                                                    groups[groupId] = [];
                                                                }
                                                                groups[groupId].push(item);
                                                                return groups;
                                                            }, {} as Record<string, any[]>)
                                                    )
                                                        .map(([_, groupItems]) => groupItems[0]) // เลือกรายการแรกของแต่ละกลุ่ม
                                                        .reduce((sum: number, item: any) => sum + Number(item.transfer_amount || 0), 0)
                                                        .toLocaleString()}
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                    {filteredData
                                                        .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                        .reduce((sum: number, item: any) => sum + Number(item.pay_price || 0), 0)
                                                        .toLocaleString()}
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                    {filteredData
                                                        .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                        .reduce((sum: number, item: any) => sum + Number(item.pay_gasoline || 0), 0)
                                                        .toLocaleString()}
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-green-600 font-medium">
                                                    {(
                                                        // ยอดเบิกรวมทั้งหมด
                                                        filteredData
                                                            .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                            .reduce((sum: number, item: any) => sum + Number(item.withdrawal_amount || 0), 0)
                                                        +
                                                        // ค่าน้ำมันรวมทั้งหมด
                                                        filteredData
                                                            .filter((item: any) => item.invoice_package === 'SUMMARY_RECORD')
                                                            .reduce((sum: number, item: any) => sum + Number(item.pay_gasoline || 0), 0)
                                                        +
                                                        // ค่าอื่นๆรวมทั้งหมด
                                                        filteredData
                                                            .filter((item: any) => item.invoice_package === 'SUMMARY_RECORD')
                                                            .reduce((sum: number, item: any) => sum + Number(item.pay_price || 0), 0)
                                                        -
                                                        // คำนวณยอดโอนรวมทั้งหมด (เลือกเฉพาะรายการแรกของแต่ละกลุ่ม)
                                                        Object.entries(
                                                            filteredData
                                                                .filter((item: any) => item.invoice_package !== 'SUMMARY_RECORD')
                                                                .reduce((groups: Record<string, any[]>, item: any) => {
                                                                    const groupId = item.group_id || 'ungrouped';
                                                                    if (!groups[groupId]) {
                                                                        groups[groupId] = [];
                                                                    }
                                                                    groups[groupId].push(item);
                                                                    return groups;
                                                                }, {} as Record<string, any[]>)
                                                        )
                                                            .map(([_, groupItems]) => groupItems[0]) // เลือกรายการแรกของแต่ละกลุ่ม
                                                            .reduce((sum: number, item: any) => sum + Number(item.transfer_amount || 0), 0)
                                                    ).toLocaleString()}
                                                </Table.Td>
                                                <Table.Td className="text-center border-slate-200/60 text-gray-900" colSpan={2}>
                                                </Table.Td>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>

                            </div>

                            <div className="flex justify-end mt-5 bg-gray-100  flex-wrap items-center p-1 flex-reverse gap-y-2 sm:flex-row">
                                <nav className="relative z-0 inline-flex rounded-md shadow-md -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        {/* Previous Icon (replace with your preferred icon library) */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
                                                    className={`relative inline-flex items-center px-4 py-2    text-sm font-medium ${currentPage === pageNumber ? "text-primary-600 bg-gray-400 rounded-lg" : "text-gray-700"
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
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        {/* Next Icon (replace with your preferred icon library) */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>

                                </nav>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableComponent