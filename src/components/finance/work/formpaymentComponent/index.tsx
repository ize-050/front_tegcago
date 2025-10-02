import React, { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import moment from "moment";
import { customerData } from "@/stores/customer";
import { numberFormatTh, numberFormatAllth, numberFormatcn, numberFormatTH_CN } from "@/utils/numberFormat";
import { getSelectCustomer } from "@/services/customer";
import FormTablePaymentComponent from '@/components/finance/work/FormTablePaymentComponent';
import { financeData, setPaymentRows } from "@/stores/finance";
import ChineseExpenseForm from './ChineseExpenseForm';
import ThaiExpenseForm from './ThaiExpenseForm';
import DOExpenseForm from './DOExpenseForm';
import PaymentSummary from './PaymentSummary';
import AdditionalThaiExpenseForm from './AdditionalThaiExpenseForm';

// axios
import axios from '../../../../../axios';
import { getWidhdrawalInformationByShipmentNumber, getWorkByid } from "@/services/finance";

//lib
import Swal from "sweetalert2"

const FormPaymentComponent = ({ BookingId }: any) => {
    const appDispatch = useAppDispatch();
    const reduxDispatch = useDispatch();
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
    const { paymentRows } = useSelector((state: any) => state.financeReducer);
    const [openTag, setOpenTag] = useState<boolean>(false);
    const [data, setData] = useState<Partial<any>>({});
    const [Bookdate, SetBookingDate] = useState<string>(
        moment().format("DD/MM/DD HH:mm")
    );

    const [paymentDetails, setPaymentDetails] = useState<any[]>([]);

    const getWork = async () => {
        const work_by_id: any = await getWorkByid(BookingId as string);

        console.log("work_by_id", work_by_id);
        console.log("cs_purchase data:", work_by_id?.cs_purchase);
        console.log("d_purchase data:", work_by_id?.d_purchase);
        console.log("d_purchase.cs_purchase data:", work_by_id?.d_purchase?.cs_purchase);
        console.log("d_purchase.d_agentcy data:", work_by_id?.d_purchase?.d_agentcy);
        if (work_by_id) {
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
            setValue('th_shipping_remaining',work_by_id.th_shipping_remaining || '0');
            setValue('th_shipping_return_to', work_by_id.th_shipping_return_to || '');
            setValue('shipping_advance_status', work_by_id.shipping_advance_status || '');
                
            // Port expenses
            setValue('th_port_name', work_by_id.th_port_name || '');
            setValue('th_port_fee', work_by_id.th_port_fee || '0');
            setValue('th_port_note',work_by_id.th_port_note || '');
            setValue('th_lift_on_off', work_by_id.th_lift_on_off || '0');
            setValue('th_ground_fee', work_by_id.th_ground_fee || '0');
            setValue('th_port_other_fee', work_by_id.th_port_other_fee || '0');
            setValue('th_price_head_tractor', work_by_id.th_price_head_tractor || '0');
            setValue('th_total_port_fee', work_by_id.th_total_port_fee || '0');
            
            // D/O Expenses
            setValue('amount_payment_do', work_by_id.amount_payment_do || '0');
            setValue('price_deposit', work_by_id.price_deposit || '0');
            
            // Chinese Expenses
            console.log("work_by_id_ch_freight", work_by_id.ch_freight)
            setValue('ch_freight', Number(work_by_id?.ch_freight || 0));
            setValue('ch_exchange_rate', Number(work_by_id?.ch_exchange_rate || 0));
            setValue('ch_freight_total', Number(work_by_id?.ch_freight_total || 0));

            // Billing and Payment
            setValue('total_before_vat', work_by_id.total_before_vat || '0');
            setValue('billing_amount', work_by_id.billing_amount || '0');
            setValue('total_payment_all', work_by_id.total_payment_all || '0');
            setValue('miss_payment', work_by_id.miss_payment || '0');
            setValue('has_vat', work_by_id.has_vat === true || work_by_id.has_vat === 1);

            // Calculations
            setValue('profit_loss', work_by_id.profit_loss || '0');
            setValue('price_service', work_by_id.price_service || '0');
            setValue('total_profit_loss', work_by_id.total_profit_loss || '0');
            setValue('text_profit_loss', work_by_id.text_profit_loss || '');

            setValue('th_check_fee',work_by_id.th_check_fee);
            setValue('th_license_fee',work_by_id.th_license_fee);
            setValue('th_product_account',work_by_id.th_product_account);
           

            // Status
            setValue('payment_status', work_by_id?.payment_prefix?.payment_status);
            // ข้อมูลการชำระเงิน - ใช้ payment_details ที่เพิ่มมาใหม่
            if (work_by_id.payment_details && Array.isArray(work_by_id.payment_details)) {
                // เก็บข้อมูลการชำระเงินในรูปแบบใหม่
                const details = work_by_id.payment_details.map((detail: any) => ({
                    payment_date: detail.payment_date || '',
                    payment_amount: detail.payment_amount || '0',
                    payment_percentage: detail.payment_percentage || '0',
                    remaining_amount: detail.remaining_amount || '0'
                }));
                
                // อัพเดท paymentRows state ให้แสดงแถวตามจำนวนข้อมูลที่มี
                const newPaymentRows = details.map((_: any, index: number) => index + 1);
                if (newPaymentRows.length > 0) {
                    // อัพเดท Redux store ด้วย payment rows ใหม่
                    appDispatch(setPaymentRows(newPaymentRows));
                    
                    // ตั้งค่าข้อมูลในฟอร์มสำหรับแต่ละแถว
                    details.forEach((detail: any, index: number) => {
                        const rowNumber = index + 1;
                        setValue(`payment_date_${rowNumber}`, detail.payment_date);
                        setValue(`payment_amount_${rowNumber}`, detail.payment_amount);
                        setValue(`remaining_amount_${rowNumber}`, detail.remaining_amount);
                    });
                    
                    // คำนวณยอดรวมการชำระเงิน
                    const totalPayment = details.reduce((sum: number, detail: any) => 
                        sum + Number(detail.payment_amount), 0);
                    setValue('total_payment_all', totalPayment);
                    
                    // คำนวณยอดคงค้าง
                    const billingAmount = Number(watch('billing_amount') || 0);
                    setValue('miss_payment', billingAmount - totalPayment);
                }
            }
            
            setValue('payment_status', work_by_id.payment_status || 'รอตรวจสอบ');
            
            // ข้อมูลคืนภาษีจากตู้
            setValue('tax_return_checked', work_by_id.payment_prefix?.tax_return_checked || false);
            setValue('tax_return_amount', work_by_id.payment_prefix?.tax_return_amount || '0');
            setValue('tax_return_date', work_by_id.payment_prefix?.tax_return_date || '');
            
            // ข้อมูลกำไรและค่าบริหารจัดการ

            setValue('th_port_note',work_by_id.th_port_note);
            setValue('th_shipping_note',work_by_id.th_shipping_note);

            setValue('management_fee', work_by_id.payment_prefix?.management_fee || 0);
            setValue('percentage_fee', work_by_id.payment_prefix?.percentage_fee || 0);
            setValue('net_profit', work_by_id.net_profit || '0');
        }
    };

    // ฟังก์ชันสำหรับดึงข้อมูลจากตาราง withdrawalinformation
    const getWithdrawalInfo = async (purchaseId: string) => {
        try {
            const withdrawalInfo: any = await getWidhdrawalInformationByShipmentNumber(purchaseId);
            console.log("Withdrawal Information:", withdrawalInfo);
            
            if (withdrawalInfo){
                // ใช้ข้อมูลล่าสุด (หรือข้อมูลแรก ขึ้นอยู่กับการจัดเรียงข้อมูลจาก API)
                const latestInfo = withdrawalInfo;
                
                // ตั้งค่าวันที่เบิกและวันที่เตรียมจ่ายเงิน Shipping เบิก
                setValue('withdrawal_date', latestInfo.withdrawal_date ? moment(latestInfo.withdrawal_date).format('YYYY-MM-DD') : '');
                setValue('shipping_payment_date', latestInfo.transfer_date ? moment(latestInfo.transfer_date).format('YYYY-MM-DD') : '');
                
                console.log("Set withdrawal_date:", latestInfo.withdrawal_date);
                console.log("Set shipping_payment_date:", latestInfo.transfer_date);
            }
        } catch (error) {
            console.error("Error fetching withdrawal information:", error);
        }
    };

    useEffect(() => {
        (async () => {
            if (BookingId) {
                await getWork();
                // ดึงข้อมูลจากตาราง withdrawalinformation
                await getWithdrawalInfo(BookingId);
                // เพิ่ม console.log เพื่อดูข้อมูลที่ได้รับจาก API หลังจากที่ข้อมูลถูกเซ็ตใน state
                console.log("purchaseFinanceData after set:", purchaseFinanceData);
            }
        })();
    }, []);
    
    // เพิ่ม useEffect เพื่อ log ข้อมูลทุกครั้งที่ purchaseFinanceData เปลี่ยนแปลง
    useEffect(() => {
        console.log("purchaseFinanceData updated:", purchaseFinanceData);
    }, [purchaseFinanceData]);

    const handlePaymentRowsChange = (rows: number[]) => {
        // Update Redux store
        reduxDispatch(setPaymentRows(rows));
    };

    const calculateTotalShipping = useCallback(() => {
        const total =
            Number(watch('th_duty') || 0) +
            Number(watch('th_tax') || 0) +
            Number(watch('th_custom_fees') || 0) +
            Number(watch('th_employee') || 0) +
            Number(watch('th_warehouse') || 0) +
            Number(watch('th_gasoline') || 0) +
            // Number(watch('th_hairy') || 0) +
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
            let withdrawal_information :any = await getWidhdrawalInformationByShipmentNumber(BookingId);
            if(withdrawal_information && withdrawal_information.withdrawal_amount !== null){
                setValue('th_shipping_advance', withdrawal_information.withdrawal_amount);
            }
        })();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            console.log("data", data)
            console.log("purchaseFinanceData", purchaseFinanceData)
            console.log("paymentRows", paymentRows)

            // สร้าง array เก็บข้อมูลการชำระเงินแต่ละครั้ง
            const payment_details = paymentRows.map((rowNumber: number) => {
                const detail = {
                    payment_date: data[`payment_date_${rowNumber}`],
                    payment_amount: Number(data[`payment_amount_${rowNumber}`]),
                    remaining_amount: Number(data[`remaining_amount_${rowNumber}`])
                };
                return detail;
            });

            // ฟังก์ชันช่วยในการแปลงค่าให้เป็น string หรือ null ถ้าไม่มีค่า
            const safeToString = (value: any) => {
                if (value === undefined || value === null || value === '') {
                    return null;
                }
                return value.toString();
            };

            const requestData = {
                id: purchaseFinanceData?.purchase_finance?.[0]?.id || purchaseFinanceData?.id,
                purchase_id: purchaseFinanceData?.purchase_id,
                work_id: BookingId, 
                
                amount_payment_do: safeToString(data.amount_payment_do),
                price_deposit: safeToString(data.price_deposit),
                
                th_overtime: safeToString(data.th_overtime),
                th_employee: safeToString(data.th_employee),
                th_warehouse: safeToString(data.th_warehouse),
                th_gasoline: safeToString(data.th_gasoline),
                th_duty: safeToString(data.th_duty),
                th_custom_fees: safeToString(data.th_custom_fees),
                th_tax: safeToString(data.th_tax),
                th_hairy: safeToString(data.th_hairy),
                th_check_fee: safeToString(data.th_check_fee),
                th_product_account: safeToString(data.th_product_account),
                th_license_fee: safeToString(data.th_license_fee),
                th_other_fee: safeToString(data.th_other_fee),
                th_port_note: safeToString(data.th_port_note),
                
                // Shipping expenses
                th_shipping_price: data.th_shipping,
                th_total_shipping: safeToString(data.th_total_shipping),
                th_shipping_note: safeToString(data.th_shipping_note),
                th_shipping_advance: safeToString(data.th_shipping_advance),
                th_shipping_remaining: safeToString(data.th_shipping_remaining),
                th_shipping_return_to: safeToString(data.th_shipping_return_to),
                shipping_advance_status: safeToString(data.shipping_advance_status), // เพิ่มสถานะ Shipping เบิก
                payment_status: data.payment_status,
                
                // Port expenses
                th_port_name: safeToString(data.th_port_name),
                th_port_fee: safeToString(data.th_port_fee),
                th_lift_on_off: safeToString(data.th_lift_on_off),
                th_ground_fee: safeToString(data.th_ground_fee),
                th_port_other_fee: safeToString(data.th_port_other_fee),
                th_price_head_tractor: data.th_price_head_tractor,
                th_total_port_fee: safeToString(data.th_total_port_fee),
                
                // Chinese Expenses
                ch_freight: safeToString(data.ch_freight),
                ch_exchange_rate: safeToString(data.ch_exchange_rate),
                ch_freight_total: safeToString(data.ch_freight_total),
                
                // Billing and Payment
                total_before_vat: safeToString(data.total_before_vat),
                has_vat: data.has_vat || false, // เพิ่มฟิลด์ has_vat
                billing_amount: safeToString(data.billing_amount),
                total_payment_all: safeToString(data.total_payment_all),
                miss_payment: safeToString(data.miss_payment),
                
                // Calculations
                profit_loss: safeToString(data.profit_loss),
                price_service: data.price_service,
                total_profit_loss: data.total_profit_loss,
                text_profit_loss: data.text_profit_loss,
                
                // Status
                finance_status: data.finance_status,
                
                // ข้อมูลคืนภาษีจากตู้
                tax_return_checked: data.tax_return_checked,
                tax_return_amount: safeToString(data.tax_return_amount),
                tax_return_date: data.tax_return_date,
                
                // ข้อมูลกำไรและค่าบริหารจัดการ
                management_fee: safeToString(data.management_fee),
                percentage_fee: safeToString(data.percentage_fee),
                net_profit: safeToString(data.net_profit),
                
                // ข้อมูลการชำระเงินแต่ละรายการ
                payment_details: payment_details
            };

            console.log("Request Data:", requestData);

            // ถ้ามี id แสดงว่าเป็นการอัพเดท
            if (data.id) {
                const result = await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/finance/updatePurchase/${requestData.id}`, requestData);
                console.log("Update Result:", result);
                
                if (result.data.statusCode === 200) {
                    Swal.fire({
                        title: "อัปเดตข้อมูลสำเร็จ",
                        text: "ข้อมูลถูกอัปเดตเรียบร้อยแล้ว",
                        icon: "success"
                    }).then(() => {
                        router.push('/finance/work');
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: result.data.message,
                        icon: "error"
                    });
                }
            } else {
                // ถ้าไม่มี id แสดงว่าเป็นการสร้างใหม่
                const result = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/finance/submitPurchase`, requestData);
                console.log("Submit Result:", result);
                
                if (result.data.statusCode === 200) {
                    Swal.fire({
                        title: "บันทึกข้อมูลสำเร็จ",
                        text: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
                        icon: "success"
                    }).then(() => {
                        router.push('/finance/work');
                    });
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: result.data.message,
                        icon: "error"
                    });
                }
            }
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
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                ประเภท Shipment
                            </label>
                            <p>{purchaseFinanceData.d_transport || '-'}</p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm">
                            เลข Shipment
                            </label>
                            <p>{purchaseFinanceData.d_shipment_number}</p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm">
                             สถานะใบจอง
                            </label>
                            <p>{purchaseFinanceData.d_status}</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                Container no
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี cs_purchase และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.cs_purchase)) {
                                        // ค้นหา item ที่มี receive
                                        const item = purchaseFinanceData.cs_purchase.find((item: any) => item?.receive);
                                        return item?.receive?.container_no || '-';
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                B/L no
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี cs_purchase และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.cs_purchase)) {
                                        // ค้นหา item ที่มี provedeparture
                                        const item = purchaseFinanceData.cs_purchase.find((item: any) => item?.provedeparture);
                                        return item?.provedeparture?.bl_no || '-';
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                Consignee
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี cs_purchase และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.cs_purchase)) {
                                        // ค้นหา item ที่มี bookcabinet
                                        const item = purchaseFinanceData.cs_purchase.find((item: any) => item?.bookcabinet);
                                        return item?.bookcabinet?.consignee || '-';
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                Agency
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี d_agentcy และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.d_agentcy)) {    
                                        // ค้นหา agency ที่มี d_sale_agentcy
                                        const agency = purchaseFinanceData?.d_agentcy.find((a: any) => a?.d_sale_agentcy?.length > 0);
                                        if (agency?.d_sale_agentcy?.[0]?.d_agentcy?.agentcy) {
                                            return agency.d_sale_agentcy[0].d_agentcy.agentcy.agent_name || '-';
                                        }
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                สายเรือ
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี d_agentcy และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.d_agentcy)) {
                                        // ค้นหา agency ที่มี d_sale_agentcy
                                        const agency = purchaseFinanceData.d_agentcy.find((a: any) => a?.d_sale_agentcy?.length > 0);
                                        if (agency?.d_sale_agentcy?.[0]?.d_agentcy) {
                                            return agency.d_sale_agentcy[0].d_agentcy.agent_boat || '-';
                                        }
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                ETD
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี d_agentcy และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.d_agentcy)) {
                                        // ค้นหา agency ที่มี d_sale_agentcy
                                        const agency = purchaseFinanceData.d_agentcy.find((a: any) => a?.d_sale_agentcy?.length > 0);
                                        if (agency?.d_sale_agentcy?.[0]?.d_agentcy?.agentcy_eta) {
                                            return moment(agency.d_sale_agentcy[0].d_agentcy.agentcy_eta).format('DD/MM/YYYY');
                                        }
                                    }
                                    return '-';
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-gray-700 text-sm font-semibold">
                                ETA
                            </label>
                            <p>
                                {(() => {
                                    // ตรวจสอบว่ามี d_agentcy และเป็น array หรือไม่
                                    if (Array.isArray(purchaseFinanceData?.d_agentcy)) {
                                        // ค้นหา agency ที่มี d_sale_agentcy
                                        const agency = purchaseFinanceData.d_agentcy.find((a: any) => a?.d_sale_agentcy?.length > 0);
                                        if (agency?.d_sale_agentcy?.[0]?.d_agentcy?.agentcy_etd) {
                                            return moment(agency.d_sale_agentcy[0].d_agentcy.agentcy_etd).format('DD/MM/YYYY');
                                        }
                                    }
                                    return '-';
                                })()}
                            </p>
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

                    <PaymentSummary 
                        control={control} 
                        watch={watch} 
                        setValue={setValue} 
                        errors={errors}
                        onPaymentRowsChange={handlePaymentRowsChange}
                    />

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