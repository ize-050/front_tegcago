"use client";

import { Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { getCustomerAccounts, getCompanyAccounts } from "@/services/finance";

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
  formattedAmount?: string;
  formattedExchangeRateProfit?: string;
  formattedIncomePerTransaction?: string;
}

// Export CustomerDepositForm interface for backward compatibility with ModalComponent
export interface CustomerDepositForm extends ExchangeForm {}

// กำหนด interface สำหรับ company account

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
    totalDepositAmount?: number;
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
  const [accountOptions, setAccountOptions] = useState<any[]>([]);
 
  // ดึงข้อมูลบัญชีลูกค้า
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accounts = await getCustomerAccounts();
        setAccountOptions(accounts as any[]);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

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

    // กำไรอัตราแลกเปลี่ยน = ยอดฝากชำระรวม (ของข้อมูลลูกค้าฝากชำระ) - จำนวนเงิน (THB) (ของข้อมูลการโอน)
    let exchangeRateProfit = 0;
    if(customerDepositData?.totalDepositAmount && calculatedAmount > 0){
      // ใช้ totalDepositAmount จากข้อมูลลูกค้าฝากชำระ และ calculatedAmount ที่เพิ่งคำนวณ
      const totalDepositAmount = parseFloat(customerDepositData?.totalDepositAmount?.toString() || "0");
      exchangeRateProfit = totalDepositAmount - calculatedAmount;
    }

    setValue('exchange.exchangeRateProfit', exchangeRateProfit);
    setValue('exchange.formattedExchangeRateProfit', formatNumber(exchangeRateProfit));

    // รายรับต่อรายการธุรกรรม = จำนวนเงิน (THB) ของข้อมูลลูกค้าฝากชำระ - จำนวนเงิน (THB) ของข้อมูลการโอน
    let incomePerTransaction = 0;
    if(customerDepositData?.amount && calculatedAmount > 0){
      // ใช้ amount จากข้อมูลลูกค้าฝากชำระ และ calculatedAmount ที่เพิ่งคำนวณ
      const customerAmount = parseFloat(customerDepositData?.amount?.toString() || "0");
      incomePerTransaction = customerAmount - calculatedAmount;
    }
    setValue('exchange.incomePerTransaction', incomePerTransaction);
    setValue('exchange.formattedIncomePerTransaction', formatNumber(incomePerTransaction));
    
    // จัดรูปแบบ amount ด้วย
    setValue('exchange.formattedAmount', formatNumber(calculatedAmount));
  }, [amountRMB, priceDifference, exchangeRate, fee, setValue, exchangeData?.amountRMB, exchangeData?.exchangeRate, exchangeData?.fee, customerDepositData?.amountRMB, customerDepositData?.exchangeRate, customerDepositData?.fee, customerDepositData?.amount, customerDepositData?.totalDepositAmount]);

  // ฟังก์ชันสำหรับจัดรูปแบบตัวเลขให้มีเครื่องหมายคั่นหลักพัน (,) และมีทศนิยม 2 ตำแหน่ง (.00)
  const formatNumber = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === '') return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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
            render={({ field }) => (
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...field}
              >
                <option value="">เลือกบัญชี</option>
                {accountOptions.map((option:any) => (
                  <option key={option.id} value={option.finance_name}>
                    {option.finance_name}
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
            <p className="mt-1 text-sm text-red-500">{errors.exchange?.amountRMB?.message as string}</p>
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
            name="exchange.formattedAmount"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
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
            name="exchange.formattedExchangeRateProfit"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
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
            name="exchange.formattedIncomePerTransaction"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
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
