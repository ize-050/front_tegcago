import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from "@/utils/numberFormat";

const DOExpenseForm: React.FC<ExpenseFormProps> = () => {
    const { control, formState: { errors }, setValue, watch } = useFormContext();

    // ตรวจสอบค่าที่ได้รับจาก API
    React.useEffect(() => {
        console.log("amount_payment_do value:", watch('amount_payment_do'));
        console.log("price_deposit value:", watch('price_deposit'));
    }, [watch]);

    return (
        <>
            <h1 className="mb-5 text-1xl font-bold">ค่าแลก D/O</h1>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าแลก D/O
                    </label>
                    <Controller
                        name="amount_payment_do"
                        control={control}
                        defaultValue={0}
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="number"
                                onChange={(e) => {
                                    const newValue = e.target.value === '' ? '' : e.target.value;
                                    onChange(newValue);
                                    setValue('amount_payment_do', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.amount_payment_do ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.amount_payment_do && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        มัดจำตู้
                    </label>
                    <Controller
                        name="price_deposit"
                        control={control}
                        defaultValue={0}
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                onChange={(e) => {
                                    const newValue = e.target.value === '' ? '' : e.target.value;
                                    onChange(newValue);
                                    setValue('price_deposit', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.price_deposit ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.price_deposit && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

               
            </div>

            {/* <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        วันที่คืนตู้
                    </label>
                    <Controller
                        name="date_return_cabinet"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="date"
                                onChange={onChange}
                                value={value || ''}
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าคืนตู้
                    </label>
                    <Controller
                        name="price_return_cabinet"
                        control={control}
                        defaultValue={0}
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                onChange={(e) => {
                                    const newValue = e.target.value === '' ? '' : e.target.value;
                                    onChange(newValue);
                                    setValue('price_return_cabinet', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value === 0 ? '' : value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.price_return_cabinet ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.price_return_cabinet && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div> */}
        </>
    );
};

export default DOExpenseForm;
