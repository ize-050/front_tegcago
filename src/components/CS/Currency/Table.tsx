"use client";

import Table from "@/components/Base/Table";
import React, { useState, useEffect } from "react";
import moment from "moment";

//router
import { useRouter } from "next/navigation";

//store

import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import {
  systemData,
  setCurrentPage,
  setOpenModal,
  setDetail,
} from "@/stores/system";
import { Tab } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import Swal from "sweetalert2";
import { Partial, set } from "lodash";
import { StringDecoder } from "string_decoder";

//service
import { DeleteAgency } from "@/services/system/agency";
import { setOpenToast } from "@/stores/util";
import { DeleteCurrency } from "@/services/system/currency";

const TableComponent = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { CurrentPage, AgencyData, searchedVal } = useAppSelector(systemData);

  const [currentData, setCurrentData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const openModalEdit = (type: boolean, agentDetail: any) => {
    dispatch(
      setOpenModal({
        type: "edit",
        open: type,
      })
    );
    dispatch(setDetail(agentDetail));
  };

  const deleteCurrency = (id: string) => {
    try {
      Swal.fire({
        title: "คุณต้องการลบข้อมูลหรือไม่",
        text: "กรณีลบ Orderทีมีอยู่จะคงไว้ แต่ ไม่สามารถเลิกใช้งานได้",
        showCancelButton: true,
        confirmButtonText: `ลบ`,
        cancelButtonText: `ยกเลิก`,
        icon: "warning",
        confirmButtonColor: "#FF5C5C",
        cancelButtonColor: "#6C9AB5",
      })
        .then(async (result) => {
          if (result.isConfirmed) {
            const deleteAgent: {
              statusCode: number;
              message: string;
            } = await DeleteCurrency(id);

            if (deleteAgent.statusCode == 200) {
              dispatch(
                setOpenToast({
                  type: "success",
                  message: "ลบข้อมูลสำเร็จ",
                })
              );

              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err: any) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    console.log("AgencyData", AgencyData);
    setCurrentData(AgencyData);
  }, [AgencyData]);

  return (
    <>
      <div className="container mx-auto px-5 ">
        <div
          className="bg-white   rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
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
                            ชื่อสกุลเงิน
                          </Table.Td>
                          <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                            อัตราเงินราคา
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">
                            วันที่สร้าง
                          </Table.Td>
                          <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black"></Table.Td>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {currentData
                          .filter(
                            (row: any) =>
                              !searchedVal.length ||
                              row?.currency_name
                                .toString()
                                .toLowerCase()
                                .includes(
                                  searchedVal.toString().toLowerCase()
                                ) ||
                              row?.rate_money
                                .toString()
                                .toLowerCase()
                                .includes(
                                  searchedVal.toString().toLowerCase()
                                )                    
                          )
                          .map((data: any, key: number) => {
                            return (
                              <>
                                <Table.Tr className="text-sm text-black  ">
                                  <Table.Td>
                                    <div className="flex justify-center">
                                      {key + 1}
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-center">
                                      {data.currency_name}
                                    </div>
                                  </Table.Td>

                                  <Table.Td>
                                    <div className="flex justify-center">
                                      {data.rate_money}
                                    </div>
                                  </Table.Td>

                                  <Table.Td>
                                    <div className="flex justify-center">
                                      {moment(data.createdAt).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </Table.Td>

                                  <Table.Td className="text-center   border-slate-200/60  text-gray-900">
                                    <div className="flex">
                                      <button
                                        onClick={() => {
                                          openModalEdit(true, data);
                                        }}
                                        style={{
                                          background: "#C8D9E3",
                                        }}
                                        className=" hover:bg-blue-500 w-8 h-8 rounded-lg mr-1"
                                      >
                                        <Lucide
                                          color="#6C9AB5"
                                          icon="Pencil"
                                          className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                        ></Lucide>
                                      </button>
                                      <button
                                        className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg"
                                        onClick={() => {
                                          deleteCurrency(data.id);
                                        }}
                                      >
                                        <Lucide
                                          color="#FF5C5C"
                                          icon="Trash"
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
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(CurrentPage - 1)}
                        disabled={CurrentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        {/* Previous Icon (replace with your preferred icon library) */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      {[...Array(totalPage)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={CurrentPage === pageNumber}
                            className={`relative inline-flex items-center px-4 py-2    text-sm font-medium ${
                              CurrentPage === pageNumber
                                ? "text-primary-600 bg-gray-400 rounded-lg"
                                : "text-gray-700"
                            } hover:bg-gray-50 disabled:opacity-50`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(CurrentPage + 1)}
                        disabled={CurrentPage === totalPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md   text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        {/* Next Icon (replace with your preferred icon library) */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ModalCreateCustomer></ModalCreateCustomer> */}
      </div>
    </>
  );
};

export default TableComponent;
