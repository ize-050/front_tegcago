"use client";
import { Fragment } from "react";
import React, { useState, useEffect } from "react";

//lib
import moment from "moment";

import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";

//store
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  purchaseData,
  setModalViewAgentCy,
  setAgentCyDetail,
} from "@/stores/purchase";

//component
import PaymentComponent from "./PaymentComponent";

//router
import { useRouter } from "next/navigation";

//service
import { Submitpayment } from "@/services/purchase";
import { setOpenToast } from "@/stores/util";
import router from "next/navigation";

const ApproveComponent = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { purchase } = useAppSelector(purchaseData);

  const [data, setData] = useState<Partial<any>>({});

  const methods = useForm();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;

  useEffect(() => {
    setData(purchase);
  }, [purchase]);

  const submit = async (data: any) => {
    try {
      let RequestData = {
        ...data,
        d_purchase_id: purchase.id,
      };

      const submitpayment: any = await Submitpayment(RequestData);
      if (submitpayment.status === 200) {
        console.log("submitpayment", submitpayment);
        await dispatch(
          setOpenToast({
            type: "success",
            message: "บันทึกข้อมูลสำเร็จ",
          })
        );
        await setTimeout(() => {
          location.reload();
        }, 2000);
        router.push('/purchase')
      }
    } catch (e: any) {
      dispatch(
        setOpenToast({
          type: "error",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        })
      );
      throw new Error(e);
    }
  };
  return (
    <Fragment>
      <div className="mx-auto  text-black">
        <div className="p-5 flex">
          <div className="flex-1 w-50">
            <h1 className="mb-5  text-2xl font-semibold">ข้อมูล ใบเสนอราคา</h1>
          </div>
        </div>

        <div className="p-5  flex  flex-col  md:flex-row  mt-5">
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
              เลขตีราคา
            </label>
            <p>{data?.book_number}</p>
          </div>
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
              ชื่อเซลล์
            </label>
            {data.d_purchase_emp?.length > 0 && (
              <p>{data.d_purchase_emp[0].user.fullname}</p>
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col">
            <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
              วันที่/เวลา
            </label>
            <p>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")} </p>
          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>
        <div className="p-5">
          <h2 className=" mb-5  text-2xl font-semibold">ข้อมูลการขนส่ง</h2>
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
        </div>

        <hr className="mb-5 mt-5"></hr>
        <form onSubmit={handleSubmit(submit)}>
          <PaymentComponent
            setValue={setValue}
            control={control}
          ></PaymentComponent>

          <hr className="mb-5 mt-5"></hr>

          <div className="flex items-center justify-end  rounded-b">
            <button
              style={{
                border: "1px solid #417CA0",
                color: "#305D79",
                marginRight: "5px",
              }}
              className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              ยกเลิก
            </button>
            <button
              className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="submit"
              // onClick={() => setShowModal(false)}
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ApproveComponent;
