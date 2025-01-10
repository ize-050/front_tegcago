
"use client";

import React, { useState, useEffect, Fragment } from 'react';

//component
import Table from '@/components/Base/Table';

//store
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
    purchaseData,
    setModalViewAgentCy,
    setAgentCyDetail
} from '@/stores/purchase'

//lib


const TablePaymentComponent = () => {
    const [PaymentData, setPaymentData] = useState<any>([])
    const dispatch = useAppDispatch()
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const { purchase } = useAppSelector(purchaseData)
    const [discountPrice, setDiscountPrice] = useState<number>(0)
    useEffect(() => {

        if (purchase.payment_purchase.length > 0) {
            setPaymentData(purchase.payment_purchase)
        }

    }, [purchase])

    

    function NumberFormat(number: number) {
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    return (
        <>
            <div className="flex flex-row  p-2">
                <div className="w-full">
                    <Table>
                        <Table.Thead>
                            <Table.Tr
                                style={{
                                    background: "#FAFAFA",

                                }}
                                className="text-sm font-bold"
                            >
                                <Table.Td
                                    className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                                    หัวข้อ
                                </Table.Td>
                                <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                    รายการ
                                </Table.Td>
                                {/* <Table.Td
                                    className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                    ค่าใช้จ่าย
                                </Table.Td> */}

                                <Table.Td
                                    className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                    สกุลเงิน
                                </Table.Td>

                                {/* <Table.Td
                                    className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                                    ส่วนลด
                                </Table.Td> */}

                                <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                                    ยอดใช้จ่ายจริง
                                </Table.Td>
                                <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                                </Table.Td>
                            </Table.Tr>
                        </Table.Thead>


                        <Table.Tbody>
                            {PaymentData.map((item: any, index: number) => (

                                <Table.Tr key={index}>
                                    <Table.Td className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                                        {item.payment_type}
                                    </Table.Td>
                                    <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                        {item.payment_name}
                                    </Table.Td>
                                    {/* <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                        {item.payment_price}
                                    </Table.Td> */}

                                    <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                        {item.payment_currency}
                                    </Table.Td>

                                    {/* <Table.Td className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                                        {item.payment_discount}
                                    </Table.Td> */}

                                    <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                                        {NumberFormat(item.payment_net_balance)}
                                    </Table.Td>
                                    <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                                    </Table.Td>
                                </Table.Tr>
                            ))}

                        </Table.Tbody>

                    </Table>



                </div>

            </div>
        </>
    )
}

export default TablePaymentComponent