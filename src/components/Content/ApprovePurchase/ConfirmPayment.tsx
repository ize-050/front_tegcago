"use client";

import React, { useState } from 'react';


//component
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";


const ConfirmPayment = ({
    setValue,
    control
}: {
    setValue: any,
    control: any
}) => {
    return (
        <>
            <div className="p-5 flex flex-col">
                <div className="flex">
                    <div className="flex-1 w-50">
                        <h1 className="mb-5  text-2xl font-semibold">ยอดชำระเงิน</h1>
                    </div>

                    <div className=" justify-end">
                        <Button className="bg-[#273A6F] w-full h-10  text-white">
                            <Lucide icon="Plus"  className="mr-2" />
                            เพิ่ม</Button>
                    </div>

                </div>
                <Table className="border-b border-gray-100">
                    <Table.Thead>
                        <Table.Tr
                            style={{
                                background: "#FAFAFA",

                            }}
                            className="text-sm font-bold"
                        >
                            <Table.Td
                                className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                                No
                            </Table.Td>
                            <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                                หัวข้อการชำระเงิน
                            </Table.Td>
                            <Table.Td
                                className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                                ยอดเงิน
                            </Table.Td>

                            <Table.Td
                                className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                                สกุลเงิน
                            </Table.Td>
                            <Table.Td className="py-4  truncate font-medium text-center border-t  border-slate-200/60 text-black">
                                อัตราการแลกเปลี่ยน
                            </Table.Td>
                            <Table.Td
                                className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                                หลักฐานการชำระเงิน
                            </Table.Td>

                            <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                                รูปภาพ
                            </Table.Td>
                            <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                            </Table.Td>
                        </Table.Tr>
                    </Table.Thead>


                </Table>
            </div>

        </>
    )
}


export default ConfirmPayment