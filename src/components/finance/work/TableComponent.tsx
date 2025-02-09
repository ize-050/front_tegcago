"use client"
import moment from "moment"
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
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        if(!purchase?.purchase) return
        setCurrentData(purchase?.purchase)
        setTotalPage(Math.ceil(purchase?.total / 10))
        console.log("finance_purchase", purchase?.purchase)
    }, [purchase])


    useEffect(() => {
        console.log("currentData", currentData)
    }, [currentData])

    const handleSearch = (e: any) => {
        setSearchedVal(e.target.value)
    }

    useEffect(() => {
        const filteredData = currentData?.filter((item: any) => item.purchase_number.includes(searchedVal))
        setCurrentData(filteredData)
    }, [searchedVal])

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
                        <div className="flex p-4 flex-col box box--stacked">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                                เลขที่ตีราคา
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                วันที่
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                                ประเภทShipment
                                            </Table.Td>

                                            <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                                เลข Shipment
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                                                Status
                                            </Table.Td>
                                            <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {currentData?.length > 0 &&
                                            currentData
                                                .filter((row: any) =>
                                                    !searchedVal?.length
                                                    || row?.book_number.toString()
                                                        .toLowerCase()
                                                        .includes(searchedVal.toString().toLowerCase())
                                                    || row?.d_route.toString()
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
                                                                    {data.book_number}
                                                                </Table.Td>
                                                                <Table.Td className="text-center  truncate   border-slate-200/60  text-gray-900">
                                                                    {moment(data.createdAt).format('YYYY/MM/DD HH:mm')}  น.
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.d_shipment_number ? data.d_shipment_number.match(/[A-Za-z]+/)[0] || data.d_shipment_number : '-'}
                                                                </Table.Td>
                                                                <Table.Td className="text-center   truncate border-slate-200/60  text-gray-900">
                                                                    {data.d_shipment_number ? data.d_shipment_number : '-'}
                                                                </Table.Td>


                                                                <Table.Td className="text-center truncate  border-slate-200/60  text-gray-900">
                                                                    <div className={`${data?.color} truncate  rounded-md  p-1  w-auto text-white`}>{data?.d_status}</div>
                                                                </Table.Td>


                                                                <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                                                    <div className="flex">
                                                                        <button
                                                                            onClick={() => {
                                                                                router.replace(`/finance/work/content/${data?.id}`)
                                                                            }}
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