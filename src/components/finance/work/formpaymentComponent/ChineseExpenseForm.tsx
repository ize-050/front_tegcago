import React, { useEffect } from 'react';
import { Controller } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from "@/utils/numberFormat";

const ChineseExpenseForm: React.FC<ExpenseFormProps> = ({ control, errors, watch, setValue }) => {
    const ch_freight = watch('ch_freight') || '';
    const ch_exchange_rate = watch('ch_exchange_rate') || '';
    const ch_freight_total = (ch_freight && ch_exchange_rate) ? Number(ch_freight) * Number(ch_exchange_rate) : 0;

    useEffect(() => {
        setValue('ch_freight_total', ch_freight_total ? ch_freight_total.toFixed(2) : '');
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
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('ch_freight', '');
                                        return;
                                    }
                                    
                                    // Allow only numbers and decimal point
                                    if (!/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
                                        return; // Invalid input, don't update
                                    }
                                    
                                    // Limit to 2 decimal places if there's a decimal point
                                    let formattedValue = inputValue;
                                    if (inputValue.includes('.')) {
                                        const [whole, decimal] = inputValue.split('.');
                                        formattedValue = `${whole}.${decimal.slice(0, 2)}`;
                                    }
                                    
                                    onChange(formattedValue);
                                    setValue('ch_freight', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0' && value !== '0.00') {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('ch_freight', numValue.toFixed(2));
                                    } else if (value === 0 || value === '0' || value === '0.00') {
                                        // ถ้าค่าเป็น 0 ให้เซ็ตเป็นค่าว่าง
                                        onChange('');
                                        setValue('ch_freight', '');
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
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
                        defaultValue=""
                        rules={{
                            required: false,
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "กรุณากรอกตัวเลขเท่านั้น"
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('ch_exchange_rate', '');
                                        return;
                                    }
                                    
                                    // Allow only numbers and decimal point
                                    if (!/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
                                        return; // Invalid input, don't update
                                    }
                                    
                                    // Limit to 2 decimal places if there's a decimal point
                                    let formattedValue = inputValue;
                                    if (inputValue.includes('.')) {
                                        const [whole, decimal] = inputValue.split('.');
                                        formattedValue = `${whole}.${decimal.slice(0, 2)}`;
                                    }
                                    
                                    onChange(formattedValue);
                                    setValue('ch_exchange_rate', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0' && value !== '0.00') {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('ch_exchange_rate', numValue.toFixed(2));
                                    } else if (value === 0 || value === '0' || value === '0.00') {
                                        // ถ้าค่าเป็น 0 ให้เซ็ตเป็นค่าว่าง
                                        onChange('');
                                        setValue('ch_exchange_rate', '');
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
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
                        defaultValue=""
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