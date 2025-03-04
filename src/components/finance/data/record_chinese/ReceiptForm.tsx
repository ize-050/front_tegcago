"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect } from "react";
import Button from "@/components/Base/Button";
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";


export interface ReceiptForm {
  date: string;
  title: string;
  account: string;
  amountRMB: number;
  amountTHB: number;
  transferDate: string;
  exchangeRate: string;
  details: string;
  files?: File[];
  existingTransferSlip?: string;
}

const accountOptions = [
  { value: 'ahyong', label: 'อาหยอง' },
  { value: 'ginny', label: 'จินนี่' }
];

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
    formState: { errors }
  } = useForm<ReceiptForm>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      title: '',
      account: '',
      amountRMB: 0,
      amountTHB: 0,
      transferDate: new Date().toISOString().split("T")[0],
      exchangeRate: '',
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
  }, [amountRMB, exchangeRate, setValue]);

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
              rules={{ required: "กรุณาระบุจำนวนเงิน" }}
              render={({ field }) => (
                <input
                  type="number"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                    errors.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
              render={({ field }) => (
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
                    errors.exchangeRate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
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
              render={({ field }) => (
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                  {...field}
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
