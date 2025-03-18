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

    // คำนวณค่าใช้จ่ายฝั่งไทยใหม่
    const totalThaiExpensesNew = 
        Number(watch('amount_payment_do') || 0) + 
        Number(watch('price_deposit') || 0) + 
        Number(watch('th_total_shipping') || 0) + 
        Number(watch('th_total_port_fee') || 0) +
        Number(watch('th_price_head_tractor') || 0);

    // คำนวณค่าใช้จ่ายฝั่งจีน
    const totalChineseExpenses = Number(watch('ch_freight_total') || 0);

    // คำนวณยอดรวมค่าใช้จ่ายทั้งหมด (ไทย-จีน)
    const totalAllExpenses = totalThaiExpensesNew + totalChineseExpenses;

    // คำนวณรวม Shipping เบิก
    const totalShippingAdvance = Number(watch('th_shipping_advance') || 0);

    // คำนวณยอดคงเหลือ Shipping เบิก
    const remainingShipping = totalShippingAdvance - totalClear;

    useEffect(() => {
        // คำนวณกำไรขาดทุน
        const initialProfit = Number(watch('total_before_vat') || 0) - totalAllExpenses;
        const profitLoss = initialProfit;
        setValue('profit_loss', profitLoss);

        // คำนวณยอดที่ต้องจ่ายคงเหลือ
        calculateRemainingPayment();

        // คำนวณยอดคงเหลือ Shipping เบิก
        const remaining = totalShippingAdvance - totalClear;
        setValue('th_shipping_remaining', remaining);
        
        // ตรวจสอบว่าคืนใคร
        if (remaining >= 0) {
            setValue('th_shipping_return_to', 'คืนบริษัท');
        } else {
            setValue('th_shipping_return_to', 'คืน shipping');
        }

        // คำนวณค่าบริหารจัดการตามเปอร์เซ็นต์
        const percentageFee = Number(watch('percentage_fee') || 0);
        if (percentageFee > 0) {
            const managementFee = (profitLoss * percentageFee) / 100;
            setValue('management_fee', managementFee);
        }
    }, [
        watch('total_before_vat'), 
        totalAllExpenses, 
        watch('billing_amount'), 
        watch('payment_amount_1'),
        watch('payment_amount_2'),
        watch('payment_amount_3'),
        watch('th_total_shipping'), 
        watch('th_shipping_advance'), 
        totalThaiExpensesNew, 
        totalChineseExpenses,
        watch('percentage_fee')
    ]);

    useEffect(() => {
        // ติดตามการเปลี่ยนแปลงของค่าใช้จ่ายต่างๆ ที่ใช้ในการคำนวณ totalThaiExpensesNew
    }, [
        watch('amount_payment_do'),
        watch('price_deposit'),
        watch('th_total_shipping'),
        watch('th_total_port_fee'),
        watch('th_price_head_tractor')
    ]);

    useEffect(() => {
        // เมื่อ billing_amount มีการเปลี่ยนแปลง ให้คำนวณยอดคงค้างใหม่
        calculateRemainingPayment();
    }, [watch('billing_amount')]);

    const calculateRemainingPayment = () => {
        const billingAmount = Number(watch('billing_amount') || 0);
        const paymentAmount1 = Number(watch('payment_amount_1') || 0);
        const paymentAmount2 = Number(watch('payment_amount_2') || 0);
        const paymentAmount3 = Number(watch('payment_amount_3') || 0);

        // คำนวณยอดคงค้างหลังจากชำระงวดที่ 1
        const remainingAmount1 = billingAmount - paymentAmount1;
        setValue('remaining_amount_1', remainingAmount1);

        // คำนวณยอดคงค้างหลังจากชำระงวดที่ 2
        const remainingAmount2 = remainingAmount1 - paymentAmount2;
        setValue('remaining_amount_2', remainingAmount2);

        // คำนวณยอดคงค้างหลังจากชำระงวดที่ 3
        const remainingAmount3 = remainingAmount2 - paymentAmount3;
        setValue('remaining_amount_3', remainingAmount3);

        // คำนวณยอดชำระทั้งหมด
        const totalPayment = paymentAmount1 + paymentAmount2 + paymentAmount3;
        setValue('total_payment_all', totalPayment);

        // คำนวณยอดคงค้างทั้งหมด
        setValue('miss_payment', remainingAmount3);
    };

    // คำนวณกำไรสุทธิ
    const calculateNetProfit = () => {
        const grossProfit = Number(watch('profit_loss') || 0);
        const managementFee = Number(watch('management_fee') || 0);
        const netProfit = grossProfit - managementFee;
        setValue('net_profit', netProfit);
    };

    useEffect(() => {
        // คำนวณกำไรสุทธิเมื่อมีการเปลี่ยนแปลงของกำไรขั้นต้นหรือค่าบริหารจัดการ
        calculateNetProfit();
    }, [watch('profit_loss'), watch('management_fee')]);

    // อัพเดทสถานะการชำระเงิน
    const updatePaymentStatus = () => {
        const billingAmount = Number(watch('billing_amount') || 0);
        const totalPayment = Number(watch('total_payment_all') || 0);
        const missPayment = Number(watch('miss_payment') || 0);

        if (totalPayment === 0) {
            setValue('payment_status', 'รอตรวจสอบ');
        } else if (missPayment === 0 && totalPayment > 0) {
            setValue('payment_status', 'ชำระครบแล้ว');
        } else if (totalPayment > 0 && totalPayment < billingAmount) {
            setValue('payment_status', 'ชำระบางส่วน');
        } else {
            setValue('payment_status', 'ค้างชำระ');
        }
    };

    useEffect(() => {
        // อัพเดทสถานะการชำระเงินเมื่อมีการเปลี่ยนแปลงของยอดชำระหรือยอดคงค้าง
        updatePaymentStatus();
    }, [watch('total_payment_all'), watch('miss_payment')]);

    return (
        <div className="mt-5">
            เคลียร์ SHIPPING เบิก
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                     รวมค่าใช้จ่ายShipping
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(totalClear)} THB
                    </div>
                </div>


                <div className="w-1/2 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวม Shipping เบิก
                    </label>
                    <Controller
                        name="th_shipping_advance"
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
                                    setValue('th_shipping_advance', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value === 0 ? '' : value}
                                placeholder="กรอกจำนวน"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
              

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ยอดคงเหลือ Shipping เบิก
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(remainingShipping)} THB
                    </div>
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        คืนใคร
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {remainingShipping >= 0 ? 'คืนบริษัท' : 'คืน shipping'} ({remainingShipping >= 0 ? '+' : ''}{numberFormatTh(remainingShipping)} THB)
                    </div>
                    <Controller
                        name="th_shipping_return_to"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="hidden" {...field} />}
                    />
                    <Controller
                        name="th_shipping_remaining"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => <input type="hidden" {...field} />}
                    />
                </div>
            </div>

            <hr/>
            <br></br>
            <h1>รวมค่าใช้จ่ายทั้งหมด</h1>


            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">

            <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายฝั่งจีน
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(totalChineseExpenses)} THB
                    </div>
                </div>

            <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                      รวมค่าใช้จ่ายฝั่งไทย
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTh(totalThaiExpensesNew)} THB
                    </div>
                </div>
               

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        รวมค่าใช้จ่ายทั้งหมด (ไทย-จีน)
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-md">
                        {numberFormatTH_CN(totalAllExpenses)} THB
                    </div>
                </div>
            </div>
            
            <hr></hr>
            <hr></hr>
            <hr></hr>

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
                        ยอดเรียกเก็บทั้งหมด
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

           

         

            {/* <hr className="my-5" /> */}

            <div className="mt-5">
                {/* <h3 className="text-lg font-semibold text-gray-800 mb-3">การชำระเงิน</h3> */}
                
                {/* Row 1 */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            วันที่ชำระ
                        </label>
                        <Controller
                            name="payment_date_1"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <input
                                    type="date"
                                    onChange={onChange}
                                    value={value}
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            ยอดชำระ
                        </label>
                        <Controller
                            name="payment_amount_1"
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
                                        setValue('payment_amount_1', newValue === '' ? '' : Number(newValue));
                                        
                                        // คำนวณยอดคงค้างใหม่
                                        calculateRemainingPayment();
                                    }}
                                    value={value === 0 ? '' : value}
                                    placeholder="กรอกข้อมูล"
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            คงค้าง
                        </label>
                        <Controller
                            name="remaining_amount_1"
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

                {/* Row 2 */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            วันที่ชำระ
                        </label>
                        <Controller
                            name="payment_date_2"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <input
                                    type="date"
                                    onChange={onChange}
                                    value={value}
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            ยอดชำระ
                        </label>
                        <Controller
                            name="payment_amount_2"
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
                                        setValue('payment_amount_2', newValue === '' ? '' : Number(newValue));
                                        
                                        // คำนวณยอดคงค้างใหม่
                                        calculateRemainingPayment();
                                    }}
                                    value={value === 0 ? '' : value}
                                    placeholder="กรอกข้อมูล"
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            คงค้าง
                        </label>
                        <Controller
                            name="remaining_amount_2"
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

                {/* Row 3 */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            วันที่ชำระ
                        </label>
                        <Controller
                            name="payment_date_3"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <input
                                    type="date"
                                    onChange={onChange}
                                    value={value}
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            ยอดชำระ
                        </label>
                        <Controller
                            name="payment_amount_3"
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
                                        setValue('payment_amount_3', newValue === '' ? '' : Number(newValue));
                                        
                                        // คำนวณยอดคงค้างใหม่
                                        calculateRemainingPayment();
                                    }}
                                    value={value === 0 ? '' : value}
                                    placeholder="กรอกข้อมูล"
                                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            คงค้าง
                        </label>
                        <Controller
                            name="remaining_amount_3"
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
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                <div className="w-full flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ผลกำไรขั้นต้น
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

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ค่าบริหารจัดการ
                    </label>
                    <Controller
                        name="management_fee"
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
                                    setValue('management_fee', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value === 0 ? '' : value}
                                placeholder="กรอกข้อมูล"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                        ช่องให้กรอก %
                    </label>
                    <Controller
                        name="percentage_fee"
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
                                    setValue('percentage_fee', newValue === '' ? '' : Number(newValue));
                                }}
                                value={value === 0 ? '' : value}
                                placeholder="กรอก %"
                                className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                            />
                        )}
                    />
                </div>

                <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block mb-2 text-gray-700 text-sm font-semibold">
                         กำไร/ขาดทุนสุทธิ
                    </label>
                    <Controller
                        name="net_profit"
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
            <hr className="my-5" />
          
            <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            สถานะการชำระเงิน
                        </label>
                        <Controller
                            name="payment_status"
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
            

            <hr className="my-5" />
            
            <div className="mt-5">
                <h1 className="text-lg font-semibold text-gray-800 mb-3">คืนมัดจำตู้</h1>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label className="block mb-2 text-gray-700 text-sm font-semibold">
                            ช่องสีเหลี่ยมให้ติ๊กถูก
                        </label>
                        <Controller
                            name="tax_return_checked"
                            control={control}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            onChange(e.target.checked);
                                            // ถ้าไม่ได้ติ๊ก ให้เคลียร์ค่าในฟิลด์อื่น
                                            if (!e.target.checked) {
                                                setValue('tax_return_amount', 0);
                                                setValue('tax_return_date', '');
                                            }
                                        }}
                                        checked={value}
                                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {watch('tax_return_checked') && (
                        <>
                            <div className="w-full md:w-1/3 flex flex-col">
                                <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                    ยอดคืน
                                </label>
                                <Controller
                                    name="tax_return_amount"
                                    control={control}
                                    defaultValue={0}
                                    rules={{
                                        required: watch('tax_return_checked'),
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "กรุณากรอกตัวเลขเท่านั้น"
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <input
                                            type="number"
                                            onChange={onChange}
                                            value={value === 0 ? '' : value}
                                            placeholder="กรอกข้อมูล"
                                            className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col">
                                <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                    วันที่คืน
                                </label>
                                <Controller
                                    name="tax_return_date"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: watch('tax_return_checked')
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <input
                                            type="date"
                                            onChange={onChange}
                                            value={value}
                                            className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <hr className="my-5" />
            
        </div>
    );
};

export default PaymentSummary;