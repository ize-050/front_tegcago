import React from 'react';
import { Controller } from "react-hook-form";
import { ExpenseFormProps } from './types';
import { numberFormatTh } from "@/utils/numberFormat";

const ThaiExpenseForm: React.FC<ExpenseFormProps> = ({ control, errors, watch, setValue }) => {
    return (
        <>
            <h1 className="mb-5 text-1xl font-bold">ค่าใช้จ่ายฝั่งไทย</h1>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อากร
                    </label>

                    <Controller
                        name="th_duty"
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
                                        setValue('th_duty', '');
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
                                    setValue('th_duty', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0' && value !== '0.00') {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_duty', numValue.toFixed(2));
                                    } else if (value === 0 || value === '0' || value === '0.00') {
                                        // ถ้าค่าเป็น 0 ให้เซ็ตเป็นค่าว่าง
                                        onChange('');
                                        setValue('th_duty', '');
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_duty ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_duty && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ภาษี
                    </label>
                    <Controller
                        name="th_tax"
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
                                        setValue('th_tax', '');
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
                                    setValue('th_tax', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_tax', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_tax ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_tax && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>


                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        เจ้าหน้าที่
                    </label>
                    <Controller
                        name="th_employee"
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
                                        setValue('th_employee', '');
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
                                    setValue('th_employee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_employee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_employee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_employee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>


            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">



                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าเช่าโกดัง
                    </label>
                    <Controller
                        name="th_warehouse"
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
                                        setValue('th_warehouse', '');
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
                                    setValue('th_warehouse', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_warehouse', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_warehouse ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_warehouse && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าธรรมเนียมศุลกากร
                    </label>
                    <Controller
                        name="th_custom_fees"
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
                                        setValue('th_custom_fees', '');
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
                                    setValue('th_custom_fees', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_custom_fees', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_custom_fees ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_custom_fees && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าล่วงเวลา
                    </label>
                    <Controller
                        name="th_overtime"
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
                                        setValue('th_overtime', '');
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
                                    setValue('th_overtime', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_overtime', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_overtime ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_overtime && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>


            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">



                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าธรรมเนียมเช็ค
                    </label>
                    <Controller
                        name="th_check_fee"
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
                                        setValue('th_check_fee', '');
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
                                    setValue('th_check_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_check_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_check_fee ? "border-red-500" : "border-gray-200"}
                                  px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_check_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ตัดบัญชีสินค้า
                    </label>
                    <Controller
                        name="th_product_account"
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
                                        setValue('th_product_account', '');
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
                                    setValue('th_product_account', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_product_account', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_product_account ? "border-red-500" : "border-gray-200"}
                                  px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_product_account && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ส่งใบอนุญาต
                    </label>
                    <Controller
                        name="th_license_fee"
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
                                        setValue('th_license_fee', '');
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
                                    setValue('th_license_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_license_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_license_fee ? "border-red-500" : "border-gray-200"}
                                  px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_license_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">



                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าน้ำมัน
                    </label>
                    <Controller
                        name="th_gasoline"
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
                                        setValue('th_gasoline', '');
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
                                    setValue('th_gasoline', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_gasoline', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_gasoline ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_gasoline && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่ายิงใบขน
                    </label>
                    <Controller
                        name="th_hairy"
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
                                        setValue('th_hairy', '');
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
                                    setValue('th_hairy', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_hairy', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_hairy ? "border-red-500" : "border-gray-200"}
                                px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_hairy && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อื่นๆ
                    </label>
                    <Controller
                        name="th_other_fee"
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
                                        setValue('th_other_fee', '');
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
                                    setValue('th_other_fee', formattedValue);
                                }}
                                onBlur={() => {
                                    // Format to 2 decimal places when leaving the field
                                    if (value !== '' && value !== null && value !== undefined) {
                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                        onChange(numValue.toFixed(2));
                                        setValue('th_other_fee', numValue.toFixed(2));
                                    }
                                }}
                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                placeholder="0.00"
                                className={`${errors.th_other_fee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_other_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">



                <div className="w-full flex flex-col justify-end align-end">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        หมายเหตุ
                    </label>
                    <Controller
                        name="th_shipping_note"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <textarea
                                onChange={onChange}
                                value={value}
                                placeholder="กรอกหมายเหตุ"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base w-full"
                                rows={3}
                            />
                        )}
                    />
                </div>

                <div className="w-full flex flex-col justify-end align-end"
                    style={{ justifyContent: "end", alignItems: "end" }}>
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมเคลียร์ Shipping
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(watch('th_total_shipping') || 0)} THB
                    </div>
                </div>


            </div>
        </>
    );
};

export default ThaiExpenseForm;