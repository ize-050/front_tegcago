import React, { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import moment from "moment";
import { customerData } from "@/stores/customer";
import { submitPrePurchase } from "@/stores/purchase";
import { numberFormatTh, numberFormatAllth, numberFormatcn, numberFormatTH_CN } from "@/utils/numberFormat";
import { getSelectCustomer } from "@/services/customer";
import FormTablePaymentComponent from '@/components/finance/work/FormTablePaymentComponent';
import { financeData } from "@/stores/finance";
import ChineseExpenseForm from './ChineseExpenseForm';
import ThaiExpenseForm from './ThaiExpenseForm';
import DOExpenseForm from './DOExpenseForm';
import PaymentSummary from './PaymentSummary';
import AdditionalThaiExpenseForm from './AdditionalThaiExpenseForm';

// axios
import axios from '../../../../../axios';
import { getWorkByid } from "@/services/finance";

//lib
import Swal from "sweetalert2"

const FormPaymentComponent = ({ BookingId }: any) => {
    const dispatch = useAppDispatch();
    const { purchaseFinanceDetail, purchaseFinanceData } = useAppSelector(financeData);
    const methods = useForm();
    const [selectCustomer, SetSelectCustomer] = useState<any[]>([]);

    const [selectDo, setSelectDo] = useState<{
        amount_payment_do: number,
        price_deposit: number,
        date_return_cabinet?: string | null,
        price_return_cabinet?: number | null
    }>({
        amount_payment_do: 0,
        price_deposit: 0,
        date_return_cabinet: null,
        price_return_cabinet: 0,
    });

    const [PriceCh, SetPriceCh] = useState<number>(0);
    const session: any = useSession();
    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
        watch
    } = methods;

    const router = useRouter();
    const [openTag, setOpenTag] = useState<boolean>(false);
    const [data, setData] = useState<Partial<any>>({});
    const [Bookdate, SetBookingDate] = useState<string>(
        moment().format("DD/MM/DD HH:mm")
    );


    const getWork = async () => {
        const work_by_id: any = await getWorkByid(BookingId as string);

        if (work_by_id != null) {
            // Set all form values from work_by_id

            setValue('id', work_by_id.id || '');
            
            // Thailand expenses
            setValue('th_overtime', work_by_id.th_overtime || '0');
            setValue('th_employee', work_by_id.th_employee || '0');
            setValue('th_warehouse', work_by_id.th_warehouse || '0');
            setValue('th_gasoline', work_by_id.th_gasoline || '0');
            setValue('th_duty', work_by_id.th_duty || '0');
            setValue('th_custom_fees', work_by_id.th_custom_fees || '0');
            setValue('th_tax', work_by_id.th_tax || '0');
            setValue('th_hairy', work_by_id.th_hairy || '0');
            setValue('th_other_fee', work_by_id.th_other_fee || '0');
            
            // Shipping expenses
            setValue('th_shipping', work_by_id.th_shipping_price || '0');
            setValue('th_total_shipping', work_by_id.th_total_shipping || '0');
            setValue('th_shipping_note', work_by_id.th_shipping_note || '');
            setValue('th_shipping_advance', work_by_id.th_shipping_advance || '0');
            setValue('th_shipping_remaining', work_by_id.th_shipping_remaining || '0');
            setValue('th_shipping_return_to', work_by_id.th_shipping_return_to || '');
            
            // Port expenses
            setValue('th_port_name', work_by_id.th_port_name || '');
            setValue('th_port_fee', work_by_id.th_port_fee || '0');
            setValue('th_lift_on_off', work_by_id.th_lift_on_off || '0');
            setValue('th_ground_fee', work_by_id.th_ground_fee || '0');
            setValue('th_port_other_fee', work_by_id.th_port_other_fee || '0');
            setValue('th_price_head_tractor', work_by_id.th_price_head_tractor || '0');
            setValue('th_total_port_fee', work_by_id.th_total_port_fee || '0');
            
            // D/O Expenses
            setValue('amount_payment_do', work_by_id.amount_payment_do || '0');
            setValue('price_deposit', work_by_id.price_deposit || '0');
            
            // Chinese Expenses
            setValue('ch_freight', work_by_id.ch_freight || '0');
            setValue('ch_exchange_rate', work_by_id.ch_exchange_rate || '0');
            setValue('ch_freight_total', work_by_id.ch_freight_total || '0');

            // Billing and Payment
            setValue('total_before_vat', work_by_id.total_before_vat || '0');
            setValue('billing_amount', work_by_id.billing_amount || '0');
            setValue('total_payment_all', work_by_id.total_payment_all || '0');
            setValue('miss_payment', work_by_id.miss_payment || '0');

            // Calculations
            setValue('profit_loss', work_by_id.profit_loss || '0');
            setValue('price_service', work_by_id.price_service || '0');
            setValue('total_profit_loss', work_by_id.total_profit_loss || '0');
            setValue('text_profit_loss', work_by_id.text_profit_loss || '');

            // Status
            setValue('finance_status', work_by_id.finance_status || 'ชำระครบแล้ว');

            // ข้อมูลการชำระเงิน
            setValue('payment_date_1', work_by_id.payment_date_1 || '');
            setValue('payment_date_2', work_by_id.payment_date_2 || '');
            setValue('payment_date_3', work_by_id.payment_date_3 || '');
            setValue('payment_amount_1', work_by_id.payment_amount_1 || '0');
            setValue('payment_amount_2', work_by_id.payment_amount_2 || '0');
            setValue('payment_amount_3', work_by_id.payment_amount_3 || '0');
            setValue('remaining_amount_1', work_by_id.remaining_amount_1 || '0');
            setValue('remaining_amount_2', work_by_id.remaining_amount_2 || '0');
            setValue('remaining_amount_3', work_by_id.remaining_amount_3 || '0');
            setValue('payment_status', work_by_id.payment_status || 'รอตรวจสอบ');
            
            // ข้อมูลคืนภาษีจากตู้
            setValue('tax_return_checked', work_by_id.tax_return_checked || false);
            setValue('tax_return_amount', work_by_id.tax_return_amount || '0');
            setValue('tax_return_date', work_by_id.tax_return_date || '');
            
            // ข้อมูลกำไรและค่าบริหารจัดการ
            setValue('management_fee', work_by_id.management_fee || '0');
            setValue('percentage_fee', work_by_id.percentage_fee || '0');
            setValue('net_profit', work_by_id.net_profit || '0');
        }
    };

    useEffect(() => {
        getWork();
    }, []);

    const calculateTotalShipping = useCallback(() => {
        const total =
            Number(watch('th_duty') || 0) +
            Number(watch('th_tax') || 0) +
            Number(watch('th_custom_fees') || 0) +
            Number(watch('th_employee') || 0) +
            Number(watch('th_warehouse') || 0) +
            Number(watch('th_gasoline') || 0) +
            Number(watch('th_hairy') || 0) +
            Number(watch('th_overtime') || 0) +
            Number(watch('th_check_fee') || 0) +
            Number(watch('th_product_account') || 0) +
            Number(watch('th_license_fee') || 0) +
            Number(watch('th_other_fee') || 0);
        setValue('th_total_shipping', total);

        const totalALLTh =
            Number(total) +
            (Number(watch('price_deposit')) || 0) +
            (Number(watch('amount_payment_do')) || 0) +
            Number(watch('th_price_head_tractor') || 0) +
            Number(watch('th_head_tractor') || 0) +
            Number(watch('th_total_port_fee') || 0);

        setValue('total_all_th', totalALLTh);
    }, [
        watch('th_duty'),
        watch('th_tax'),
        watch('th_custom_fees'),
        watch('th_employee'),
        watch('th_warehouse'),
        watch('th_gasoline'),
        watch('th_hairy'),
        watch('th_overtime'),
        watch('th_check_fee'),
        watch('th_product_account'),
        watch('th_license_fee'),
        watch('th_other_fee'),
        watch('price_deposit'),
        watch('amount_payment_do'),
        watch('th_price_head_tractor'),
        watch('th_head_tractor'),
        watch('th_total_port_fee'),
        watch,
        setValue
    ]);

    const calAllThandCn = useCallback(() => {
        const total_all_th = watch('total_all_th');
        const ch_freight_total = watch('ch_freight_total');

        const total_all_cn = total_all_th + ch_freight_total;
        setValue('th_cn_total', total_all_cn);
    }, [
        watch('total_all_th'),
        watch('ch_freight_total'),
        watch,
        setValue
    ]);

    const setPriceCh = useCallback((value: string) => {
        const fresh_ch = Number(watch('ch_freight') || 0) * Number(value);
        setValue('ch_freight_total', fresh_ch);
        calAllThandCn();
    }, [watch, setValue, calAllThandCn]);

    useEffect(() => {
        calculateTotalShipping();
    }, [
        watch('th_duty'),
        watch('th_tax'),
        watch('th_custom_fees'),
        watch('th_employee'),
        watch('th_warehouse'),
        watch('th_gasoline'),
        watch('th_hairy'),
        watch('th_overtime'),
        watch('th_check_fee'),
        watch('th_product_account'),
        watch('th_license_fee'),
        watch('th_other_fee'),
        watch('price_deposit'),
        watch('amount_payment_do'),
        watch('th_price_head_tractor'),
        watch('th_head_tractor'),
        watch('th_total_port_fee'),
        calculateTotalShipping
    ]);

    useEffect(() => {
        calAllThandCn();
    }, [calAllThandCn]);

    useEffect(() => {
        if (purchaseFinanceData?.d_purchase_customer_payment?.length > 0) {
            const TotalBeforeVat = purchaseFinanceData.d_purchase_customer_payment.reduce((acc: number, item: any) => {
                return acc + Number(item.payment_price);
            }, 0);
            setValue('total_payment_all', TotalBeforeVat);
        }
    }, [purchaseFinanceData, setValue]);

    useEffect(() => {
        const miss_payment = Number(watch('total_payment_all') || 0) - Number(watch('billing_amount') || 0);
        setValue('miss_payment', miss_payment);
    }, [watch('total_payment_all'), watch('billing_amount'), setValue]);

    useEffect(() => {
        if (purchaseFinanceDetail?.length > 0) {
            const data_Leave = purchaseFinanceDetail.find((item: any) => item.status_key === 'Leave');
            const return_cabinet = purchaseFinanceDetail.find((item: any) => item.status_key === 'return_cabinet');

            if (data_Leave) {
                setValue('amount_payment_do', data_Leave?.leave?.amount_payment_do);
                setValue('price_deposit', data_Leave?.leave?.price_deposit);
            }

            if (return_cabinet) {
                setValue('price_return_cabinet', return_cabinet?.cs_return_cabinet?.price_return_cabinet);
                setValue('date_return_cabinet', return_cabinet?.cs_return_cabinet?.date_return_cabinet);
            }
        }
    }, [purchaseFinanceDetail, setValue]);

    useEffect(() => {
        (async () => {
            let customer: any = await getSelectCustomer();
            SetSelectCustomer(customer);
        })();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const requestData = {
                id: data.id || '',
                work_id: BookingId, // เพิ่ม work_id กลับมา
                
                // ข้อมูลทั่วไป
                finance_status: data.finance_status || '',
                
                // ข้อมูลค่าใช้จ่ายจีน
                ch_freight: String(data.ch_freight || 0),
                ch_exchange_rate: String(data.ch_exchange_rate || 0),
                ch_freight_total: String(data.ch_freight_total || 0),
                
                // ข้อมูลค่าใช้จ่ายไทยปไป
                th_duty: String(data.th_duty || 0),
                th_tax: String(data.th_tax || 0),
                th_employee: String(data.th_employee || 0),
                th_warehouse: String(data.th_warehouse || 0),
                th_custom_fees: String(data.th_custom_fees || 0),
                th_overtime: String(data.th_overtime || 0),
                th_check_fee: String(data.th_check_fee || 0),
                th_product_account: String(data.th_product_account || 0),
                th_license_fee: String(data.th_license_fee || 0),
                th_gasoline: String(data.th_gasoline || 0),
                th_hairy: String(data.th_hairy || 0),
                th_other_fee: String(data.th_other_fee || 0),
                
                // ข้อมูลค่าใช้จ่ายหัวลาก
                th_port_name: String(data.th_port_name || ''),
                th_port_fee: String(data.th_port_fee || 0),
                th_lift_on_off: String(data.th_lift_on_off || 0),
                th_ground_fee: String(data.th_ground_fee || 0),
                th_port_other_fee: String(data.th_port_other_fee || 0),
                th_price_head_tractor: String(data.th_price_head_tractor || 0),
                th_total_port_fee: String(data.th_total_port_fee || 0),
                
                // ข้อมูลค่าใช้จ่าย D/O
                amount_payment_do: String(data.amount_payment_do || 0),
                price_deposit: String(data.price_deposit || 0),
                
                // ข้อมูล Shipping
                th_shipping_price: String(data.th_shipping || 0), // แก้ไขจาก th_shipping_price เป็น th_shipping
                th_shipping_note: String(data.th_shipping_note || ''),
                th_shipping_advance: String(data.th_shipping_advance || 0),
                th_shipping_remaining: String(data.th_shipping_remaining || 0),
                th_shipping_return_to: String(data.th_shipping_return_to || ''),
                th_total_shipping: String(data.th_total_shipping || 0),
                
                // ข้อมูลการคำนวณ
                billing_amount: String(data.billing_amount || 0),
                total_before_vat: String(data.total_before_vat || 0),
                total_payment_all: String(data.total_payment_all || 0),
                miss_payment: String(data.miss_payment || 0),
                profit_loss: String(data.profit_loss || 0),
                price_service: String(data.price_service || 0),
                total_profit_loss: String(data.total_profit_loss || 0),
                text_profit_loss: String(data.text_profit_loss || ''),
                
                // ข้อมูลการชำระเงิน
                payment_date_1: String(data.payment_date_1 || ''),
                payment_date_2: String(data.payment_date_2 || ''),
                payment_date_3: String(data.payment_date_3 || ''),
                payment_amount_1: String(data.payment_amount_1 || 0),
                payment_amount_2: String(data.payment_amount_2 || 0),
                payment_amount_3: String(data.payment_amount_3 || 0),
                remaining_amount_1: String(data.remaining_amount_1 || 0),
                remaining_amount_2: String(data.remaining_amount_2 || 0),
                remaining_amount_3: String(data.remaining_amount_3 || 0),
                payment_status: String(data.payment_status || ''),
                
                // ข้อมูลคืนภาษีจากตู้
                tax_return_checked: data.tax_return_checked || false,
                tax_return_amount: String(data.tax_return_amount || 0),
                tax_return_date: String(data.tax_return_date || ''),
                
                // ข้อมูลกำไรและค่าบริหารจัดการ
                management_fee: String(data.management_fee || 0),
                percentage_fee: String(data.percentage_fee || 0),
                net_profit: String(data.net_profit || 0),
            };
            
            const isUpdate = !!requestData.id;
            console.log("Form data:", data);
            console.log("Request data:", requestData);
            console.log("Is update:", isUpdate);

            Swal.fire({
                title:"รอUpdate การบันทึกข้อมูล",
                text: "รอUpdate การบันทึกข้อมูล",
                icon: "warning",
                // showCancelButton: true,
            })
            
            // Swal.fire({
            //     title: isUpdate ? "ต้องการอัปเดตข้อมูล?" : "ต้องการบันทึกข้อมูล?",
            //     text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน",
            //     icon: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#3085d6",
            //     cancelButtonColor: "#d33",
            //     confirmButtonText: "ยืนยัน",
            //     cancelButtonText: "ยกเลิก"
            // }).then(async (result) => {
            //     if (result.isConfirmed) {
            //         let response;
                    
            //         if (isUpdate) {
            //             // If we have an ID, update the existing record
            //             console.log(`Updating record with ID: ${requestData.id}`);
            //             response = await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/finance/updatePurchase/${requestData.id}`, requestData);
            //         } else {
            //             // Otherwise create a new record
            //             console.log("Creating new record");
            //             response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/finance/submitPurchase`, requestData);
            //         }
                    
            //         console.log("API response:", response.data);
                    
            //         if (response.data.statusCode === 200) {
            //             Swal.fire({
            //                 title: isUpdate ? "อัปเดตข้อมูลสำเร็จ" : "บันทึกข้อมูลสำเร็จ",
            //                 text: isUpdate ? "ข้อมูลถูกอัปเดตเรียบร้อยแล้ว" : "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
            //                 icon: "success"
            //             }).then(() => {
            //                 router.push('/finance/work');
            //             });
            //         } else {
            //             Swal.fire({
            //                 title: "เกิดข้อผิดพลาด",
            //                 text: response.data.message,
            //                 icon: "error"
            //             });
            //         }
            //     }
            // });
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                icon: "error"
            });
        }
    };

    return (
        <div className="flex flex-col p-5">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                เลขตีราคา
                            </label>
                            <p>{purchaseFinanceData.book_number}</p>
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                ชื่อเซลล์
                            </label>
                            {purchaseFinanceData.d_purchase_emp?.[0]?.user?.fullname}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                วันที่/เวลา
                            </label>
                            {Bookdate && <p>{Bookdate}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm">
                                invoice & Packinglist No.
                            </label>
                        </div>



                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm">
                            เลข Shipment
                            </label>

                            {purchaseFinanceData.d_shipment_number}
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm">
                             สถานะใบจอง
                            </label>

                            {purchaseFinanceData.d_status}
                        </div>
                    </div>

                    

                    <hr className="mb-5" />

                    <ChineseExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

                    <hr className="mb-5 mt-10" />

                    <DOExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />


                    <hr className="mb-5 mt-10" />

                    <ThaiExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

               
                    <hr className="mb-5 mt-10" />

                    <AdditionalThaiExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

                    <hr className="mb-5 mt-10" />

                    <PaymentSummary control={control} errors={errors} watch={watch} setValue={setValue} />

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 ease-in-out"
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default FormPaymentComponent;