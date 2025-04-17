import React from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from "@/utils/numberFormat";

const DOExpenseForm: React.FC<ExpenseFormProps> = () => {
    const { control, formState: { errors }, setValue, watch } = useFormContext();

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
                                        setValue('amount_payment_do', '');
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
                                    setValue('amount_payment_do', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0' && value !== '0.00') {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('amount_payment_do', numValue.toFixed(2));
                                    } else if (value === 0 || value === '0' || value === '0.00') {
                                        // ถ้าค่าเป็น 0 ให้เซ็ตเป็นค่าว่าง
                                        onChange('');
                                        setValue('amount_payment_do', '');
                                    }
                                }}
                                value={value === 0 || value === '0' || value === '0.00' ? '' : (typeof value === 'string' ? value : (value ? value.toString() : ''))}
                                placeholder="0.00"
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
                                        setValue('price_deposit', '');
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
                                    setValue('price_deposit', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('price_deposit', numValue.toFixed(2));
                                    } else {
                                        onChange('');
                                        setValue('price_deposit', '');
                                    }
                                }}
                                value={value === 0 || value === '0' || value === '0.00' ? '' : (typeof value === 'string' ? value : (value ? value.toString() : ''))}
                                placeholder=""
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
