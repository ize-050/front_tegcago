"use client"
import moment from "moment"
import axios from "../../../../axios";
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { useAppDispatch, useAppSelector } from "@/stores/hooks"
import { purchaseData } from "@/stores/purchase"


//component
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";

interface TableComponentProps {
    purchase: {
        purchase: any[],
        total: number
    }
}

const TableComponent: React.FC<TableComponentProps> = ({ purchase }) => {

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const [searchedVal, setSearchedVal] = useState("")
    const [currentData, setCurrentData] = useState<any[]>([])
    const [bookNumbers, setBookNumbers] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // เพิ่ม state สำหรับตัวกรองวันที่และประเภท shipment
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [shipmentType, setShipmentType] = useState<string>("")

    // รายการประเภท shipment ตามที่ระบบ CS ใช้ในแท็บอัพเดทสถานะ
    const shipmentTypes = [
        { value: "", label: "ทั้งหมด" },
        { value: "SEA", label: "SEA" },
        { value: "CLG", label: "CLG" },
        { value: "LCL", label: "LCL" },
        { value: "EK", label: "EK" },
        { value: "EKCIF", label: "EKCIF" },
        { value: "EKCT", label: "EKCT" },
        { value: "AW", label: "AW" },
        { value: "RW", label: "RW" },
        { value: "EXSEA", label: "EXSEA" },
        { value: "EXEK", label: "EXEK" },
        { value: "EXRW", label: "EXRW" },
        { value: "SLG", label: "SLG" }
    ]

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Function to export data to Excel using Axios
    const exportToExcel = async () => {
        try {
            // Get the token from localStorage
            
            // Create URL with query parameters
            const baseUrl = `${process.env.NEXT_PUBLIC_URL_API}/finance/export-finance-work`;
            const queryParams = new URLSearchParams();
            
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);
            if (shipmentType) queryParams.append('shipmentType', shipmentType);
            
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
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
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
            console.error('Error downloading file:', error);
            alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
        }
    };

    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        if (!purchase?.purchase) return

        setCurrentData(purchase?.purchase)
        setTotalPage(Math.ceil(purchase?.total / 10))
        console.log("finance_purchase", purchase?.purchase)
    }, [purchase])


    useEffect(() => {
        console.log("currentData", currentData)
    }, [currentData])

    useEffect(() => {
        // Extract unique book numbers from purchaseData
        if (purchase?.purchase) {
            const uniqueBookNumbers = [...new Set(purchase?.purchase.map((item: any) => item.book_number))];
            setBookNumbers(uniqueBookNumbers.filter(Boolean)); // Remove null/undefined values
        }
    }, [purchase])

    const filteredSuggestions = bookNumbers.filter(number =>
        number.toLowerCase().includes(searchedVal.toLowerCase())
    );

    const handleSearch = (e: any) => {
        const value = e.target.value;
        setSearchedVal(value);
        // แสดงผลลัพธ์เฉพาะเมื่อมีการพิมพ์ข้อความเท่านั้น
        setShowSuggestions(value.trim().length > 0);
    }

    const handleSelectSuggestion = (value: string) => {
        setSearchedVal(value);
        setShowSuggestions(false);
    }

    // ฟังก์ชันรีเซ็ตตัวกรอง
    const resetFilters = () => {
        setSearchedVal("");
        setStartDate("");
        setEndDate("");
        setShipmentType("");
    }

    // ฟังก์ชันกรองข้อมูลตามเงื่อนไขทั้งหมด
    const filteredData = currentData?.filter((item: any) => {
        // กรองตามข้อความค้นหา (ค้นหาได้ทุกช่อง)
        const searchMatch = !searchedVal ? true : (
            (item?.book_number?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_route?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_status?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_term?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_transport?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_shipment_number?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.customer?.name?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_origin?.toLowerCase().includes(searchedVal.toLowerCase())) ||
            (item?.d_destination?.toLowerCase().includes(searchedVal.toLowerCase()))
        );

        // กรองตามวันที่
        let dateMatch = true;
        if (startDate || endDate) {
            const itemDate = moment(item?.createdAt);

            if (startDate && endDate) {
                dateMatch = itemDate.isBetween(moment(startDate), moment(endDate), 'day', '[]');
            } else if (startDate) {
                dateMatch = itemDate.isSameOrAfter(moment(startDate), 'day');
            } else if (endDate) {
                dateMatch = itemDate.isSameOrBefore(moment(endDate), 'day');
            }
        }

        // กรองตามประเภท shipment
        const shipmentMatch = !shipmentType ? true : item?.d_transport === shipmentType;

        // ต้องผ่านทุกเงื่อนไขการกรอง
        return searchMatch && dateMatch && shipmentMatch;
    });

    const handleView = (id: number) => {
        router.push(`/cs/purchase/${id}`)
    }

    const handleEdit = (id: number) => {
        router.push(`/cs/purchase/edit/${id}`)
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-y-10 gap-x-6">
                <div className="col-span-12">
                    <div className="mt-1">
                        <div className="flex p-2 flex-col box box--stacked">
                            <br></br>
                            <div className="relative p-2 overflow-x-auto shadow-md sm:rounded-lg">

                                {/* ส่วนของการค้นหาและตัวกรอง */}
                                <div className="mb-5 flex flex-wrap items-center gap-3">
                                    {/* ช่องค้นหา */}
                                    <div className="relative">
                                        <label className="block text-xs text-gray-500 mb-1">ค้นหา</label>
                                        <input
                                            type="text"
                                            placeholder="ค้นหา"
                                            value={searchedVal}
                                            onChange={handleSearch}
                                            onFocus={() => {
                                                // แสดงผลลัพธ์เฉพาะเมื่อมีการพิมพ์ข้อความเท่านั้น
                                                if (searchedVal.trim().length > 0) {
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onBlur={() => {
                                                // ใช้ setTimeout เพื่อให้สามารถคลิกเลือกรายการได้ก่อนที่ dropdown จะหายไป
                                                setTimeout(() => {
                                                    setShowSuggestions(false);
                                                }, 200);
                                            }}
                                            className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-transparent"
                                        />
                                        {showSuggestions && searchedVal.trim().length > 0 && filteredSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                {filteredSuggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleSelectSuggestion(suggestion)}
                                                    >
                                                        {suggestion}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* ตัวกรองวันที่เริ่มต้น */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">วันที่เริ่มต้น</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                                        />
                                    </div>

                                    {/* ตัวกรองวันที่สิ้นสุด */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">วันที่สิ้นสุด</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                                        />
                                    </div>

                                    {/* ตัวกรองประเภท shipment */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">ประเภท Shipment</label>
                                        <select
                                            value={shipmentType}
                                            onChange={(e) => setShipmentType(e.target.value)}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                                        >
                                            {shipmentTypes.map((type, index) => (
                                                <option key={index} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ปุ่มรีเซ็ตตัวกรอง */}
                                    <div className="ml-auto flex gap-2">
                                        <button
                                            onClick={exportToExcel}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                        >
                                            <i className="fas fa-file-excel mr-2"></i>
                                            Export Excel
                                        </button>
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            <i className="fas fa-sync-alt mr-2"></i>
                                            รีเซ็ตตัวกรอง
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
                                            <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                                เลข Shipment
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                                เลขที่ตีราคา
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                วันที่
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                ประเภทShipment
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                Container No
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                B/L No
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                Consignee
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                Agency
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                สายเรือ
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                ETD
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                ETA
                                            </Table.Td>
                                          
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                สถานะใบจอง
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                สถานะทางบัญชี
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {filteredData?.length > 0 ?
                                            filteredData.map((data: any, key: number) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <Table.Tr className="text-sm">
                                                            <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                {key + 1}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_shipment_number || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.book_number}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.createdAt ? moment(data.createdAt).format('DD/MM/YYYY') : '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_transport || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.cs_purchase[0]?.receive?.container_no || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.cs_purchase?.find((res: any) => res.status_key === "Departure")?.provedeparture?.bl_no || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.cs_purchase?.find((res: any) => res.status_name === "จองตู้")?.bookcabinet?.consignee || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_agentcy?.some((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                    ? data.d_agentcy.find((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                        ?.d_sale_agentcy[0]?.d_agentcy?.agentcy?.agent_name || '-'
                                                                    : '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_agentcy?.some((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                    ? data.d_agentcy.find((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                        ?.d_sale_agentcy[0]?.d_agentcy?.agent_boat || '-'
                                                                    : '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_agentcy?.some((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                    ? data.d_agentcy.find((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                        ?.d_sale_agentcy[0]?.d_agentcy?.agentcy_eta || '-'
                                                                    : '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_agentcy?.some((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                    ? data.d_agentcy.find((agency: any) => agency?.d_sale_agentcy?.length > 0)
                                                                        ?.d_sale_agentcy[0]?.d_agentcy?.agentcy_etd || '-'
                                                                    : '-'}
                                                            </Table.Td>
                                                           
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.d_status || '-'}
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.purchase_finance.length > 0 &&
                                                                    <>
                                                                        <div className={`truncate rounded-md p-1 w-auto text-black`}>{data?.purchase_finance[0]?.payment_status}</div>
                                                                    </>
                                                                }
                                                            </Table.Td>
                                                            <Table.Td className="text-center border-slate-200/60 text-gray-900">
                                                                <div className="flex">
                                                                    <button
                                                                        onClick={() => {
                                                                            router.replace(`/finance/work/content/${data?.id}`)
                                                                        }}
                                                                        style={{
                                                                            background: "#C8D9E3"
                                                                        }}
                                                                        className="hover:bg-blue-500 w-8 h-8 rounded-lg mr-1">
                                                                        <Lucide
                                                                            color="#6C9AB5"
                                                                            icon="Pencil"
                                                                            className="inset-y-0 bg-secondary-400 justify-center m-auto w-5 h-5 text-slate-500"
                                                                        ></Lucide>
                                                                    </button>
                                                                </div>
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    </React.Fragment>
                                                );
                                            })
                                            :
                                            <Table.Tr>
                                                <Table.Td colSpan={14} className="text-center py-4 text-gray-500">
                                                    ไม่พบข้อมูล
                                                </Table.Td>
                                            </Table.Tr>
                                        }
                                    </Table.Tbody>
                                </Table>
                            </div>

                            <div className="flex justify-end mt-5 bg-gray-100  flex-wrap items-center p-1 flex-reverse gap-y-2 sm:flex-row">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        {/* Previous Icon (replace with your preferred icon library) */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>

                                    </button>
                                    <button>
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
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        {/* Next Icon (replace with your preferred icon library) */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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