"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";

import { useState, useEffect, useCallback, createRef, useMemo } from "react";
import { CirclePlus, ArrowUpFromLine } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";

import Lucide from "../../components/Base/Lucide";



import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";

import Button from "../../components/Base/Button";
import Table from "../../components/Base/Table";

import _ from "lodash";


//services
import { getCustomer } from "../../services/customer";

//store

import {
  setCustomerData as setCustomer,
  setFormAddCustomer,
  updateCustomerStatus,
  customerData,

} from "@/stores/customer";
import ModalCreateCustomer from "@/components/Sale/Customer/ModalAddcustomer";



function Main() {

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

  const { customer, formAddcustomer, totalData } = useAppSelector(customerData);
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
    await Getcustomer()
  }
  const AddFormCustomer = async () => {
    dispatch(setFormAddCustomer(true))
  }



  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const Getcustomer = useCallback(async () => {
    const customer = await getCustomer(currentPage, status, tag);
    dispatch(setCustomer(customer));
  }, [currentPage, status, tag]);


  useEffect(() => {
    Getcustomer();
  }, [currentPage]);


  useEffect(() => {
    const totalPages = Math.ceil(totalData / 10);

    const startIndex = Math.min((currentPage - 1) * 10, customer.length);
    const endIndex = Math.min(startIndex + 10, customer.length);

    const currentData = customer;

    console.log("customer", customer);

    setCurrentData(currentData);
    setTotalPage(totalPages);
  }, [customer]);


  useEffect(() => {
    if (formAddcustomer) {
      Getcustomer();
    }
  }, [formAddcustomer])



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
              <a href="#" className="ml-1 text-gray-500 hover:text-gray-700">ข้อมูลลูกค้าที่ดูแล</a>
            </div>
          </li>

        </ol>
      </nav>
      <div className="lg:flex md:flex ">
        <div className="flex  p-5">
          <p className="text-black text-xl font-bold mr-5">
            ลูกค้าที่ดูแลทั้งหมด 
            
          </p>
     
          <div style={{
          background: "linear-gradient(0.44deg, #213269 -15.38%, #4D799D 95.26%),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))"
          }}
          className="w-20 rounded-lg text-white text-center p-1"
          >
          {currentData.length} คน
          </div>
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
              <select
                onChange={(e: any) => {
                  if (e.target.value != "") {
                    const cus = customer.filter((res: any) => {
                      return res.customer_status[0].cus_status === e.target.value
                    })
                    setCurrentData(cus)
                  }
                  else {
                    setCurrentData(customer)
                  }
                }}
                id="countries" className=" border border-gray-200 text-gray-400  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected value="" className="text-gray-200">Status</option>
                <option value="สนใจ">สนใจ</option>
                <option value="ไม่สนใจ">ไม่สนใจ</option>
                <option value="ติดตามต่อ">ติดตามต่อ</option>
                <option value="ติดต่อไม่ได้">ติดต่อไม่ได้</option>
                <option value="ปิดการขาย">ปิดการขาย</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            <div className="col-span-12">
              <div className="mt-1">
                <div className="flex p-4 flex-col box box--stacked">
                  <div className="relative flex flex-row  overflow-x-auto shadow-md sm:rounded-lg">


                    {currentData
                      .filter((row: any) =>
                        !searchedVal.length || row?.cus_fullname.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.customer_status[0].cus_status.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.cus_etc.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.cus_line.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.cus_phone.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.cus_website.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                        || row?.details.toString()
                          .toLowerCase()
                          .includes(searchedVal.toString().toLowerCase())
                      )
                      .map((data: any, key: number) => {
                        return (
                          <>
                            <div className="w-full basis-1/4  pt-5 max-w-sm mr-5 mb-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                              <div className="flex flex-col items-center pb-10">
                                <svg className="w-24 h-24 mb-3 rounded-full shadow-lg" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>

                                <h5 className="mb-1 text-xl font-medium text-gray-900 text-[#417CA0]">{data.cus_fullname}</h5>
                                <span className="text-sm text-gray-500 mb-5 dark:text-gray-400">เบอร์โทรศัพท์ : {data.cus_phone}</span>
                                <button
                                      className={`badge ${data?.color}   w-25 text-white   p-1 rounded-md`}
                                    >

                                      {data?.d_status}
                                    </button>
                              </div>
                              <div className="flex justify-center bg-gray-100  text-center pt-2 pb-2 mb-5">
                                <button
                                  onClick={() => {
                                    router.push(`/customer/content/${data?.id}`)
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

                                <button className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg">
                                  <Lucide
                                    color="#FF5C5C"
                                    icon="Trash"
                                    className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                  ></Lucide>
                                </button>
                              </div>
                            </div>



                          </>
                        );
                      })}



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

      </div>

    </>
  );
}

export default Main;
