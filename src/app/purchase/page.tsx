"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
//lib
import { useState, useEffect, useCallback, createRef, useMemo } from "react";
import moment from 'moment'
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'






//component
import { FormInput } from "@/components/Base/Form";
import { CirclePlus, ArrowUpFromLine } from 'lucide-react';
import Button from "../../components/Base/Button";
import Table from "../../components/Base/Table";
import Lucide from "../../components/Base/Lucide";

//services
import { getAllPurchase, cancelPurchase } from "../../services/purchase";

//store
import { useAppDispatch, useAppSelector } from "../../stores/hooks";

import {
  updateCustomerStatus,

  resetStore

} from "@/stores/customer";

import {
  purchaseData
} from "@/stores/purchase"

import ModalCreateCustomer from "@/components/Sale/Customer/ModalAddcustomer";
import { setAllPurchase } from "@/stores/purchase";



function Purchase() {

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const router = useRouter()

  const statusTag = [
    {
      id: 1,
      name: "สนใจ",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "ไม่สนใจ",
      color: "bg-red-400"
    },
    {
      id: 3,
      name: "ติดตามต่อ",
      color: "bg-orange-300"
    },
    {
      id: 4,
      name: "ติดต่อไม่ได้",
      color: "bg-gray-300"
    },
    {
      id: 5,
      name: "ปิดการขาย",
      color: "bg-green-400"
    },
  ]
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const [searchedVal, setSearchedVal] = useState("");
  const [totalPage, setTotalPage] = useState(0)

  const [currentData, setCurrentData] = useState([])
  const { purchaseAll, totalData } = useAppSelector(purchaseData)

  const handleButtonClick = (key: any) => {
    setTooltipOpen(tooltipOpen === key ? null : key);
  };
  const dispatch = useAppDispatch();

  const changeSubmit = async (id: string, data: string) => {

    const PackData: Partial<any> = {
      id: id,
      status: data
    }
    await dispatch(updateCustomerStatus(PackData))
    await setTooltipOpen(null)
    await GetAllpurchase()
  }
  const reAllpurchase = async () => {
    router.push('/purchase/add')
  }



  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };



  const GetAllpurchase = useCallback(async () => {
    const purchase = await getAllPurchase(currentPage, status, tag);
    dispatch(setAllPurchase(purchase));

  }, [currentPage, status, tag]);


  const cancelOrder = async (id: string) => {
    Swal.fire({
      title: 'คุณต้องการยกเลิกรายการจองนี้หรือไม่',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cancel = await cancelPurchase(id);
        const purchase = await getAllPurchase(currentPage, status, tag);
        dispatch(setAllPurchase(purchase));
      }
    }).catch((err) => {
      console.log('cancelOrderError', err)
    })
  }

  useEffect(() => {
    dispatch(resetStore())
  }, [])

  useEffect(() => {
    GetAllpurchase();
  }, [currentPage]);


  useEffect(() => {
    const totalPages = Math.ceil(totalData / 10);

    const startIndex = Math.min((currentPage - 1) * 10, purchaseAll.length);
    const endIndex = Math.min(startIndex + 10, purchaseAll.length);

    const currentData: any = purchaseAll;

    console.log('purchaseAll', purchaseAll)

    setCurrentData(currentData);
    setTotalPage(totalPages);
  }, [purchaseAll]);


  // useEffect(() => {
  //   if (formAddcustomer) {
  //     getAllPurchase();
  //   }
  // }, [formAddcustomer])



  return (
    <>
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="ml-1">Home</span>
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <a href="#" className="ml-1 text-gray-500 hover:text-gray-700">Projects</a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <span className="ml-1 text-gray-700">Marketing</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
            ข้อมูลรายการจอง
          </p>
        </div>
        <div className="justify-end p-5">
          <Button className="text-white  border-blue-800"
            onClick={() => {
              reAllpurchase()
            }}
            style={{
              background: "#273A6F"
            }}
          >
            <CirclePlus
              color="#ffffff"

              className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
            ></CirclePlus>

            เพิ่มรายการจอง
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-5 ">
        <div
          className="bg-white  rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <div className="grid grid-cols-6 gap-4 items-center space-x-6  p-4">
            <div className="relative">
              <Lucide
                icon="Search"
                className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
              />
              <FormInput
                type="text"
                placeholder="Search"
                className="pl-9 sm:w-34 rounded-[0.5rem] text-black"
                onChange={(e) => setSearchedVal(e.target.value)}
              />
            </div>

            <div className="relative">
              {/*<select*/}
              {/*  onChange={(e: any) => {*/}
              {/*    if (e.target.value != "") {*/}
              {/*      const cus = customer.filter((res: any) => {*/}
              {/*        return res.customer_status[0].cus_status === e.target.value*/}
              {/*      })*/}
              {/*      setCurrentData(cus)*/}
              {/*    }*/}
              {/*    else {*/}
              {/*      setCurrentData(customer)*/}
              {/*    }*/}
              {/*  }}*/}
              {/*  id="countries" className=" border border-gray-200 text-gray-400  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">*/}
              {/*  <option selected value="" className="text-gray-200">Status</option>*/}
              {/*  <option value="สนใจ">สนใจ</option>*/}
              {/*  <option value="ไม่สนใจ">ไม่สนใจ</option>*/}
              {/*  <option value="ติดตามต่อ">ติดตามต่อ</option>*/}
              {/*  <option value="ติดต่อไม่ได้">ติดต่อไม่ได้</option>*/}
              {/*  <option value="ปิดการขาย">ปิดการขาย</option>*/}
              {/*</select>*/}
            </div>


            {/* <select
              id="deliver"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected>ส่งมอบงาน</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
            </select> */}
          </div>

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
                            วันที่สร้าง
                          </Table.Td>
                          <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                            ชื่อลูกค้า
                          </Table.Td>
                          <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                            เลขที่
                          </Table.Td>
                          <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                            Route
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                            Transport
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            Term
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            สถานะ
                          </Table.Td>
                          <Table.Td className="py-4 font-medium truncate text-center border-t   border-slate-200/60 text-black">
                            ส่งมอบงาน
                          </Table.Td>
                          <Table.Td className="py-4 font-medium truncate text-center border-t   border-slate-200/60 text-black">

                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                          </Table.Td>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {currentData
                          .filter((row: any) =>
                            !searchedVal.length || row?.customer.cus_fullname.toString()
                              .toLowerCase()
                              .includes(searchedVal.toString().toLowerCase())
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
                          )
                          .map((data: any, key: number) => {
                            return (
                              <>
                                <Table.Tr className="text-sm  ">
                                  <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                    {key + 1}
                                  </Table.Td>
                                  <Table.Td className="text-center truncate truncate    border-slate-200/60  text-gray-900">
                                    {moment(data.createdAt).format('YYYY/MM/DD HH:mm')} น.
                                  </Table.Td>
                                  <Table.Td className="text-center  truncate   border-slate-200/60  text-gray-900">
                                    {data?.customer?.cus_fullname}
                                  </Table.Td>
                                  <Table.Td className="text-center truncate  truncate border-slate-200/60  text-gray-900">
                                    {data.book_number}
                                  </Table.Td>

                                  <Table.Td className=" relative text-center  border-slate-200/60  text-gray-900">
                                    {data.d_route}
                                  </Table.Td>
                                  <Table.Td className="text-center  truncate  border-slate-200/60  text-gray-900">
                                    {data.d_transport}
                                  </Table.Td>
                                  <Table.Td className="text-center truncate   border-slate-200/60  text-gray-900">
                                    {data.d_term}
                                  </Table.Td>

                                  <Table.Td className="text-center truncate  border-slate-200/60  text-gray-900">
                                    <div className={`${data?.color} truncate  rounded-md  p-1  w-auto text-white`}>{data?.d_status}</div>
                                  </Table.Td>

                                  <Table.Td className="text-center  truncate border-slate-200/60  text-gray-900">
                                    <select className="w-auto  rounded-md space-x-2">
                                      <option>กรุณาเลือก</option>
                                    </select>
                                  </Table.Td>

                                  <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                    <div className="flex">
                                      <button
                                        onClick={() => {
                                          router.replace(`purchase/content/${data?.id}`)
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
                                      {data.d_status !== 'ยกเลิกคำสั่งซื้อ' && data.d_status !== "ิปิดการขาย" &&
                                        <button className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg"
                                          onClick={() => {
                                            cancelOrder(data?.id)
                                          }}
                                        >
                                          <Lucide
                                            color="#FF5C5C"
                                            icon="Trash"

                                            className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                          ></Lucide>
                                        </button>
                                      }

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
                      {[...Array(totalPage)].map((_, index) => {
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
        <ModalCreateCustomer></ModalCreateCustomer>
      </div>

    </>
  );
}

export default Purchase;
