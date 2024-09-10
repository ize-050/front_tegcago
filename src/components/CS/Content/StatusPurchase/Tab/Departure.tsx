"use client";

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import { statusOrderData, setEditForm } from "@/stores/statusOrder"


import { useRouter } from "next/navigation";
import {
    Controller,
    FormProvider,
    useForm
} from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";

const DepartureComponent = ({ purchase }: {
    purchase: any
}) => {

    const methods = useForm()

    const { status } = useAppSelector(statusOrderData)

    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        getFieldState,
        setError,
        control,
        watch,
    } = methods;

    const dispatch = useAppDispatch()
    const router = useRouter()

    const [dataStatus, setStatus] = useState<Partial<any>>({
        type: "view"
    })

    const [data, setData] = useState<any>({})

    useEffect(() => {
        setStatus(status)
    }, [status])

    const onSubmit = async (data: any) => {
        console.log(data)
    }


    useEffect(() => {
        console.log("purchasesss", purchase)
    }, [purchase])

    const PurchaseData = useMemo(() => {
        return purchase
    }, [purchase])


    const changeEdit = (value: boolean) => {
        if (value) {
            dispatch(setEditForm("edit"))
        }
        else {
            dispatch(setEditForm("view"))
        }
    }



    return (
        <Fragment>
            <div>
                <div className="mx-auto text-black">
                    <div className="flex bg-gray-50">
                        <div className=" flex-1 w-50  px-5  rounded-md">
                            <h1 className="mb-5  text-1xl font-semibold">รายละเอียดการออกเดินทาง</h1>
                        </div>
                        <div className="flex-end justify-center mt-1">
                            <Button
                                onClick={() => changeEdit(true)}
                                // onClick={() => changeEdit(!formEditcustomer)}
                                style={{
                                    background: "#C8D9E3",
                                    color: "#417CA0",
                                    width: "119px",
                                    height: "36px"
                                }}
                                className="flex hover:bg-blue-700   mr-1"
                            >
                                <Lucide
                                    color="#6C9AB5"
                                    icon="Pencil"
                                    className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
                                ></Lucide>
                                <p
                                    className="text-[#417CA0] text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"
                                >
                                    แก้ไขข้อมูล
                                </p>
                            </Button>
                        </div>
                    </div>
                </div>

                <FormProvider  {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                 วันที่ H B/L *
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_hbl"
                                            control={control}
                                            defaultValue={data?.date_hbl}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.date_hbl ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.date_hbl && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.date_hbl}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">อัพโหลดเอกสาร</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_hbl"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                วันที่ Original F/E * 
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_original_fe"
                                            control={control}
                                            defaultValue={data?.date_original_fe}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.date_original_fe ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.date_original_fe && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.date_original_fe}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">อัพโหลดเอกสาร</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_original_fe"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>



                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                    วันที่ Surrender *
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_surrender"
                                            control={control}
                                            defaultValue={data?.date_surrender}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.date_surrender ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.date_surrender && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.date_surrender}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">อัพโหลดเอกสาร</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_surrender"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                วันที่ Enter Doc
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_enter_doc"
                                            control={control}
                                            defaultValue={data?.date_enter_doc}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.date_enter_doc ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.date_enter_doc && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.booking_date}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">อัพโหลดเอกสาร</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_enter_doc"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                วันที่ Payment D/O *
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_payment_do"
                                            control={control}
                                            defaultValue={data?.date_payment_do}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${data.date_payment_do ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {data.date_payment_do && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.date_payment_do}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">อัพโหลดเอกสาร</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_payment_do"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">
                                ยอด Payment D/O *
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="amount_payment_do"
                                            control={control}
                                            defaultValue={data?.amount_payment_do}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0.00'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.amount_payment_do ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.amount_payment_do && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.amount_payment_do}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">ไฟล์แนบสลิป</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent 
                                            name="file_amount_payment_do"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </>
                                        : <p>{dataStatus?.booking_date}</p>}
                                </div>
                            </div>
                        </div>


                      




                        {dataStatus.type !== "view" &&
                            <div className="flex items-center justify-end  rounded-b">
                                <button
                                    style={{
                                        border: '1px solid #417CA0',
                                        color: "#305D79",
                                        marginRight: '10px'
                                    }}
                                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => changeEdit(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg   mr-1 mb-1 "
                                    type="submit"
                                // onClick={() => setShowModal(false)}
                                >
                                    บันทึก
                                </button>
                            </div>
                        }
                    </form>
                </FormProvider>


            </div>
        </Fragment>
    )
}


export default DepartureComponent

