"use client";

import { useForm, Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";

export interface PaymentForm {
  date: string;
  title: string;
  account: string;
  payTo: string;
  transferDate: string;
  amountRMB: number;
  details: string;
  files?: File[];
  existingTransferSlip?: string;
}

const accountOptions = [
  { value: 'ahyong', label: 'อาหยอง' },
  { value: 'ginny', label: 'จินนี่' }
];

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
    reset
  } = useForm<PaymentForm>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      title: '',
      account: '',
      payTo: '',
      transferDate: new Date().toISOString().split("T")[0],
      amountRMB: 0,
      details: '',
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
                {accountOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
            rules={{ required: "กรุณาระบุจำนวนเงิน" }}
            render={({ field }) => (
              <input
                type="number"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                  errors.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                {...field}
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
