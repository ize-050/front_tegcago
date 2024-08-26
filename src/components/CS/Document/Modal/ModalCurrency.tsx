"use client";


import React, { useEffect, useState } from "react";


//store
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setOpenModal, systemData,setDetail } from "@/stores/system";

//component


//service

import { createCurrency,editCurrency } from '@/services/system/currency'

//form

import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"
import { setOpenToast } from "@/stores/util";


const ModalCurrency = () => {

    const dispatch = useAppDispatch()

    const { detail, modal } = useAppSelector(systemData)

    const methods = useForm()
    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
    } = methods;


    //function

    const onSubmit = async (data: any) => {
        try {
            if (modal.type === "create") {
                const submit = await createCurrency(data)

                if (submit.statusCode == 200) {
                    dispatch(setOpenToast({
                        type: "success",
                        message: submit.message
                    })
                    )
                    dispatch(setOpenModal(false))

                    setTimeout(() => {
                        location.reload()
                    }, 2000)
                }

            } else {
                const submit = await editCurrency(data,detail.id)

                if (submit.statusCode == 200) {
                    dispatch(setOpenToast({
                        type: "success",
                        message: submit.message
                    })
                    )
                    dispatch(setOpenModal(false))

                    setTimeout(() => {
                        location.reload()
                    }, 2000)
                }

            }
        }
        catch (err: any) {
            dispatch(setOpenToast({
                type: "error",
                message: "เกิดข้อผิดพลาด"
            }))
        };
    }
    return (
        <>
            <div className="fixed inset-0 z-50  overflow-x-auto  flex items-center justify-center bg-black bg-opacity-60">

                <div className="relative w-full my-6 mx-auto max-w-lg">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-1xl font-semibold text-black">
                                ข้อมูล
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => {
                                    dispatch(setOpenModal(false))
                                }}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="relative p-6 flex-auto text-black">

                                <div className="mb-5 ">
                                    <label className="flex mb-1 text-gray-600 font-semibold">ชื่อสกุลเงิน
                                        <div className="text-red-500">
                                            *
                                        </div></label>
                                    <Controller
                                        name="currency_name"
                                        control={control}
                                        defaultValue={detail.currency_name}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <input
                                                placeholder='กรุณากรอกข้อมูล'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                type="text" className={`
                                            ${errors.currency_name ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                        )}

                                    />
                                    {errors.currency_name && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                </div>
                                <div className="mb-5">
                                    <label className="flex mb-1 text-gray-600 font-semibold">เรทราคา
                                        <div className="text-red-500">
                                            *
                                        </div></label>
                                    <Controller
                                        name="rate_money"
                                        control={control}
                                        defaultValue={detail.rate_money}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <input
                                                placeholder='กรุณากรอกข้อมูล'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                type="text" className={`
                                            ${errors.rate_money ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                        )}

                                    />
                                    {errors.rate_money && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                </div>
                           
                            </div>

                            {/*footer*/}
                            <div className="flex items-center justify-end  rounded-b">
                                <button
                                    style={{
                                        border: '1px solid #417CA0',
                                        color: "#305D79",
                                        marginRight: '5px'
                                    }}
                                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => {
                                        dispatch(setOpenModal(false))
                                        dispatch(setDetail({}))
                                    }}
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
                </div>
            </div>
        </>
    )
}

export default ModalCurrency