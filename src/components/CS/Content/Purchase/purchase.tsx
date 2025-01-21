"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { customerData } from "@/stores/customer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import {
  purchaseData,
  updateAgencytoSale,
  setModalAgentcy,
  setModalViewAgentCy,
  setAgentCyDetail,
  setModalEditAgentCy,
} from "@/stores/purchase";
import moment from "moment/moment";
import Button from "@/components/Base/Button";
import ModalAddAgentcy from "@/components/CS/Content/Modal/ModalAddAgentcy";
import { list } from "postcss";
import ModalViewAgentCy from "@/components/Agent/ModalViewAgentCy";

import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Swal from "sweetalert2";
import PaymentComponent from "../Payment/PaymentComponent";
import { EditIcon } from "lucide-react";
import ModalEditAgentCy from "@/components/Agent/ModaleditAgentCy";

const Purchase = () => {
  const dispatch = useAppDispatch();
  const { purchase, modalAgentcy } = useAppSelector(purchaseData);
  const router = useRouter();
  const [data, setData] = useState<Partial<any>>({});
  const [listCheck, setListCheck] = useState<any>([]);
  const [Agentdetail, setChagneAgent] = useState<boolean>(false);

  useEffect(() => {
    console.log("purchaseDetail", purchase);
    setData(purchase);
  }, [purchase]);

  const AddAgentcy = () => {
    dispatch(setModalAgentcy(true));
  };

  const changeAgentCy = (modal: boolean) => {
    setChagneAgent(modal);
  };

  const setCheckId = (res: any) => {
    console.log("res", res);
    listCheck.find((item: any) => item.id === res.id)
      ? setListCheck(listCheck.filter((item: any) => item.id !== res.id))
      : setListCheck([...listCheck, res]);
  };

  useEffect(() => {
    if (data.d_sale_agentcy?.length > 0) {
      setChagneAgent(true);
    }
  }, [data]);

  const UpdateAgentcy = () => {
    if (listCheck.length > 0) {
      dispatch(updateAgencytoSale(listCheck));

      router.push(`/cs/purchase/content/${data.id}`);
    } else {
      Swal.fire({
        icon: "info",
        title: "กรุณาเลือก Agentcy",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <>
      <div className="p-5 mx-auto  text-black">
        <div className="flex">
          <div className="flex-1 w-50">
            <h1 className="mb-5  text-2xl">ข้อมูลใบเสนอราคา</h1>
          </div>
        </div>
        <div className=" flex  flex-col  md:flex-row  mt-5">
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              เลขตีราคา
            </label>
            <p>{data?.book_number}</p>
          </div>
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              ชื่อเซลล์
            </label>
            {data?.d_purchase_emp?.length > 0 && (
              <p>{data?.d_purchase_emp[0].user.fullname}</p>
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              วันที่/เวลา
            </label>
            <p> {moment(data?.created_at).format("DD/MM/YYYY HH:mm")}</p>
          </div>
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm">
              invoice & Packinglist No.{" "}
            </label>

            <p>{data?.customer_number}</p>
          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>
        <h2 className="mb-5  text-2xl">ข้อมูลการขนส่ง</h2>
        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              Port ต้นทาง
            </label>
            <p>{data?.d_origin}</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              Port ปลายทาง
            </label>
            <p>{data?.d_destination}</p>
          </div>
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
          <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-2/4 flex flex-col">
              <label className="block mb-2  text-gray-500  text-sm font-semibold">
                ขนาดตู้
              </label>
              <p>{data?.d_size_cabinet}</p>
            </div>
            <div className="w-full md:w-2/4  flex flex-col">
              <label className="block mb-2  text-gray-500  text-sm font-semibold">
                น้ำหนัก
              </label>
              <p>{data?.d_weight}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2  flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              บริการหัวรถลาก
            </label>
            <p>{data?.d_truck}</p>
          </div>
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              ที่อยู่ต้นทาง
            </label>
            <p>{data?.d_address_origin}</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              ที่อยู่ปลายทาง{" "}
            </label>
            <p>{data?.d_address_destination}</p>
          </div>
        </div>

        <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              Refund Tax ต้นทาง
            </label>
            <p>{data?.d_refund_tag}</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              หมายเหตุ{" "}
            </label>

            <p>{data?.d_etc}</p>
          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>
        <div className="flex flex-row ">
          <h2 className="flex-1 w-1/2 mb-5  justify-start text-2xl">
            ข้อมูลของ Agency
          </h2>
          <div className="flex flex-end justify-end"></div>
          <div className="flex-1  w-1/2 justify-end text-right right-0">
            {!Agentdetail ? (
              <>
                <Button
                  className="border-[#273A6F]  bg-[#273A6F] mr-5"
                  style={{
                    color: "#FFFFFF",
                  }}
                  onClick={() => {
                    AddAgentcy();
                  }}
                >
                  เพิ่ม Agency
                </Button>
                <Button
                  className="border-[#273A6F]  bg-[#273A6F] mr-5"
                  type="button"
                  style={{
                    color: "#FFFFFF",
                  }}
                  onClick={() => UpdateAgentcy()}
                >
                  ส่ง Agency
                </Button>
                {data.d_sale_agentcy?.length > 0 && (
                  <>
                    <Button
                      className="bg-[#FFFFFF] text-black border-2  border-[#305D79]
                                            font-bold uppercase text-sm px-6 py-2 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 
                                            "
                      type="button"
                      onClick={() => changeAgentCy(true)}
                    >
                      ยกเลิก
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  className="bg-[#FFFFFF] text-[#305D79] border-2  border-[#305D79]  font-bold uppercase text-sm px-6 py-2 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 "
                  type="button"
                  onClick={() => {
                    changeAgentCy(false);
                  }}
                >
                  เปลี่ยน Agentcy
                </Button>
              </>
            )}
          </div>
        </div>
        {data?.d_agentcy?.length > 0 && !Agentdetail ? (
          <>
            {data.d_agentcy.map((res: any, index: number) => (
              <Fragment key={index}>
                <div className="bg-gray-200 p-5 border rounded-md shadow-sm mb-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-black  font-semibold  text-lg">
                      {res.agentcy.agent_name}
                    </h2>
                    <div className="flex space-x-2">
                      {" "}
                      {/* Added flex container for buttons */}
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setModalViewAgentCy(true));
                          dispatch(setAgentCyDetail(res));
                        }}
                        className="text-blue-500 underline"
                      >
                        รายละเอียด
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(setModalEditAgentCy(true));
                          dispatch(setAgentCyDetail(res));
                        }}
                        className="hover:bg-yellow-600 hover:text-white transition-all duration-300 border-2 flex items-center border-yellow-500 text-white bg-yellow-500"
                      >
                        <EditIcon className="w-4 h-4" /> แก้ไข
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full">
                    <div className="flex items-center">
                      {!res.status && (
                        <input
                          type="checkbox"
                          id="myCheckbox"
                          onClick={() => {
                            setCheckId(res);
                          }}
                          className="w-4 h-4 accent-blue-500 mr-2"
                        />
                      )}
                    </div>
                    <div className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                      m
                    </div>
                    <div className="flex  w-2/4">
                      <div className="flex w-1/4 flex-col  items-center mb-2">
                        <p className="text-gray-600 ">
                          สายเรือ: {res.agent_boat}
                        </p>
                        <p className="text-gray-600 ">TIT: {res.agentcy_tit}</p>
                      </div>
                      <div className="flex  w-1/4 flex-col  items-center mb-2">
                        <p className="text-gray-600w-28 ">
                          ETD:{res.agentcy_etd}
                        </p>
                        <p className="text-gray-600 truncate">
                          ETA: {res.agentcy_eta}
                        </p>
                      </div>
                      {/*<p className="text-gray-600">หมายเหตุ: {res.agentcy_etc}</p>*/}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className=" mr-36">
                      <p className="text-gray-600">ผู้จ่าย</p>
                      <p className="text-xl font-bold">
                        {res?.d_agentcy_detail[0].d_typePayer}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-gray-600">ยอดค่าใช้จ่ายจริง</p>
                      <p className="text-xl font-bold">
                        {res?.d_agentcy_detail?.reduce(
                          (accumulator: number, item: any) =>
                            accumulator + Number(item.d_net_balance),
                          0 // Initial value for the accumulator
                        )}{" "}
                        {res?.d_agentcy_detail[0]?.d_currency}
                      </p>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
          </>
        ) : Agentdetail ? (
          <>
            <div className="bg-gray-200 p-5 border rounded-md shadow-sm mb-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-black  font-semibold  text-lg">
                  <p className="text-red-500 ">(*Sales เลือก) </p>{" "}
                  {data?.d_sale_agentcy[0]?.d_agentcy?.agentcy?.agent_name}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setModalViewAgentCy(true));
                    dispatch(
                      setAgentCyDetail(data?.d_sale_agentcy[0]?.d_agentcy)
                    );
                  }}
                  className="text-blue-500 items-end underline"
                >
                  รายละเอียด
                </button>
              </div>

              <div className="flex w-full">
                <div className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                  m
                </div>
                <div className="flex  w-2/4">
                  <div className="flex w-1/4 flex-col  items-center mb-2">
                    <p className="text-gray-600 ">
                      สายเรือ: {data?.d_sale_agentcy[0]?.d_agentcy.agent_boat}
                    </p>
                    <p className="text-gray-600 ">
                      TIT: {data?.d_sale_agentcy[0]?.d_agentcy.agentcy_tit}
                    </p>
                  </div>
                  <div className="flex  w-1/4 flex-col  items-center mb-2">
                    <p className="text-gray-600w-28 ">
                      ETD:{data?.d_sale_agentcy[0]?.d_agentcy.agentcy_etd}
                    </p>
                    <p className="text-gray-600 truncate">
                      ETA: {data?.d_sale_agentcy[0]?.d_agentcy.agentcy_eta}
                    </p>
                  </div>
                  {/*<p className="text-gray-600">หมายเหตุ: {res.agentcy_etc}</p>*/}
                </div>
              </div>

              <div className="flex justify-end">
                <div className=" mr-36">
                  <p className="text-gray-600">ผู้จ่าย</p>
                  <p className="text-xl font-bold">
                    {
                      data?.d_sale_agentcy[0]?.d_agentcy?.d_agentcy_detail[0]
                        ?.d_typePayer
                    }
                  </p>
                </div>
                <div className="">
                  <p className="text-gray-600">ยอดค่าใช้จ่ายจริง</p>
                  <p className="text-xl font-bold">
                    {data?.d_sale_agentcy[0]?.d_agentcy?.d_agentcy_detail?.reduce(
                      (accumulator: number, item: any) =>
                        accumulator + Number(item.d_net_balance),
                      0 // Initial value for the accumulator
                    )}{" "}
                    {data?.d_sale_agentcy[0]?.d_agentcy?.d_agentcy_detail[0]
                      ?.d_currency}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex text-center justify-center mx-auto">
              <Image src="/agency.png" width={150} height={150} alt="Agency" />
            </div>
            <p className="text-center text-[#949494]">
              ยังไม่มี Agency <br />
              อยุ่ระหว่าง CS ดำเนินการ
            </p>
          </>
        )}
      </div>
      {modalAgentcy && <ModalAddAgentcy></ModalAddAgentcy>}
      <PaymentComponent
        id={data.id}
        payment={data.payment_purchase}
      ></PaymentComponent>
      <br></br>
      <ModalViewAgentCy></ModalViewAgentCy>
      <ModalEditAgentCy></ModalEditAgentCy>
    </>
  );
};

export default Purchase;
