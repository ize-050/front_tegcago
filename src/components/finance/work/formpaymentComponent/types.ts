import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface FormPaymentProps {
    BookingId: string;
}

export interface ExpenseFormProps {
    control: Control<any>;
    errors: any;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
}

export interface ChineseExpenseData {
    ch_freight: number;
    ch_rate: number;
    ch_freight_total: number;
}

export interface ThaiExpenseData {
    th_duty: number;
    th_tax: number;
    th_custom_fees: number;
    th_overtime: number;
    th_employee: number;
    th_warehouse: number;
    th_gasoline: number;
    th_other_shipping: number;
    th_hairy: number;
    th_head_tractor: number;
    th_price_head_tractor: number;
    th_other_fee: number;
    th_total_shipping: number;
}

export interface DOExpenseData {
    amount_payment_do: number;
    price_deposit: number;
    date_return_cabinet?: string;
    price_return_cabinet?: number;
}

export interface PaymentSummaryData {
    total_all_th: number;
    total_payment_all: number;
    billing_amount: number;
    miss_payment: number;
    th_cn_total: number;
}