import React, { useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import { numberFormatTh, numberFormatTH_CN } from "@/utils/numberFormat";

interface PaymentSummaryProps {
    control: any;
    watch: any;
    setValue: any;
    errors:any
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ control, errors, watch, setValue }) => {
    // คำนวณรวมเคลียร์ทั้งหมด
    const totalClear = Number(watch('th_duty') || 0) +
        Number(watch('th_tax') || 0) +
        Number(watch('th_custom_fees') || 0) +
        Number(watch('th_employee') || 0) +
        Number(watch('th_warehouse') || 0) +
        Number(watch('th_gasoline') || 0) +
        Number(watch('th_other_shipping') || 0) +
        Number(watch('th_overtime') || 0);

    // คำนวณค่าใช้จ่ายฝั่งไทย
    const totalThaiExpenses = Number(watch('th_total_shipping') || 0) + 
        Number(watch('th_hairy') || 0) +
        Number(watch('th_head_tractor') || 0) +
        Number(watch('th_price_head_tractor') || 0) +
        Number(watch('th_other_fee') || 0) +
        Number(watch('amount_payment_do') || 0) +  // ค่าแลก D/O
        Number(watch('price_deposit') || 0);       // มัดจำตู้

    // คำนวณค่าใช้จ่ายฝั่งจีน
    const totalChineseExpenses = Number(watch('ch_freight_total') || 0);

    // คำนวณยอดรวมค่าใช้จ่ายทั้งหมด (ไทย-จีน)
    const totalAllExpenses = totalThaiExpenses + totalChineseExpenses;

    useEffect(() => {
        // คำนวณกำไรขาดทุน
        const profitLoss = Number(watch('total_before_vat') || 0) - totalAllExpenses;
        setValue('profit_loss', profitLoss);

        // คำนวณค่าบริการ (10% ของกำไรขาดทุน)
        const serviceFee = profitLoss * 0.1;
        setValue('price_service', serviceFee);

        // คำนวณกำไรขาดทุนสุทธิ
        const netProfitLoss = profitLoss - serviceFee;
        setValue('total_profit_loss', netProfitLoss);

        // กำหนดข้อความกำไร/ขาดทุน
        setValue('text_profit_loss', netProfitLoss >= 0 ? 'กำไร' : 'ขาดทุน');

        // คำนวณขาดจ่าย
        const billingAmount = Number(watch('billing_amount') || 0);
        const totalPaymentAll = Number(watch('total_payment_all') || 0);
        const missPayment = billingAmount - totalPaymentAll;
        setValue('miss_payment', missPayment);

        // กำหนดสถานะการเงิน
    }, [watch('total_before_vat'), totalAllExpenses, watch('billing_amount'), watch('total_payment_all'), setValue]);

    return (
        <div className="mt-5">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมเคลียร์ Shipping
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(totalClear)} THB
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ยอดเรียกเก็บก่อน VAT
                    </label>
                    <Controller
                        name="total_before_vat"
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
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ยอดเรียกเก็บ
                    </label>
                    <Controller
                        name="billing_amount"
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
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ยอดชำระ
                    </label>
                    <Controller
                        name="total_payment_all"
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
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ขาดจ่าย
                    </label>
                    <Controller
                        name="miss_payment"
                        control={control}
                        defaultValue={0}
                        render={({ field: { value } }) => (
                            <div className="px-4 py-2 bg-gray-100 rounded-md">
                                {numberFormatTh(value)} THB
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายฝั่งไทย
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(totalThaiExpenses)} THB
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายทั้งหมด (ไทย-จีน)
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTH_CN(totalAllExpenses)} THB
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        กำไรขาดทุน
                    </label>
                    <Controller
                        name="profit_loss"
                        control={control}
                        defaultValue={0}
                        render={({ field: { value } }) => (
                            <div className="px-4 py-2 bg-gray-100 rounded-md">
                                {numberFormatTh(value)} THB
                            </div>
                        )}
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าบริการ (10%)
                    </label>
                    <Controller
                        name="price_service"
                        control={control}
                        defaultValue={0}
                        render={({ field: { value } }) => (
                            <div className="px-4 py-2 bg-gray-100 rounded-md">
                                {numberFormatTh(value)} THB
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        กำไรขาดทุนสุทธิ
                    </label>
                    <Controller
                        name="total_profit_loss"
                        control={control}
                        defaultValue={0}
                        render={({ field: { value } }) => (
                            <div className="px-4 py-2 bg-gray-100 rounded-md">
                                {numberFormatTh(value)} THB
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col">
                    <Controller
                        name="text_profit_loss"
                        control={control}
                        defaultValue=""
                        render={({ field: { value } }) => (
                            <div className={`px-4 py-2 rounded-md font-semibold text-center ${value === 'กำไร' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {value}
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        สถานะ
                    </label>
                    <Controller
                        name="finance_status"
                        control={control}
                        defaultValue="รอตรวจสอบ"
                        render={({ field: { onChange, value } }) => (
                            <select
                                onChange={onChange}
                                value={value}
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            >
                                <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                                <option value="ค้างชำระ">ค้างชำระ</option>
                                <option value="ชำระบางส่วน">ชำระบางส่วน</option>
                                <option value="ชำระครบแล้ว">ชำระครบแล้ว</option>
                            </select>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;