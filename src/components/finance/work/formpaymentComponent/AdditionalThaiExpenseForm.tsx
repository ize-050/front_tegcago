import React from 'react';
import { Controller } from "react-hook-form";
import { ExpenseFormProps } from './types';

const AdditionalThaiExpenseForm: React.FC<ExpenseFormProps> = ({ control, errors, watch, setValue }) => {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-gray-700 text-sm font-semibold">
                    ค่ายิงใบขน
                </label>
                <Controller
                    name="th_hairy"
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
                            onChange={onChange}
                            value={value}
                            placeholder="กรอกข้อมูล"
                            className={`${errors.th_hairy ? "border-red-500" : "border-gray-200"}
                                px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                        />
                    )}
                />
                {errors.th_hairy && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-gray-700 text-sm font-semibold">
                    หัวลาก
                </label>
                <Controller
                    name="th_head_tractor"
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
                            onChange={onChange}
                            value={value}
                            placeholder="กรอกจำนวน"
                            className={`${errors.th_head_tractor ? "border-red-500" : "border-gray-200"}
                                px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                        />
                    )}
                />
                {errors.th_head_tractor && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
                <label className="block mb-2 text-gray-700 text-sm font-semibold">
                    ค่าใช้จ่ายหัวลาก
                </label>
                <Controller
                    name="th_price_head_tractor"
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
                            onChange={onChange}
                            value={value}
                            placeholder="กรอกราคา"
                            className={`${errors.th_price_head_tractor ? "border-red-500" : "border-gray-200"}
                                px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                        />
                    )}
                />
                {errors.th_price_head_tractor && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อื่นๆ
                    </label>
                    <Controller
                        name="th_other_fee"
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
                                onChange={onChange}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_other_fee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_other_fee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
        </div>
    );
};

export default AdditionalThaiExpenseForm;
