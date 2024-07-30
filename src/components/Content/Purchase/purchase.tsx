import React, { Fragment, useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { customerData } from '@/stores/customer'
import Image from 'next/image'
import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"
import { useRouter } from 'next/navigation'
import {
    purchaseData,
    setModalViewAgentCy,
    setAgentCyDetail
} from '@/stores/purchase'
import ModalViewAgentCy from "@/components/Agent/ModalViewAgentCy";


const Purchase = () => {

    const dispatch = useAppDispatch()
    const { customer_detail } = useAppSelector(customerData)
    const { purchase } = useAppSelector(purchaseData)

    const [data, setData] = useState<Partial<any>>({})
    const router = useRouter()
    useEffect(() => {
        setData(purchase)
    }, [purchase])

    const UpdateAgentcy = () => {

    }

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
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">เลขตีราคา</label>
                        <p>{data?.book_number}</p>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ชื่อเซลล์</label>
                        {data.d_purchase_emp?.length > 0 &&
                            <p>{data.d_purchase_emp[0].user.fullname}</p>
                        }

                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">วันที่/เวลา</label>
                        <p>{data.createdAt} </p>
                    </div>
                </div>


                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2  text-gray-500  text-sm">invoice & Packinglist No. </label>
                        <p>{data?.customer_number}</p>
                    </div>
                </div>


                <hr className="mb-5 mt-5"></hr>
                <h2 className="mb-5  text-2xl">ข้อมูลการขนส่ง</h2>
                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Port ต้นทาง</label>
                        <p>{data?.d_origin}</p>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Port ปลายทาง</label>
                        <p>{data?.d_destination}</p>
                    </div>

                </div>

                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-2/4 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ขนาดตู้</label>
                            <p>{data?.d_size}</p>
                        </div>
                        <div className="w-full md:w-2/4  flex flex-col">
                            <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">น้ำหนัก</label>
                            <p>{data?.d_weight}</p>
                        </div>

                    </div>
                    <div className="w-full md:w-1/2  flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">บริการหัวรถลาก</label>
                        <p>{data?.d_truck}</p>
                    </div>
                </div>


                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ที่อยู่ต้นทาง</label>
                        <p>{data?.d_address_origin}</p>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">ที่อยู่ปลายทาง </label>
                        <p>{data?.d_address_destination}</p>
                    </div>
                </div>


                <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">Refund Tax ต้นทาง</label>
                        <p>{data?.d_refund_tag}</p>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-500  text-sm font-semibold">หมายเหตุ </label>

                        <p>{data?.d_etc}</p>
                    </div>
                </div>

                <hr className="mb-5 mt-5"></hr>
                <h2 className="mb-5  text-2xl">ข้อมูลของ Agency</h2>

                {data?.d_agentcy?.length > 0 ? (
                    <>
                        {data.d_agentcy.map((res: any, index: number) => (
                            <Fragment key={index}>
                                <div className="bg-gray-200 p-5 border rounded-md shadow-sm mb-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-black  font-semibold  text-lg">{res.agentcy.agent_name}</h2>
                                        <button type="button"
                                            onClick={() => {
                                                dispatch(setModalViewAgentCy(true))
                                                dispatch(setAgentCyDetail(res))
                                            }}
                                            className="text-blue-500 items-end underline">รายละเอียด</button>
                                    </div>

                                    <div className="flex w-full">
                                        <div className="flex items-center">
                                            <input type="radio" id="myRadio"
                                                name="myRadio"
                                                onClick={() => {

                                                }}
                                                className="w-4 h-4 accent-blue-500 mr-2" />

                                        </div>
                                        <div
                                            className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                                            m
                                        </div>
                                        <div className="flex  w-2/4">
                                            <div className="flex w-1/4 flex-col  items-center mb-2">
                                                <p className="text-gray-600 ">สายเรือ: {res.agent_boat}</p>
                                                <p className="text-gray-600 ">TIT: {res.agentcy_tit}</p>
                                            </div>
                                            <div className="flex  w-1/4 flex-col  items-center mb-2">
                                                <p className="text-gray-600w-28 ">ETD:{res.agentcy_etd}</p>
                                                <p className="text-gray-600 truncate">ETA: {res.agentcy_eta}</p>
                                            </div>
                                            {/*<p className="text-gray-600">หมายเหตุ: {res.agentcy_etc}</p>*/}
                                        </div>

                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-gray-600">ยอดค่าใช้จ่ายจริง</p>
                                        <p className="text-xl font-bold">{res?.d_agentcy_detail?.reduce(
                                            (accumulator: number, item: any) => accumulator + Number(item.d_net_balance),
                                            0 // Initial value for the accumulator
                                        )} ฿</p>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                        <div className="flex items-center justify-end  rounded-b">
                            <button
                                style={{
                                    border: '1px solid #417CA0',
                                    color: "#305D79",
                                    marginRight: '5px'
                                }}
                                className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => router.push('/cs/purchase')}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => UpdateAgentcy()}
                            >
                                บันทึก
                            </button>
                        </div>
                    </>

                )
                    : (
                        <>
                            <div className="flex text-center justify-center mx-auto">
                                <Image src="/agency.png" width={150} height={150} alt="Agency" />
                            </div>
                            <p className="text-center text-[#949494]">ยังไม่มี Agency <br />อยุ่ระหว่าง CS ดำเนินการ</p>
                        </>
                    )}

                <ModalViewAgentCy></ModalViewAgentCy>
            </div>

        </>
    )
}

export default Purchase