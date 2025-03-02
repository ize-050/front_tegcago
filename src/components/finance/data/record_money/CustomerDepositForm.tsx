"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

export interface CustomerDepositForm {
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

const accountOptions = [
  { value: 'ayong', label: 'อาหยอง' },
  { value: 'jinny', label: 'จินนี่' }
];

interface CustomerDepositFormProps {
  onSubmit: (data: CustomerDepositForm) => void;
  initialData?: CustomerDepositForm;
  loading?: boolean;
}

const CustomerDepositFormComponent: React.FC<CustomerDepositFormProps> = ({ 
  onSubmit, 
  initialData, 
  loading = false 
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CustomerDepositForm>({
    defaultValues: initialData || {
      amountRMB: 0,
      priceDifference: 0,
      exchangeRate: 0,
      fee: 0,
      amount: 0,
      vat: 0,
      totalWithVat: 0,
      transferDate: new Date().toISOString().split("T")[0],
      receivingAccount: '',
      exchangeRateProfit: 0,
      incomePerTransaction: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      
      // If there's an existing transfer slip, make sure it's properly set
      if (initialData.existingTransferSlip) {
        setValue("existingTransferSlip", initialData.existingTransferSlip);
      }
    }
  }, [initialData, reset, setValue]);

  // Watch for changes in RMB amount, exchange rate, and fee
  const amountRMB = useWatch({ control, name: "amountRMB" });
  const priceDifference = useWatch({ control, name: "priceDifference" });
  const exchangeRate = useWatch({ control, name: "exchangeRate" });
  const fee = useWatch({ control, name: "fee" });
  const amount = useWatch({ control, name: "amount" });

  // Calculate amount when RMB or exchange rate changes
  useEffect(() => {
    const rmbAmount = parseFloat(amountRMB?.toString() || "0") || 0;
    const priceDiff = parseFloat(priceDifference?.toString() || "0") || 0;
    const rate = parseFloat(exchangeRate?.toString() || "0") || 0;
    const feeAmount = parseFloat(fee?.toString() || "0") || 0;
    
    // Calculate base amount
    const calculatedAmount = (rmbAmount - priceDiff) * rate - feeAmount;
    setValue('amount', calculatedAmount > 0 ? calculatedAmount : 0);
    
    // Calculate exchange rate profit (using standard rate of 5.0)
    const standardRate = 5.0;
    const exchangeRateProfit = (rmbAmount - priceDiff) * (rate - standardRate);
    setValue('exchangeRateProfit', exchangeRateProfit);
    
    // Calculate income per transaction
    const incomePerTransaction = exchangeRateProfit + feeAmount;
    setValue('incomePerTransaction', incomePerTransaction);
  }, [amountRMB, priceDifference, exchangeRate, fee, setValue]);

  // Calculate VAT and total with VAT when amount changes
  useEffect(() => {
    const baseAmount = parseFloat(amount?.toString() || "0") || 0;
    
    // Calculate VAT (7%)
    const vatAmount = baseAmount * 0.07;
    setValue('vat', vatAmount);
    
    // Calculate total with VAT
    setValue('totalWithVat', baseAmount + vatAmount);
  }, [amount, setValue]);

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการโอน</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            วันที่โอน
          </label>
          <Controller
            name="transferDate"
            control={control}
            rules={{ required: "กรุณาระบุวันที่โอน" }}
            render={({ field }) => (
              <input
                type="date"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.transferDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
              />
            )}
          />
          {errors.transferDate && (
            <p className="mt-1 text-sm text-red-500">{errors.transferDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            บัญชี
          </label>
          <Controller
            name="receivingAccount"
            control={control}
            rules={{ required: "กรุณาเลือกบัญชี" }}
            render={({ field }) => (
              <select
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.receivingAccount ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
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
          {errors.receivingAccount && (
            <p className="mt-1 text-sm text-red-500">{errors.receivingAccount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนเงิน (RMB)
          </label>
          <Controller
            name="amountRMB"
            control={control}
            rules={{ required: "กรุณาระบุจำนวนเงิน" }}
            render={({ field }) => (
              <input
                type="number"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.amountRMB && (
            <p className="mt-1 text-sm text-red-500">{errors.amountRMB.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ส่วนต่างต่อรองราคา
          </label>
          <Controller
            name="priceDifference"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            อัตราแลกเปลี่ยน
          </label>
          <Controller
            name="exchangeRate"
            control={control}
            rules={{ required: "กรุณาระบุอัตราแลกเปลี่ยน" }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.exchangeRate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.exchangeRate && (
            <p className="mt-1 text-sm text-red-500">{errors.exchangeRate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ค่าธรรมเนียม
          </label>
          <Controller
            name="fee"
            control={control}
            rules={{ required: "กรุณาระบุค่าธรรมเนียม" }}
            render={({ field }) => (
              <input
                type="number"
                step="0.01"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.fee ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.fee && (
            <p className="mt-1 text-sm text-red-500">{errors.fee.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนเงิน (THB)
          </label>
          <Controller
            name="amount"
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
            ภาษีมูลค่าเพิ่ม
          </label>
          <Controller
            name="vat"
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
            จำนวนรวมภาษีมูลค่าเพิ่ม
          </label>
          <Controller
            name="totalWithVat"
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
            name="exchangeRateProfit"
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
            รายรับต่อรายการธุรกรรม
          </label>
          <Controller
            name="incomePerTransaction"
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
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          แนบหลักฐานการโอน
        </label>
        <UploadImageComponent
          setValue={setValue}
          control={control}
          
          existingImage={initialData?.existingTransferSlip}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          หมายเหตุ
        </label>
        <Controller
          name="notes"
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

export default CustomerDepositFormComponent;
