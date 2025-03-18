import React, { useEffect } from 'react';
import { Controller } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from "@/utils/numberFormat";

const ChineseExpenseForm: React.FC<ExpenseFormProps> = ({ control, errors, watch, setValue }) => {
    const ch_freight = watch('ch_freight') || 0;
    const ch_exchange_rate = watch('ch_exchange_rate') || 0;
    const ch_freight_total = Number(ch_freight) * Number(ch_exchange_rate);

    useEffect(() => {
        setValue('ch_freight_total', ch_freight_total);
    }, [ch_freight_total, setValue]);

    return (
        <>
            <h1 className="mb-5 text-1xl font-bold">ค่าใช้จ่ายฝั่งจีน</h1>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าขนส่งจีน (หยวน)
                    </label>
                    <Controller
                        name="ch_freight"
                        control={control}
                        // defaultValue={0}
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
                                    onChange(e.target.value);
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.ch_freight ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.ch_freight && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อัตราแลกเปลี่ยน
                    </label>
                    <Controller
                        name="ch_exchange_rate"
                        control={control}
                        defaultValue={0}
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="number"
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : e.target.value;
                                    onChange(value);
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.ch_exchange_rate ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.ch_exchange_rate && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายฝั่งจีน
                    </label>
                    <Controller
                        name="ch_freight_total"
                        control={control}
                        defaultValue={0}
                        render={({ field: { value } }) => (
                            <input
                                type="text"
                                value={numberFormatTh(ch_freight_total)}
                                readOnly
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base bg-gray-100"
                            />
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default ChineseExpenseForm;