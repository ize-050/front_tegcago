"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import { numberFormatTh } from "@/utils/numberFormat";
import { getCustomerAccounts } from "@/services/finance";

// Helper function to parse formatted number back to number
const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/,/g, ''));
};

export interface ReceiptForm {
  date: string;
  title: string;
  account: string;
  amountRMB: number | string;
  formattedAmountRMB?: string; // For display purposes
  amountTHB: number | string;
  formattedAmountTHB?: string; // For display purposes
  transferDate: string;
  exchangeRate: string;
  details: string;
  files?: File[];
  existingTransferSlip?: string;
}



interface ReceiptFormProps {
  onSubmit: (data: ReceiptForm) => void;
  initialData?: ReceiptForm;
}

const ReceiptFormComponent: React.FC<ReceiptFormProps> = ({ onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<ReceiptForm>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      title: '',
      account: '',
      amountRMB: '',
      formattedAmountRMB: '',
      amountTHB: '',
      formattedAmountTHB: '',
      transferDate: new Date().toISOString().split("T")[0],
      exchangeRate: '',
      details: '',
    },
  });

  const [formattedAmount, setFormattedAmount] = useState('');

  const [accountOptions, setAccountOptions] = useState<any[]>([]);

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

  // Handle formatted amount change
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

  // Watch for changes in amountRMB to update formatted value
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'amountRMB') {
        setFormattedAmount(numberFormatTh(value.amountRMB || 0));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFileUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    setValue("files", files);
  };

  // Watch for changes in RMB amount and exchange rate
  const amountRMB = useWatch({ control, name: "amountRMB" });
  const exchangeRate = useWatch({ control, name: "exchangeRate" });

  // Calculate THB amount when RMB or exchange rate changes
  useEffect(() => {
    const rate = parseFloat(exchangeRate) || 0;
    const rmb = parseFloat(amountRMB.toString()) || 0;
    const thbAmount = rate * rmb;
    setValue('amountTHB', thbAmount);
    setValue('formattedAmountTHB', numberFormatTh(thbAmount));
  }, [amountRMB, exchangeRate, setValue]);

  useEffect(() => {
    setValue('formattedAmountRMB', numberFormatTh(amountRMB));
  }, [amountRMB, setValue]);

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

        <div className="grid grid-cols-2 gap-4 col-span-2">
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
                    
                    // Update THB amount if exchange rate exists
                    const rate = parseFloat(exchangeRate) || 0;
                    const rmb = parseFloat(formattedValue) || 0;
                    const thbAmount = rate * rmb;
                    setValue('amountTHB', thbAmount.toFixed(2));
                  }}
                  onBlur={() => {
                    // Format to 2 decimal places when leaving the field
                    if (value !== '' && value !== null && value !== undefined) {
                      const numValue = typeof value === 'string' ? parseFloat(value) : value;
                      onChange(numValue.toFixed(2));
                      setValue('amountRMB', numValue.toFixed(2));
                      
                      // Update THB amount
                      const rate = parseFloat(exchangeRate) || 0;
                      const thbAmount = rate * numValue;
                      setValue('amountTHB', thbAmount.toFixed(2));
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
              อัตราแลกเปลี่ยน
            </label>
            <Controller
              name="exchangeRate"
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
                      setValue('exchangeRate', '');
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
                    setValue('exchangeRate', formattedValue);
                    
                    // Update THB amount
                    const rate = parseFloat(formattedValue) || 0;
                    const rmb = parseFloat(amountRMB as string) || 0;
                    const thbAmount = rate * rmb;
                    setValue('amountTHB', thbAmount.toFixed(2));
                  }}
                  onBlur={() => {
                    // Format to 2 decimal places when leaving the field
                    if (value !== '' && value !== null && value !== undefined) {
                      const numValue = parseFloat(value);
                      onChange(numValue.toFixed(2));
                      setValue('exchangeRate', numValue.toFixed(2));
                      
                      // Update THB amount
                      const rmb = parseFloat(amountRMB as string) || 0;
                      const thbAmount = numValue * rmb;
                      setValue('amountTHB', thbAmount.toFixed(2));
                    }
                  }}
                  value={value}
                  placeholder="0.00"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                    errors.exchangeRate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              )}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              จำนวนเงิน (THB)
            </label>
            <Controller
              name="amountTHB"
              control={control}
              render={({ field: { value } }) => (
                <input
                  type="text"
                  value={typeof value === 'number' ? value.toFixed(2) : value}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                  disabled
                />
              )}
            />
          </div>
        </div>

        <div className="col-span-2">
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

export default ReceiptFormComponent;
