"use client";
import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {useRouter} from 'next/navigation'
import {
    purchaseData,
    setModalUploadPurchase,
    setModalViewAgentCy
} from '@/stores/purchase'
import { Controller, useForm } from 'react-hook-form';

import moment from "moment/moment";
import { setOpenToast } from '@/stores/util';
import { GetAgentCy } from '../../../services/purchase';
import UploadImageComponent from '../../CS/Content/Prepurchase/upload/UpdateImageComponent';

//service
import { submitAddorderPurchase } from '@/services/purchase'

const ModaluploadPurchase = (props: any) => {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const { purchase, document, modalViewAgentCy } = useAppSelector(purchaseData);
    const [discountPrice, setDiscountPrice] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [groupData, setGroupData] = useState<any>([])
    const [document_type, setDocument_type] = useState<any[]>([])
    const [data, setData] = useState<any>({})
    const { handleSubmit, setValue, control, reset, formState: { errors } } = useForm({

    })


    const setShowModal = (data: boolean) => {
        dispatch(setModalUploadPurchase(data))
    }

    const CheckboxChange = (data: any) => {
        let document = document_type
        if (document.includes(data)) {
            document = document.filter(item => item.key !== data.key)
            setDocument_type(document)
        }
        else {
            setDocument_type([...document_type, data])
        }

    }


    useEffect(() => {
        ;
        const GetAgentCy = props.Agent;
        console.log("agentcy", props)
        setData(GetAgentCy);


        if (GetAgentCy?.d_agentcy_detail?.length > 0) {

            const groupedData = GetAgentCy?.d_agentcy_detail?.reduce((acc: any, item: any) => {
                (acc[item.d_type] = acc[item.d_type] || []).push(item);
                return acc;
            }, {});

            setGroupData(groupedData);



            const totalPrice = GetAgentCy.d_agentcy_detail.reduce(
                (acc: number, item: any) => acc + Number(item.d_net_balance),
                0
            );
            setTotalPrice(totalPrice);

            const discountPrice = GetAgentCy.d_agentcy_detail.reduce(
                (acc: number, item: any) => acc + Number(item.d_discount),
                0 // Initial value for the accumulator
            );
            setDiscountPrice(discountPrice);
        } else {
            // Handle the case where there's no data or an empty array
            setTotalPrice(0);
            setDiscountPrice(0);
        }
    }, [props]);


    const submit = async (data: any) => { // แอด agentcy sale
        try {
            console.log('data', data)
            const data_send: Partial<any> = {
                d_purchase_id: purchase.id,
                d_agentcy_id: props.Agent.id,
                files: data.files,
            }

            const addOrderPurchase: any = await submitAddorderPurchase(data_send)

            if (addOrderPurchase.status === 200) {
                dispatch(setOpenToast({
                    type: "success",
                    message: "บันทึกข้อมูลสำเร็จ",
                }))
                setShowModal(false)
                router.push('/purchase')
            }
            else {
                dispatch(setOpenToast({
                    type: "error",
                    message: "บันทึกข้อมูลไม่สำเร็จ",
                }))
                setShowModal(false)
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }


    function NumberFormat(number: number) {
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    return (
        <>

            <div
                className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-full my-6 mx-auto max-w-2xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h1 className="font-semibold text-2xl">
                                ข้อมูลของ Agency
                            </h1>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => { }}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <form onSubmit={handleSubmit(submit)}>
                            <div className={"p-6"}>
                                <h2 className="font-semibold text-lg">รายละเอียด</h2>
                                <div className="bg-gray-200 p-5 border rounded-md shadow-sm mb-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-black  font-semibold  text-lg">{data?.agentcy?.agent_name}</h2>

                                    </div>

                                    <div className="flex w-full">

                                        <div
                                            className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                                            m
                                        </div>
                                        <div className="flex w-full ">
                                            <div className="flex  w-1/2 flex-col   mb-2">
                                                <p className="text-gray-600 ">สายเรือ: {data.agent_boat}</p>
                                                <p className="text-gray-600 ">TIT: {data.agentcy_tit}</p>
                                            </div>
                                            <div className="flex  w-1/2  flex-col   mb-2">
                                                <p className="text-gray-600w-28 ">ETD:{data.agentcy_etd}</p>
                                                <p className="text-gray-600 truncate">ETA: {data.agentcy_eta}</p>
                                            </div>
                                            {/*<p className="text-gray-600">หมายเหตุ: {res.agentcy_etc}</p>*/}
                                        </div>

                                    </div>

                                </div>
                                <div className="mb-5  ">
                                    <label className="flex mb-1 text-lg font-semibold">รายการทั้งหมด</label>
                                    {Object.entries(groupData).map(([type, items]: any) => (
                                        <Fragment key={type}>

                                            <div key={type} className="p-2 rounded-md shadow-sm mb-2">
                                                <h2 className="text-black  font-semibold  text-lg">{type}</h2>
                                                {items.map((item: any, index: number) => (
                                                    <Fragment key={index}>
                                                        <div className="flex justify-between">
                                                            <p className="text-gray-600">- {item.d_type_text}</p>
                                                            <p className="text-gray-600">{NumberFormat(item.d_net_balance)} {item.d_currency}</p>
                                                        </div>
                                                    </Fragment>
                                                ))}
                                            </div>
                                        </Fragment>
                                    ))}
                                    {/* {data?.d_agentcy_detail?.map((item: any, index: number) => (
                                                
                                                <Fragment key={index}>
                                                    <div className="flex justify-between">
                                                        <p className="text-gray-600">{item.d_type}</p>
                                                        <p className="text-gray-600">{NumberFormat(item.d_net_balance)} {item.d_currency}</p>
                                                    </div>
                                                </Fragment>
                                                 )}
                                            ))} */}
                                    <div className="flex  justify-between">
                                        <p className="mt-2 flex text-lg  font-semibold">
                                            สรุปยอดค่าใช้จ่าย ทั้งหมด
                                        </p>
                                        <p className="mt-2  flex">
                                            ส่วนลด : {discountPrice}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="flex text-gray-600">ทั้งหมด {NumberFormat(totalPrice)}</p>

                                    </div>



                                </div>

                                <hr className="mb-1"></hr>
                                <h2 className="font-semibold text-lg">อัพโหลดใบเสนอราคา</h2>

                                <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                            </div>
                            <div className="flex bg-gray-[#FAFAFA] h-20  mt-5 items-center justify-end  rounded-b">

                                <button
                                    className="bg-white text-[#305D79]  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                // onClick={() => setShowModal(false)}
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="submit"

                                // onClick={() => setShowModal(false)}
                                >
                                    ตกลง
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>


        </>
    );
};

export default ModaluploadPurchase;
