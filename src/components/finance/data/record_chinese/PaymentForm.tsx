"use client";

import { useForm, Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { getCustomerAccounts } from "@/services/finance";
import { numberFormatTh } from "@/utils/numberFormat";

// Helper function to parse formatted number back to number
const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/,/g, ''));
};

export interface PaymentForm {
  date: string;
  title: string;
  account: string;
  payTo: string;
  transferDate: string;
  amountRMB: number | string; // Updated to allow both number and string
  formattedAmountRMB?: string; // For display purposes
  details: string;
  files?: File[];
  existingTransferSlip?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentForm) => void;
  initialData?: PaymentForm;
}

const PaymentFormComponent: React.FC<PaymentFormProps> = ({ onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm<PaymentForm>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      title: '',
      account: '',
      payTo: '',
      transferDate: new Date().toISOString().split("T")[0],
      amountRMB: 0,
      formattedAmountRMB: '0.00',
      details: '',
    },
  });

  const [accountOptions, setAccountOptions] = useState([]);
  const [formattedAmount, setFormattedAmount] = useState('0.00');
  
useEffect(() => {
  const fetchAccounts = async () => {
    try {
      const accounts :any = await getCustomerAccounts();
      setAccountOptions(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };
  
  fetchAccounts();
}, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      
      // If there's an existing transfer slip, make sure it's properly set
      if (initialData.existingTransferSlip) {
        setValue("existingTransferSlip", initialData.existingTransferSlip);
      }
      
      // Format the amount RMB
      if (initialData.amountRMB !== undefined) {
        setFormattedAmount(numberFormatTh(initialData.amountRMB));
      }
    }
  }, [initialData, reset, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'amountRMB') {
        setFormattedAmount(numberFormatTh(value.amountRMB || 0));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFormattedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value;
    // Allow empty input or numeric input with decimal point and commas
    if (formatted === '' || /^[0-9,]*\.?[0-9]*$/.test(formatted)) {
      setFormattedAmount(formatted);
      // Parse the formatted value back to a number for the form data
      const numericValue = parseFormattedNumber(formatted);
      setValue('amountRMB', numericValue);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            วันที่ทำรายการ
          </label>
          <Controller
            name="date"
            control={control}
            rules={{ required: "กรุณาระบุวันที่" }}
            render={({ field }) => (
              <input
                type="date"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            บัญชี
          </label>
          <Controller
            name="account"
            control={control}
            rules={{ required: "กรุณาเลือกบัญชี" }}
            render={({ field }) => (
              <select
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.account ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            หัวข้อ
          </label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "กรุณาระบุหัวข้อ" }}
            render={({ field }) => (
              <input
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ผู้รับเงิน
          </label>
          <Controller
            name="payTo"
            control={control}
            rules={{ required: "กรุณาระบุผู้รับเงิน" }}
            render={({ field }) => (
              <input
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.payTo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
              />
            )}
          />
        </div>

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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนเงิน (RMB)
          </label>
          <Controller
            name="amountRMB"
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  
                  // Allow empty value for deletion
                  if (inputValue === '') {
                    onChange('');
                    setValue('amountRMB', '');
                    return;
                  }
                  
                  // Allow only numbers and decimal point
                  if (!/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
                    return; // Invalid input, don't update
                  }
                  
                  // Limit to 2 decimal places if there's a decimal point
                  let formattedValue = inputValue;
                  if (inputValue.includes('.')) {
                    const [whole, decimal] = inputValue.split('.');
                    formattedValue = `${whole}.${decimal.slice(0, 2)}`;
                  }
                  
                  onChange(formattedValue);
                  setValue('amountRMB', formattedValue);
                }}
                onBlur={() => {
                  // Format to 2 decimal places when leaving the field
                  if (value !== '' && value !== null && value !== undefined) {
                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                    onChange(numValue.toFixed(2));
                    setValue('amountRMB', numValue.toFixed(2));
                  }
                }}
                value={typeof value === 'number' ? value.toFixed(2) : value}
                placeholder="0.00"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            รายละเอียด
          </label>
          <Controller
            name="details"
            control={control}
            render={({ field }) => (
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                {...field}
              />
            )}
          />
        </div>


        <div>
          <label>แนบหลักฐานการโอน</label>
          <Controller
            name="existingTransferSlip"
            control={control}
            render={({ field }) => (
              <UploadImageComponent
                setValue={setValue}
                control={control}
              ></UploadImageComponent>
            )}
          />
        </div>

      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          บันทึก
        </Button>
      </div>
    </form>
  );
};

export default PaymentFormComponent;
