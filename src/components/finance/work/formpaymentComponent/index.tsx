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
            setValue('th_overtime', work_by_id.th_overtime || '0');
            setValue('th_employee', work_by_id.th_employee || '0');
            setValue('th_warehouse', work_by_id.th_warehouse || '0');
            setValue('th_gasoline', work_by_id.th_gasoline || '0');
            setValue('th_other_shipping', work_by_id.th_other_shipping || '0');
            setValue('th_duty', work_by_id.th_duty || '0');
            setValue('th_cn_total', work_by_id.th_cn_total || '0');
            setValue('th_custom_fees', work_by_id.th_customs_fees || '0');
            setValue('th_tax', work_by_id.th_tax || '0');
            setValue('th_shipping', work_by_id.th_shipping || '0');
            setValue('th_total_shipping', work_by_id.th_total_shipping || '0');
            setValue('th_hairy', work_by_id.th_hairy || '0');
            setValue('th_head_tractor', work_by_id.th_head_tractor || '0');
            setValue('th_price_head_tractor', work_by_id.th_price_head_tractor || '0');
            setValue('th_other_fee', work_by_id.th_other_fee || '0');
            setValue('total_all_th', work_by_id.total_all_th || '0');
            // D/O Expenses
            setValue('amount_payment_do', work_by_id.amount_payment_do || '0');
            setValue('price_deposit', work_by_id.price_deposit || '0');
            setValue('ch_freight', work_by_id.ch_freight || '0');
            setValue('ch_exchange_rate', work_by_id.ch_rate || '0');

            // Chinese Expenses
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
            Number(watch('th_other_shipping') || 0) +
            Number(watch('th_overtime') || 0);
        setValue('th_total_shipping', total);

        const totalALLTh =
            Number(total) +
            (Number(watch('price_deposit')) || 0) +
            (Number(watch('amount_payment_do')) || 0) +
            Number(watch('th_hairy')) +
            Number(watch('th_price_head_tractor')) +
            Number(watch('th_head_tractor')) +
            Number(watch('th_other_fee'));

        setValue('total_all_th', totalALLTh);
    }, [
        watch('th_duty'),
        watch('th_tax'),
        watch('th_custom_fees'),
        watch('th_employee'),
        watch('th_warehouse'),
        watch('th_gasoline'),
        watch('th_other_shipping'),
        watch('th_overtime'),
        watch('price_deposit'),
        watch('amount_payment_do'),
        watch('th_hairy'),
        watch('th_price_head_tractor'),
        watch('th_head_tractor'),
        watch('th_other_fee'),
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
        watch('th_other_shipping'),
        watch('th_overtime'),
        watch('price_deposit'),
        watch('amount_payment_do'),
        watch('th_hairy'),
        watch('th_price_head_tractor'),
        watch('th_head_tractor'),
        watch('th_other_fee'),
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
            const formData = {
                // Booking ID
                d_purchase_id: BookingId,
                id: data.id,
                // Thai Expenses
                th_overtime: String(data.th_overtime || 0),
                th_employee: String(data.th_employee || 0),
                th_warehouse: String(data.th_warehouse || 0),
                th_gasoline: String(data.th_gasoline || 0),
                th_other_shipping: String(data.th_other_shipping || 0),
                th_duty: String(data.th_duty || 0),
                th_cn_total: String(data.th_cn_total || 0),
                th_customs_fees: String(data.th_custom_fees || 0),
                th_tax: String(data.th_tax || 0),
                th_shipping: String(data.th_shipping || 0),
                th_total_shipping: String(data.th_total_shipping || 0),
                th_hairy: String(data.th_hairy || 0),
                th_head_tractor: String(data.th_head_tractor || 0),
                th_price_head_tractor: String(data.th_price_head_tractor || 0),
                th_other_fee: String(data.th_other_fee || 0),
                total_all_th: String(data.total_all_th || 0),
                // D/O Expenses
                amount_payment_do: String(data.amount_payment_do || 0),
                price_deposit: String(data.price_deposit || 0),
                ch_freight: String(data.ch_freight || 0),
                ch_rate: String(data.ch_exchange_rate || 0),
                // Chinese Expenses
                ch_freight_total: String(data.ch_freight_total || 0),

                // Billing and Payment
                total_before_vat: String(data.total_before_vat || 0),
                billing_amount: String(data.billing_amount || 0),
                total_payment_all: String(data.total_payment_all || 0),
                miss_payment: String(data.miss_payment || 0),

                // Calculations
                profit_loss: String(data.profit_loss || 0),
                price_service: String(data.price_service || 0),
                total_profit_loss: String(data.total_profit_loss || 0),
                text_profit_loss: data.text_profit_loss || '',

                // Status
                finance_status: data.finance_status || 'รอตรวจสอบ'
            };
            Swal.fire({
                title: "ต้องการรับงานใบนี้?",
                text: "ยืนยันข้อมูล",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios(`${process.env.NEXT_PUBLIC_URL_API}/finance/submitPurchase`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: formData
                        });

                        if (!response.status || response.status !== 200) {
                            throw new Error('Failed to submit data');
                        }
                        else {
                            Swal.fire({
                                title: "บันทึกข้อมูลสำเร็จ",
                                text: "ยืนยันข้อมูลสำเร็จ",
                                icon: "success",
                            }).then(() => {
                                router.push('/finance/work');
                            })
                        }

                    }
                    catch (error) {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด",
                            text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
                            icon: "error",
                        }).then(() => {
                            window.location.reload();
                        })
                    }
                }
            });

        } catch (error) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
                icon: "error",
            }).then(() => {
                window.location.reload();
            })
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
                            <p>{BookingId}</p>
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                ชื่อเซลล์
                            </label>
                            {session?.data?.fullname} ({session?.data?.role})
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
                    </div>

                    <hr className="mb-5" />

                    <ChineseExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

                    <hr className="mb-5 mt-10" />

                    <ThaiExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

                    <hr className="mb-5 mt-10" />

                    <DOExpenseForm control={control} errors={errors} watch={watch} setValue={setValue} />

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