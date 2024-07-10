"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";

import { useState, useEffect, createRef ,useMemo} from "react";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../stores/hooks";

import Lucide from "../components/Base/Lucide";

import clsx from "clsx";

import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";

import Button from "../components/Base/Button";
import { formatCurrency } from "@/utils/helper";
import Table from "../components/Base/Table";

import _ from "lodash";

//services
import { getCustomer } from "../services/customer";

//store

import {
  setCustomerData as setCustomer,
  updateCustomerStatus,
  customerData,
} from "@/stores/customer";



function Main() {

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


  
  const handleButtonClick = (key: number) => {
    setTooltipOpen(tooltipOpen === key ? null : key);
  };
  const dispatch = useAppDispatch();

  const changeSubmit = async (id:string , data:string) =>{

    const PackData :Partial<any> ={
       id:id,
       status: data
    }
       await dispatch(updateCustomerStatus(PackData))
       await setTooltipOpen(null)
       await Getcustomer()
  }


  const Getcustomer = async () => {
    const customer = await getCustomer();
    dispatch(setCustomer(customer));
    // console.log('customer',customer)
  };

  const { customer } = useAppSelector(customerData);
  useEffect(() => {
    
    Getcustomer();

  }, []);


  return (
    <>
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
                placeholder="Search products..."
                className="pl-9 sm:w-34 rounded-[0.5rem]"
              />
            </div>

            <div className="relative">
              <select
                id="status"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <option selected>Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <select
              id="tag"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected>Tag ติดตาม</option>
              <option value="tag1">Tag 1</option>
              <option value="tag2">Tag 2</option>
            </select>

            <select
              id="deliver"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected>ส่งมอบงาน</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
            </select>
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
                          className="text-sm font-bold "
                        >
                          <Table.Td className="py- font-medium text-center   border-t 0 border-slate-200/60 text-black">
                            No
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                            วันที่สร้าง
                          </Table.Td>
                          <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                            ชื่อบริษัท/ร้านค้า/เพจ
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center  border-t  border-slate-200/60 text-black">
                            ชื่อลูกค้า
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center  border-t  border-slate-200/60 text-black">
                            Status
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-black">
                            Tag ติดตาม
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            เบอร์โทรศัพท์
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            Line ID
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            การติดต่อ
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            Website
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            ส่งมอบงาน
                          </Table.Td>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {customer.map((data: any, key: number) => {
                          return (
                            <>
                              <Table.Tr className="text-sm  ">
                              <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                  {key + 1}
                                </Table.Td>
                                <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                  {data.createdAt}
                                </Table.Td>
                                <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                  {data.details?.cd_company}
                                </Table.Td>
                                <Table.Td className="text-center  border-slate-200/60  text-gray-900">
                                  {data?.cus_fullname}
                                </Table.Td>
                                <Table.Td className="text-center  border-slate-200/60  text-gray-900">
                                  -
                                </Table.Td>
                                <Table.Td className=" relative text-center  border-slate-200/60  text-gray-900">
                                  <button
                                    className="badge  bg-blue-500 w-20 text-white  p-1 rounded-md"
                                    onClick={() => {
                                      handleButtonClick(key);
                                    }}
                                  >
                                    {data?.customer_status[0].cus_status}
                                  </button>

                                  {tooltipOpen === key && (
                                    <div
                                      role="tooltip"
                                      className="absolute z-50 left-0 border-2 w-full mt-4 px-3 py-2 text-sm font-medium text-white bg-white rounded-lg shadow-sm "
                                    >
                                      {/* Your tooltip content for the first button */}
                                      <div className="block ">
                                        <ul className="">
                                          {statusTag.map((status, key) => {
                                            return (
                                              <>
                                                <li className="mb-2">
                                                  <button className={`badge  ${status.color} w-20 text-white  p-1 rounded-md`}
                                                  onClick={()=>{
                                                    changeSubmit(data?.id , status.name)
                                                  }}
                                                  >
                                                    {status.name}
                                                  </button>
                                                </li>
                                              </>
                                            )
                                          })}
                                        </ul>
                                      </div>
                                      <div
                                        className="tooltip-arrow"
                                        data-popper-arrow
                                      ></div>
                                    </div>
                                  )}
                                </Table.Td>
                                <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                  {data?.cus_phone}
                                </Table.Td>
                                <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                  {data?.cus_line}
                                </Table.Td>
                                <Table.Td className="text-center  border-slate-200/60  text-gray-900">
                                  {data.cus_etc}
                                </Table.Td>
                                <Table.Td className="text-center border-slate-200/60  text-gray-900">
                                  {data?.cus_website}
                                </Table.Td>
                                <Table.Td className="text-center  border-slate-200/60  text-gray-900">
                                  {data?.cus_website}
                                </Table.Td>
                              </Table.Tr>
                            </>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </div>
                  <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                    <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                      <Pagination.Link>
                        <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                      </Pagination.Link>
                      <Pagination.Link>
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </Pagination.Link>
                      <Pagination.Link>...</Pagination.Link>
                      <Pagination.Link>1</Pagination.Link>
                      <Pagination.Link active>2</Pagination.Link>
                      <Pagination.Link>3</Pagination.Link>
                      <Pagination.Link>...</Pagination.Link>
                      <Pagination.Link>
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </Pagination.Link>
                      <Pagination.Link>
                        <Lucide icon="ChevronsRight" className="w-4 h-4" />
                      </Pagination.Link>
                    </Pagination>
                    <FormSelect className="sm:w-20 rounded-[0.5rem]">
                      <option>10</option>
                      <option>25</option>
                      <option>35</option>
                      <option>50</option>
                    </FormSelect>
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
