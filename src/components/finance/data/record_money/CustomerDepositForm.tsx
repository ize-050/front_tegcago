"use client";

import { Controller, useWatch } from "react-hook-form";
import { useEffect } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

export interface ExchangeForm {
  amountRMB: number;
  priceDifference: number; // ส่วนต่างต่อรองราคา
  exchangeRate: number;
  fee: number;
  amount: number;
  vat: number;
  totalWithVat: number;
  transferDate: string;
  receivingAccount: string; // บัญชี (อาหยอง, จินนี่)
  exchangeRateProfit: number;
  incomePerTransaction: number;
  notes: string;
  files?: File[];
  existingTransferSlip?: string;
}

// Export CustomerDepositForm interface for backward compatibility with ModalComponent
export interface CustomerDepositForm extends ExchangeForm {}

const accountOptions = [
  { value: 'ayong', label: 'อาหยอง' },
  { value: 'jinny', label: 'จินนี่' }
];

interface ExchangeFormProps {
  control: any;
  setValue: any;
  errors: any;
  exchangeData?: {
    amountRMB?: number | null;
    exchangeRate?: number | null;
    fee?: number;
    amount?: number;
    vat?: number;
    totalWithVat?: number;
    transferDate?: string;
    receivingAccount?: string;
    exchangeRateProfit?: number;
    incomePerTransaction?: number;
    notes?: string;
    files?: File[];
    existingTransferSlip?: any;
  };
  loading?: boolean;
}

// For backward compatibility
interface CustomerDepositFormProps extends ExchangeFormProps {
  customerDeposit?: {
    amountRMB?: number | null;
    exchangeRate?: number | null;
    fee?: number;
    amount?: number;
    vat?: number;
    totalWithVat?: number;
    transferDate?: string;
    receivingAccount?: string;
    exchangeRateProfit?: number;
    incomePerTransaction?: number;
  };
}



const ExchangeFormComponent: React.FC<ExchangeFormProps | CustomerDepositFormProps> = ({
  control,
  setValue,
  errors,
  loading = false,
  ...props
}) => {
  // Handle both exchangeData and customerDepositData
  const exchangeData = 'exchangeData' in props ? props.exchangeData : undefined;
  const customerDepositData = 'customerDeposit' in props ? props.customerDeposit : undefined;

  const amountRMB = useWatch({ control, name: "exchange.amountRMB" });
  const priceDifference = useWatch({ control, name: "exchange.priceDifference" });
  const exchangeRate = useWatch({ control, name: "exchange.exchangeRate" });
  const fee = useWatch({ control, name: "exchange.fee" });
  const amount = useWatch({ control, name: "exchange.amount" });




  useEffect(() => {
    // Handle empty values
    if (!amountRMB && !priceDifference && !exchangeRate && !fee) {
      setValue('exchange.amount', '');
      setValue('exchange.exchangeRateProfit', '');
      setValue('exchange.incomePerTransaction', '');
      return;
    }

    const rmbAmount = amountRMB === '' ? 0 : parseFloat(amountRMB?.toString() || "0") || 0;
    const priceDiff = priceDifference === '' ? 0 : parseFloat(priceDifference?.toString() || "0") || 0;
    const rate = exchangeRate === '' ? 0 : parseFloat(exchangeRate?.toString() || "0") || 0;
    const feeAmount = fee === '' ? 0 : parseFloat(fee?.toString() || "0") || 0;

    // Amount in THB = RMB * Exchange Rate + Fee
    const calculatedAmount = rmbAmount * rate + feeAmount;
    setValue('exchange.amount', calculatedAmount > 0 ? calculatedAmount : '');

    // Exchange Rate Profit = (RMB * Exchange Rate) - (Customer RMB * Customer Exchange Rate)
    let exchangeRateProfit = 0;
    if(customerDepositData?.amountRMB && customerDepositData?.exchangeRate){
      exchangeRateProfit = (rmbAmount * rate) - (customerDepositData?.amountRMB * customerDepositData?.exchangeRate);
    }
    else{
      exchangeRateProfit = (rmbAmount * rate);
    }

    setValue('exchange.exchangeRateProfit', exchangeRateProfit > 0 ? exchangeRateProfit : exchangeRateProfit);

  

    let feeValue = exchangeData?.fee || 0;
    const incomePerTransaction = feeValue + exchangeRateProfit + priceDiff;
    setValue('exchange.incomePerTransaction', incomePerTransaction || '');
  }, [amountRMB, priceDifference, exchangeRate, fee, setValue, exchangeData?.amountRMB, exchangeData?.exchangeRate, exchangeData?.fee, customerDepositData?.amountRMB, customerDepositData?.exchangeRate, customerDepositData?.fee, customerDepositData?.amount]);

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการโอน</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            วันที่โอน
          </label>
          <Controller
            name="exchange.transferDate"
            control={control}
            rules={{ required: "กรุณาระบุวันที่โอน" }}
            render={({ field }) => (
              <input
                type="date"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.exchange?.transferDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                {...field}
              />
            )}
          />
          {errors.exchange?.transferDate && (
            <p className="mt-1 text-sm text-red-500">{errors.exchange.transferDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            บัญชี
          </label>
          <Controller
            name="exchange.receivingAccount"
            control={control}
            rules={{ required: "กรุณาเลือกบัญชี" }}
            render={({ field }) => (
              <select
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.exchange?.receivingAccount ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                {...field}
              >
                <option value="">เลือกบัญชี</option>
                {accountOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.exchange?.receivingAccount && (
            <p className="mt-1 text-sm text-red-500">{errors.exchange.receivingAccount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนเงิน (RMB)
          </label>
          <Controller
            name="exchange.amountRMB"
            control={control}
            rules={{ required: "กรุณาระบุจำนวนเงิน" }}
            render={({ field }) => (
              <input
                type="number"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.exchange?.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="กรุณากรอกจำนวนเงิน"
                {...field}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                }}
              />
            )}
          />
          {errors.exchange?.amountRMB && (
            <p className="mt-1 text-sm text-red-500">{errors.exchange.amountRMB.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ส่วนต่างต่อรองราคา
          </label>
          <Controller
            name="exchange.priceDifference"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="กรุณากรอกส่วนต่าง"
                {...field}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            อัตราแลกเปลี่ยน
          </label>
          <Controller
            name="exchange.exchangeRate"
            control={control}
            rules={{ required: "กรุณาระบุอัตราแลกเปลี่ยน" }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.exchange?.exchangeRate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="กรุณากรอกอัตราแลกเปลี่ยน"
                {...field}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                }}
              />
            )}
          />
          {errors.exchange?.exchangeRate && (
            <p className="mt-1 text-sm text-red-500">{errors.exchange.exchangeRate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ค่าธรรมเนียม
          </label>
          <Controller
            name="exchange.fee"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="กรุณากรอกค่าธรรมเนียม"
                {...field}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนเงิน (THB)
          </label>
          <Controller
            name="exchange.amount"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            กำไรอัตราแลกเปลี่ยน
          </label>
          <Controller
            name="exchange.exchangeRateProfit"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            รายรับต่อรายการธุรกรรม
          </label>
          <Controller
            name="exchange.incomePerTransaction"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                defaultValue={0}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                {...field}
              />
            )}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            ภาษีมูลค่าเพิ่ม (VAT)
          </label>
          <Controller
            name="exchange.vat"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
        </div> */}

      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          แนบหลักฐานการโอน
        </label>
        <UploadImageComponent
          setValue={setValue}
          control={control}

          existingImage={exchangeData?.existingTransferSlip}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          หมายเหตุ
        </label>
        <Controller
          name="exchange.notes"
          control={control}
          render={({ field }) => (
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={3}
              placeholder="หมายเหตุเพิ่มเติม"
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ExchangeFormComponent;

// For backward compatibility with ModalComponent
export const CustomerDepositFormComponent = ExchangeFormComponent;
