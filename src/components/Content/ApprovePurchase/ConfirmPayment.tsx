"use client";

import React, { Fragment, use, useEffect, useRef, useState } from 'react';


//component
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { Controller } from 'react-hook-form';
import { Upload } from 'lucide-react';
import UploadImageComponent from '@/components/Uploadimage/UpdateImageComponent';

//store
import { useAppSelector } from "@/stores/hooks";
import { purchaseData } from "@/stores/purchase";
import { set } from 'lodash';
import ModalPreviewImage from '../Prepurchase/upload/ModalPreview';


const ConfirmPayment = ({
    setValue,
    control
}: {
    setValue: any,
    control: any
}) => {
    const [PaymentData, setPaymentData] = useState<any>([])

    const { purchase } = useAppSelector(purchaseData)


    useEffect(() => {
        if (purchase.d_purchase_customer_payment.length > 0) {
            console.log("purchase.d_purchase_customer_payment", purchase.d_purchase_customer_payment)
            for (let num = 0; num < purchase.d_purchase_customer_payment.length; num++) {
                console.log("ssssdd")
                setPaymentData((prevPaymentData:any)=> [
                    ...prevPaymentData,
                    {
                      type_payment: purchase.d_purchase_customer_payment[num].payment_name,
                      price: purchase.d_purchase_customer_payment[num].payment_type,
                      currency: purchase.d_purchase_customer_payment[num].payment_price,
                    },
                  ]);
                setValue(`type[${num}].type_payment`, purchase.d_purchase_customer_payment[num].payment_name);
                setValue(`type[${num}].currency`, purchase.d_purchase_customer_payment[num].payment_type);
                setValue(`type[${num}].price`, purchase.d_purchase_customer_payment[num].payment_price);
                setValue(`type[${num}].change`, false);
                setValue(`type[${num}].image`, null);
                setPreviewUrls((prevUrls:any) => ({
                    ...prevUrls,
                    [num]: process.env.NEXT_PUBLIC_URL_API + purchase.d_purchase_customer_payment[num].payment_path,
                  }));
            }
        }
    }, [purchase])

    const handleFileChange = (event: any, index: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls({ ...previewUrls, [index]: reader.result }); // Update preview URL for the specific row
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrls({ ...previewUrls, [index]: null }); 
        }
    };

    useEffect(() => {
        console.log("PaymentData",PaymentData)  
    },[PaymentData])

    const OpenRow = () => {
        setPaymentData([...PaymentData, {
            type_payment: '',
            price: 0,
            currency: "THB",
            change:true,
            image: null
        }])

        const newIndex = PaymentData.length;
        setValue(`type[${newIndex}].type_payment`, ''); 
        setValue(`type[${newIndex}].price`, 0); 
        setValue(`type[${newIndex}].currency`, 'THB'); 
        setValue(`type[${newIndex}].change`, true);
       

    }

    const [previewUrls, setPreviewUrls] = useState<any>({});

    const handleButtonClick = (index: any) => {
        // Trigger the file input for the specific row
        const fileInput = document.getElementById(`fileInput-${index}`);
        if (fileInput) {
            fileInput.click();
        }
    };

   

    return (
        <>
            <div className="p-5 flex flex-col">
                <div className="flex">
                    <div className="flex-1 w-50">
                        <h1 className="mb-5  text-2xl font-semibold">ยอดชำระเงิน</h1>
                    </div>

                    <div className=" justify-end">
                        <Button
                            type="button"
                            className="bg-[#273A6F] w-full h-10  text-white"
                            onClick={() => {
                                OpenRow();
                            }}>

                            <Lucide icon="Plus" className="mr-2" />
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

                            <Table.Td
                                className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                                หลักฐานการชำระเงิน
                            </Table.Td>

                            <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                                รูปภาพ
                            </Table.Td>

                        </Table.Tr>
                    </Table.Thead>


                    <Table.Tbody>
                        {PaymentData.map((item: any, index: number) => (
                            <Fragment key={index}>
                                <Table.Tr>

                                    <Table.Td className="text-center">
                                        {index + 1}
                                    </Table.Td>
                                    <Table.Td className="text-center ">
                                        <Controller
                                            name={`type[${index}].type_payment`}
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <>
                                                    <select

                                                        onChange={onChange}
                                                        value={value}
                                                        className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                        <option value="">เลือกประเภท</option>
                                                        <option value="ชำระบางส่วน">ชำระบางส่วน</option>
                                                        <option value="ชำระเต็มจำนวน">ชำระเต็มจำนวน</option>
                                                        <option value="CreditTerm">CreditTerm</option>
                                                    </select>
                                                </>
                                            )} />
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <Controller
                                            name={`type[${index}].price`}
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <>
                                                    <input
                                                        onChange={onChange}
                                                        value={value}
                                                        type="text" className="border text-center border-gray-200 p-2 rounded-md"></input>
                                                </>
                                            )} />
                                    </Table.Td>


                                    <Table.Td className="text-center">
                                        <Controller
                                            name={`type[${index}].currency`}
                                            control={control}
                                            rules={{ required: false }}
                                            defaultValue={"THB"}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <>
                                                    <select
                                                        onChange={(e: any) => {
                                                            onChange(e.target.value)
                                                        }}
                                                        value={value}
                                                        className=" text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  ">
                                                        <option value="THB" selected>THB</option>
                                                        <option value="RMB">RMB</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                    </select>
                                                </>
                                            )} />
                                    </Table.Td>




                                    <Table.Td className="text-center">
                                        <Controller
                                            name={`type[${index}].image`}
                                            control={control}
                                            rules={{ required: false }}
                                            defaultValue={null}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <>
                                                    <input
                                                        type="file"
                                                        // value={value}
                                                        id={`fileInput-${index}`} // Unique ID for each file input
                                                        style={{ display: 'none' }}
                                                        onChange={(event) => {
                                                            handleFileChange(event, index);
                                                            const file = event.target.files && event.target.files[0];
                                                            console.log("file", file);
                                                            onChange(file);
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        id={`customButton-${index}`} onClick={() => handleButtonClick(index)}>
                                                        เพิ่มรูปภาพ
                                                    </Button>
                                                </>
                                            )}
                                        />
                                    </Table.Td>



                                    <Table.Td className="text-center">
                                        {previewUrls[index] && (
                                            <img src={previewUrls[index]} alt="Preview" className="w-20 h-20"
                                             onClick={() => {


                                                
                                             }}
                                            />
                                        )}
                                    </Table.Td>




                                </Table.Tr>
                            </Fragment>

                        ))}

                    </Table.Tbody>


                </Table>
                
              


            </div>

        </>
    )
}


export default ConfirmPayment