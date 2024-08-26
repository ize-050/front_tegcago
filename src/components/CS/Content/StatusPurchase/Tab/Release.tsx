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
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";


const ReleaseComponent = ({ purchase }: {
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
                            <h1 className="mb-5  text-1xl font-semibold">รายละเอียดการรอตรวจปล่อย</h1>
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
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Demurrage (DEM) Free time </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0 Days'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Demurrage (DEM) Date</label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='เลือก'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}

                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Detention (DET) Free time </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0 Days'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Detention (DET) Date </label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='เลือก'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}

                            </div>
                        </div>

                        <div className="flex">

                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Terminal ปล่อยตรวจ</label>


                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">วันที่จะตรวจปล่อย (Planing) </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0 Days'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">วันที่รับตู้ออกจากท่าเรือ (Planing) </label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='เลือก'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}

                            </div>
                        </div>



                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">บริษัทรถ</label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <select
                                                    onChange={onChange}
                                                    value={value}
                                                    className="border w-full border-gray-200 p-2 rounded-md"
                                                >
                                                    <option value="">เลือก</option>
                                                    <option value="ABC">ABC</option>
                                                    <option value="BCD">BCD</option>
                                                </select>
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">ประเภทรถ </label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <select
                                                    onChange={onChange}
                                                    value={value}
                                                    className="border w-full border-gray-200 p-2 rounded-md"
                                                >
                                                    <option value="">เลือก</option>
                                                    <option value="รถยนต์">รถยนต์</option>
                                                    <option value="รถตู้">รถตู้</option>
                                                    <option value="รถบรรทุก">รถบรรทุก</option>
                                                    <option value="เรือ">เรือ</option>
                                                </select>
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}

                            </div>
                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">สถานที่แลกการ์ดรับตู้</label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="booking_date"
                                            control={control}
                                            defaultValue={dataStatus?.booking_date}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0 Days'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                            <div className="w-1/2">
                                <div className="p-5">
                                    <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">ไฟล์แนบแลกการ์ดรับตู้</label>

                                    {dataStatus.type !== "view" ?
                                        <>
                                            <UploadImageComponent
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


export default ReleaseComponent
