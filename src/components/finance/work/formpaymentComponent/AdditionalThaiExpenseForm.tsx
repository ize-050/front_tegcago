import React, { useEffect } from 'react';
import { Controller } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from '../../../../utils/numberFormat';

const AdditionalThaiExpenseForm: React.FC<ExpenseFormProps> = ({ control, errors, watch, setValue }) => {
    
    useEffect(() => {
        calculateTotalThaiExpense();
    }, [
        watch('th_port_fee'),
        watch('th_lift_on_off'),
        watch('th_ground_fee'),
        watch('th_port_other_fee'),
        watch
    ]);

    const calculateTotalThaiExpense = () => {
        const total = 
            Number(watch('th_port_fee') || 0) +
            Number(watch('th_lift_on_off') || 0) +
            Number(watch('th_ground_fee') || 0) +
            Number(watch('th_port_other_fee') || 0);
        
        setValue('th_total_port_fee', total.toFixed(2));
    };
    
    return (
        <>
            <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">รวมค่าใช้จ่ายหัวลาก</h3>
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                    ซัพหัวลาก
                    </label>
                    <Controller
                        name="th_port_name"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="text"
                                onChange={onChange}
                                value={value}
                                placeholder="กรอกชื่อท่า"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าใช้จ่ายหัวลาก
                    </label>
                    <Controller
                        name="th_port_fee"
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
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('th_port_fee', '');
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
                                    setValue('th_port_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_port_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_port_fee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_port_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่า Lift-on/off
                    </label>
                    <Controller
                        name="th_lift_on_off"
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
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('th_lift_on_off', '');
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
                                    setValue('th_lift_on_off', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_lift_on_off', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_lift_on_off ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_lift_on_off && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าค้างคืน
                    </label>
                    <Controller
                        name="th_ground_fee"
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
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('th_ground_fee', '');
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
                                    setValue('th_ground_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_ground_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_ground_fee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_ground_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อื่นๆ
                    </label>
                    <Controller
                        name="th_port_other_fee"
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
                                type="text"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty value for deletion
                                    if (inputValue === '') {
                                        onChange('');
                                        setValue('th_port_other_fee', '');
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
                                    setValue('th_port_other_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_port_other_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_port_other_fee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_port_other_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        หมายเหตุ
                    </label>
                    <Controller
                        name="th_port_note"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <textarea
                                onChange={onChange}
                                value={value}
                                placeholder="กรอกหมายเหตุ"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base w-full"
                                rows={1}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col justify-end align-end"
                    style={{ justifyContent: "end", alignItems: "end" }}>
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายหัวลาก
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(watch('th_total_port_fee') || 0)} THB
                    </div>
                </div>
            </div>

          
        </>
    );
};

export default AdditionalThaiExpenseForm;
