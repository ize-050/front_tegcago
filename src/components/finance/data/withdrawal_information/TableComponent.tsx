"use client"
import moment from "moment"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { useAppDispatch, useAppSelector } from "@/stores/hooks"
import { purchaseData } from "@/stores/purchase"
import { setModalWithdrawal, setFormWithdrawal } from '@/stores/finance'

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        console.log("dataWidhdrawalInformation", datawidhdrawalInformation)
        if (!datawidhdrawalInformation?.widhdrawalInformation) return
        setCurrentData(datawidhdrawalInformation?.widhdrawalInformation)
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

    const filteredData = currentData?.filter((item: any) => {
        if (!searchedVal) return true;
        return item.invoice_package?.toLowerCase().includes(searchedVal.toLowerCase());
    });

    const handleDelete = async (id: number) => {

        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณจะไม่สามารถย้อนกลับได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}/finance/withdrawal_information/${id}`)
                if (response?.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบข้อมูลสำเร็จ!',
                        text: 'Withdrawal information deleted successfully!',
                    })
                    onRefresh()
                }
            }
        }).catch((error) => {
            console.error("Error deleting withdrawal information:", error);
        });

    }

    const handleEdit = (data: any) => {
        // Format the data for the modal
        const formData = {
            id: data.id,
            invoice_package: data.invoice_package,
            consignee: data.consignee,
            head_tractor: data.head_tractor,
            withdrawal_date: moment(data.withdrawal_date).format('YYYY-MM-DD'),
            withdrawal_amount: data.withdrawal_amount,
            pay_price: data.pay_price,
            pay_gasoline: data.pay_gasoline,
            pay_total: data.pay_total,
            return_people: data.return_people
        }

        // Set the form data in the store
        dispatch(setFormWithdrawal(formData))
        // Open the modal
        dispatch(setModalWithdrawal(true))
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-y-10 gap-x-6">
                <div className="col-span-12">
                    <div className="mt-1">
                        <div className="flex p-4 flex-col box box--stacked">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="mb-5 relative">
                                    <input
                                        type="text"
                                        placeholder="ค้นหาเลข Invoice & PackingList No."
                                        value={searchedVal}
                                        onChange={handleSearch}
                                        onFocus={() => setShowSuggestions(true)}
                                        className="w-1/6 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none  focus:border-transparent"
                                    />
                                    {showSuggestions && filteredSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-1/6  mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
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
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                หัวจ่าย
                                            </Table.Td>

                                            <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                                วันที่เบิก
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                ยอดเบิก
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
                                            filteredData
                                                .filter((row: any) =>
                                                    !searchedVal?.length
                                                    || row?.invoice_package.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || row?.consignee.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || row?.d_status.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || row?.d_term.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || row?.d_transport.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || (row?.d_shipment_number && row.d_shipment_number.toString().toLowerCase().includes(searchedVal.toString().toLowerCase()))
                                                )
                                                .map((data: any, key: number) => {
                                                    return (
                                                        <>
                                                            <Table.Tr className="text-sm  ">
                                                                <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                                                    {key + 1}
                                                                </Table.Td>
                                                                <Table.Td className="text-center  truncate    border-slate-200/60  text-gray-900">
                                                                    {data.invoice_package}
                                                                </Table.Td>
                                                                <Table.Td className="text-center  truncate   border-slate-200/60  text-gray-900">
                                                                    {data.consignee}
                                                                </Table.Td>
                                                                <Table.Td className="text-center  truncate   border-slate-200/60  text-gray-900">
                                                                    {data.head_tractor}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {moment(data.withdrawal_date).format('DD/MM/YYYY')}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.withdrawal_amount}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.pay_price}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.pay_gasoline}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.pay_total}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.return_people === "คืนพี่เปิ้ล"
                                                                        ? <p className="bg-purple-500 text-white px-2 rounded">{data.return_people}</p>
                                                                        : <p className="bg-green-500 text-white px-2 rounded">{data.return_people}</p>
                                                                    }
                                                                </Table.Td>

                                                                <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                                                    <div className="flex justify-center gap-2">
                                                                        <button
                                                                            onClick={() => handleEdit(data)}
                                                                            style={{
                                                                                background: "#C8D9E3"
                                                                            }}
                                                                            className=" hover:bg-blue-500 w-8 h-8 rounded-lg mr-1">
                                                                            <Lucide
                                                                                color="#6C9AB5"
                                                                                icon="Pencil"
                                                                                className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                                                            ></Lucide>
                                                                        </button>

                                                                        <button
                                                                            onClick={() => handleDelete(data.id)}
                                                                        >
                                                                            <Lucide
                                                                                color="#6C9AB5"
                                                                                icon="Trash2"
                                                                                className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                                                            ></Lucide>
                                                                        </button>
                                                                    </div>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        </>
                                                    );
                                                })}
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