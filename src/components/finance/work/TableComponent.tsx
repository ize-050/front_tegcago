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

    // เพิ่ม state สำหรับตัวกรองต่างๆ
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [shipmentType, setShipmentType] = useState<string>("")
    const [bookNumberFilter, setBookNumberFilter] = useState<string>("") // เลขที่ตีราคา
    const [containerNoFilter, setContainerNoFilter] = useState<string>("") // Container No
    const [blNoFilter, setBlNoFilter] = useState<string>("") // B/L No
    const [consigneeFilter, setConsigneeFilter] = useState<string>("") // Consignee
    const [agencyFilter, setAgencyFilter] = useState<string>("") // Agency
    const [shipLineFilter, setShipLineFilter] = useState<string>("") // สายเรือ
    const [bookStatusFilter, setBookStatusFilter] = useState<string>("") // สถานะใบจอง
    const [accountStatusFilter, setAccountStatusFilter] = useState<string>("") // สถานะทางบัญชี
    const [etdFilter, setEtdFilter] = useState<string>("") // ETD
    const [etaFilter, setEtaFilter] = useState<string>("") // ETA

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
        { value: "SLG", label: "SLG" },
        { value: "AIS", label: "AIS" }
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
        setBookNumberFilter("");
        setContainerNoFilter("");
        setBlNoFilter("");
        setConsigneeFilter("");
        setAgencyFilter("");
        setShipLineFilter("");
        setBookStatusFilter("");
        setAccountStatusFilter("");
        setEtdFilter("");
        setEtaFilter("");
    }
    
    // ฟังก์ชันค้นหาข้อมูล
    const handleSearchClick = () => {
        // ไม่ต้องทำอะไรเพิ่มเติม เพราะการกรองจะทำงานในฟังก์ชัน filteredData อยู่แล้ว
        // แต่เราสามารถเพิ่มโค้ดเพื่อแสดงการทำงานได้ เช่น แสดงข้อความว่ากำลังค้นหา
        console.log("Searching with filters:", {
            searchedVal,
            startDate,
            endDate,
            shipmentType,
            bookNumberFilter,
            containerNoFilter,
            blNoFilter,
            consigneeFilter,
            agencyFilter,
            shipLineFilter,
            bookStatusFilter,
            accountStatusFilter,
            etdFilter,
            etaFilter
        });
    }

    // ฟังก์ชันกรองข้อมูลตามเงื่อนไขทั้งหมด
    const filteredData = currentData?.filter((item: any) => {
        // กรองตามเลข Shipment
        const shipmentNumberMatch = !searchedVal ? true : 
            (item?.d_shipment_number?.toLowerCase().includes(searchedVal.toLowerCase()));

        // กรองตามเลขที่ตีราคา
        const bookNumberMatch = !bookNumberFilter ? true : 
            (item?.book_number?.toLowerCase().includes(bookNumberFilter.toLowerCase()));

        // กรองตาม Container No
        const containerNoMatch = !containerNoFilter ? true : 
            (item?.cs_purchase[0]?.receive?.container_no?.toLowerCase().includes(containerNoFilter.toLowerCase()));

        // กรองตาม B/L No
        const blNoMatch = !blNoFilter ? true : 
            (item?.cs_purchase?.find((res: any) => res.status_key === "Departure")?.provedeparture?.bl_no?.toLowerCase().includes(blNoFilter.toLowerCase()));

        // กรองตาม Consignee
        const consigneeMatch = !consigneeFilter ? true : 
            (item?.cs_purchase?.find((res: any) => res.status_name === "จองตู้")?.bookcabinet?.consignee?.toLowerCase().includes(consigneeFilter.toLowerCase()));

        // กรองตาม Agency
        const agencyMatch = !agencyFilter ? true : 
            (item?.d_agentcy?.some((agency: any) => 
                agency?.d_sale_agentcy?.length > 0 && 
                agency?.d_sale_agentcy[0]?.d_agentcy?.agentcy?.agent_name?.toLowerCase().includes(agencyFilter.toLowerCase())
            ));

        // กรองตามสายเรือ
        const shipLineMatch = !shipLineFilter ? true : 
            (item?.d_agentcy?.some((agency: any) => 
                agency?.d_sale_agentcy?.length > 0 && 
                agency?.d_sale_agentcy[0]?.d_agentcy?.agent_boat?.toLowerCase().includes(shipLineFilter.toLowerCase())
            ));

        // กรองตามสถานะใบจอง
        const bookStatusMatch = !bookStatusFilter ? true : 
            (item?.purchase_finance[0]?.shipping_details?.shipping_advance_status?.toLowerCase().includes(bookStatusFilter.toLowerCase()));

        // กรองตามสถานะทางบัญชี
        const accountStatusMatch = !accountStatusFilter ? true : 
            (item?.purchase_finance[0]?.payment_status?.toLowerCase().includes(accountStatusFilter.toLowerCase()));

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

        // กรองตาม ETD
        let etdMatch = true;
        if (etdFilter) {
            const etdDate = item?.d_agentcy?.find((agency: any) => 
                agency?.d_sale_agentcy?.length > 0 && agency?.d_sale_agentcy[0]?.d_agentcy?.agentcy_etd
            )?.d_sale_agentcy[0]?.d_agentcy?.agentcy_etd;
            
            if (etdDate) {
                etdMatch = moment(etdDate).isSame(moment(etdFilter), 'day');
            } else {
                etdMatch = false;
            }
        }

        // กรองตาม ETA
        let etaMatch = true;
        if (etaFilter) {
            const etaDate = item?.d_agentcy?.find((agency: any) => 
                agency?.d_sale_agentcy?.length > 0 && agency?.d_sale_agentcy[0]?.d_agentcy?.agentcy_eta
            )?.d_sale_agentcy[0]?.d_agentcy?.agentcy_eta;
            
            if (etaDate) {
                etaMatch = moment(etaDate).isSame(moment(etaFilter), 'day');
            } else {
                etaMatch = false;
            }
        }

        // กรองตามประเภท shipment
        const shipmentMatch = !shipmentType ? true : item?.d_transport === shipmentType;

        // ต้องผ่านทุกเงื่อนไขการกรอง
        return shipmentNumberMatch && bookNumberMatch && containerNoMatch && blNoMatch && 
               consigneeMatch && agencyMatch && shipLineMatch && bookStatusMatch && 
               accountStatusMatch && dateMatch && etdMatch && etaMatch && shipmentMatch;
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
                                <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-base font-medium text-gray-700 mb-3">ตัวกรองการค้นหา</h3>
                                    
                                    {/* แถวที่ 1: ตัวกรองหลัก */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                                        {/* เลข Shipment */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">เลข Shipment</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหาเลข Shipment"
                                                value={searchedVal}
                                                onChange={handleSearch}
                                                onFocus={() => {
                                                    if (searchedVal.trim().length > 0) {
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    setTimeout(() => {
                                                        setShowSuggestions(false);
                                                    }, 200);
                                                }}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                                        {/* เลขที่ตีราคา */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">เลขที่ตีราคา</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหาเลขที่ตีราคา"
                                                value={bookNumberFilter}
                                                onChange={(e) => setBookNumberFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* ประเภท Shipment */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">ประเภท Shipment</label>
                                            <select
                                                value={shipmentType}
                                                onChange={(e) => setShipmentType(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                {shipmentTypes.map((type, index) => (
                                                    <option key={index} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Container No */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Container No</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหา Container No"
                                                value={containerNoFilter}
                                                onChange={(e) => setContainerNoFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* B/L No */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">B/L No</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหา B/L No"
                                                value={blNoFilter}
                                                onChange={(e) => setBlNoFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* แถวที่ 2: ตัวกรองเพิ่มเติม */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                                        {/* Consignee */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Consignee</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหา Consignee"
                                                value={consigneeFilter}
                                                onChange={(e) => setConsigneeFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Agency */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Agency</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหา Agency"
                                                value={agencyFilter}
                                                onChange={(e) => setAgencyFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* สายเรือ */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">สายเรือ</label>
                                            <input
                                                type="text"
                                                placeholder="ค้นหาสายเรือ"
                                                value={shipLineFilter}
                                                onChange={(e) => setShipLineFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* สถานะใบจอง (Shipping Advance Status) */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">สถานะ Shipping เบิก</label>
                                            <select
                                                value={bookStatusFilter}
                                                onChange={(e) => setBookStatusFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">ทั้งหมด</option>
                                                <option value="เคลียร์ครบแล้ว">เคลียร์ครบแล้ว</option>
                                                <option value="ยังไม่ได้เคลียร์">ยังไม่ได้เคลียร์</option>
                                                <option value="เคลียร์บางส่วน">เคลียร์บางส่วน</option>
                                            </select>
                                        </div>

                                        {/* สถานะทางบัญชี */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">สถานะทางบัญชี</label>
                                            <select
                                                value={accountStatusFilter}
                                                onChange={(e) => setAccountStatusFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">ทั้งหมด</option>
                                                <option value="ค้างชำระ">ค้างชำระ</option>
                                                <option value="ชำระบางส่วน">ชำระบางส่วน</option>
                                                <option value="ชำระครบแล้ว">ชำระครบแล้ว</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* แถวที่ 3: ตัวกรองวันที่ */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                        {/* วันที่เริ่มต้น */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">วันที่เริ่มต้น</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* วันที่สิ้นสุด */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">วันที่สิ้นสุด</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* ETD */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">ETD</label>
                                            <input
                                                type="date"
                                                value={etdFilter}
                                                onChange={(e) => setEtdFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* ETA */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">ETA</label>
                                            <input
                                                type="date"
                                                value={etaFilter}
                                                onChange={(e) => setEtaFilter(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* แถวที่ 4: ปุ่มดำเนินการ */}
                                    <div className="flex flex-wrap justify-end gap-3 mt-2">
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            รีเซ็ตตัวกรอง
                                        </button>
                                        <button
                                            onClick={handleSearchClick}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            ค้นหา
                                        </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
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
                                                สถานะ  Shipping
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
                                                                {data?.purchase_finance?.length > 0 &&
                                                                    <>
                                                                        <div className={`truncate rounded-md p-1 w-auto text-black`}>{data?.purchase_finance[0]?.payment_status}</div>
                                                                    </>
                                                                }
                                                            </Table.Td>
                                                            <Table.Td className="text-center truncate border-slate-200/60 text-gray-900">
                                                                {data?.purchase_finance.length > 0 &&
                                                                    <>
                                                                        <div className={`truncate rounded-md p-1 w-auto text-black`}>{data?.purchase_finance[0]?.shipping_details?.shipping_advance_status}</div>
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