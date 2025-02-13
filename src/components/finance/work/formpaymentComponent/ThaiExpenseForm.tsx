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
                                    onChange(e);
                                    setValue('th_duty', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
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
                                    onChange(e);
                                    setValue('th_tax', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_tax ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_tax && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าธรรมเนียมศุลกากร
                    </label>
                    <Controller
                        name="th_custom_fees"
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
                                    onChange(e);
                                    setValue('th_custom_fees', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_custom_fees ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_custom_fees && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าล่วงเวลา
                    </label>
                    <Controller
                        name="th_overtime"
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
                                    onChange(e);
                                    setValue('th_overtime', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_overtime ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_overtime && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        เคลียร์เจ้าหน้าที่
                    </label>
                    <Controller
                        name="th_employee"
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
                                    onChange(e);
                                    setValue('th_employee', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_employee ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_employee && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าเช่าโกดัง
                    </label>
                    <Controller
                        name="th_warehouse"
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
                                    onChange(e);
                                    setValue('th_warehouse', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_warehouse ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_warehouse && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าน้ำมัน Shipping
                    </label>
                    <Controller
                        name="th_gasoline"
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
                                    onChange(e);
                                    setValue('th_gasoline', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_gasoline ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_gasoline && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        อื่นๆ Shipping
                    </label>
                    <Controller
                        name="th_other_shipping"
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
                                    onChange(e);
                                    setValue('th_other_shipping', Number(e.target.value));
                                }}
                                value={value}
                                placeholder="กรอกข้อมูล"
                                className={`${errors.th_other_shipping ? "border-red-500" : "border-gray-200"}
                                    px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                            />
                        )}
                    />
                    {errors.th_other_shipping && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
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
                                onChange={(e) => {
                                    onChange(e);
                                    setValue('th_other_fee', Number(e.target.value));
                                }}
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

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
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