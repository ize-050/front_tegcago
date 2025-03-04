"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { financeData, setModalRecordMoney, setEditRecord } from "@/stores/finance";
import { useForm, Controller } from "react-hook-form";
import axios from '../../../../../axios';
import Image from "next/image";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Swal from "sweetalert2";

import { CustomerDepositFormComponent, CustomerDepositForm } from './CustomerDepositForm';

import { getSalesSupportEmployees, Employee } from '@/services/finance/employee';
import UploadImageComponent from '@/components/Uploadimage/UpdateImageComponent';

interface FormData {
    date: string;
    salesperson: string;
    documentNumber: string;
    customerId: string;
    type: 'deposit' | 'order' | 'topup' | '';
    customerDeposit?: CustomerDepositForm;
    exchange?: any;
    consignmentData?: any;
}

const ModalRecordMoneyComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { modalRecordMoney, editRecord } = useAppSelector(financeData);
    const [loading, setLoading] = useState<boolean>(false);
    const [salesSupportEmployees, setSalesSupportEmployees] = useState<Employee[]>([]);
    const [employeesLoading, setEmployeesLoading] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            salesperson: '',
            documentNumber: '',
            customerId: '',
            type: '',
            customerDeposit: {
                amountRMB: 0,
                exchangeRate: 0,
                fee: 0,
                amount: 0,
                vat: 0,
                totalWithVat: 0,
                transferDate: new Date().toISOString().split("T")[0],
                receivingAccount: '',
                exchangeRateProfit: 0,
                incomePerTransaction: 0,
            },
            exchange: {
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
            }
        }
    });

    const data = watch();

    // Fetch sales support employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setEmployeesLoading(true);
                const employees = await getSalesSupportEmployees();
                setSalesSupportEmployees(employees);
            } catch (error) {
                console.error("Error fetching sales support employees:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถดึงข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ตกลง'
                });
            } finally {
                setEmployeesLoading(false);
            }
        };

        if (modalRecordMoney) {
            fetchEmployees();
        }
    }, [modalRecordMoney]);

    // Load record data when editing
    useEffect(() => {
        // const fetchRecordData = async () => {
        //     if (editRecord?.id && editRecord?.type) {
        //         try {
        //             setLoading(true);
        //             let response;
        //             if (editRecord.type === 'deposit') {
        //                 response = await axios.get(`/api/finance/record-money/${editRecord.id}`);
        //                 if (response.data) {
        //                     const recordData = response.data;
        //                     setValue('date', recordData.date || new Date().toISOString().split('T')[0]);
        //                     setValue('salesperson', recordData.salespersonId || '');
        //                     setValue('documentNumber', recordData.documentNumber || '');
        //                     setValue('customerId', recordData.customerId || '');
        //                     setValue('type', 'deposit');

        //                     // Set customer deposit specific fields
        //                     setValue('customerDeposit.amountRMB', recordData.amountRMB || 0);
        //                     setValue('customerDeposit.exchangeRate', recordData.exchangeRate || 0);
        //                     setValue('customerDeposit.fee', recordData.fee || 0);
        //                     setValue('customerDeposit.amount', recordData.amount || 0);
        //                     setValue('customerDeposit.vat', recordData.vat || 0);
        //                     setValue('customerDeposit.totalWithVat', recordData.totalWithVat || 0);
        //                     setValue('customerDeposit.transferDate', recordData.transferDate || new Date().toISOString().split('T')[0]);
        //                     setValue('customerDeposit.receivingAccount', recordData.receivingAccount || '');
        //                     setValue('customerDeposit.exchangeRateProfit', recordData.exchangeRateProfit || 0);
        //                     setValue('customerDeposit.incomePerTransaction', recordData.incomePerTransaction || 0);

        //                     if (recordData.transferSlipUrl) {
        //                         setValue('customerDeposit.existingTransferSlip', recordData.transferSlipUrl);
        //                     }
        //                 }
        //             }
        //         } catch (error) {
        //             console.error("Error fetching record data:", error);
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'เกิดข้อผิดพลาด',
        //                 text: 'ไม่สามารถดึงข้อมูลรายการได้ กรุณาลองใหม่อีกครั้ง',
        //                 confirmButtonText: 'ตกลง'
        //             });
        //         } finally {
        //             setLoading(false);
        //         }
        //     }
        // };

        // if (modalRecordMoney && editRecord?.id) {
        //     fetchRecordData();
        // }
    }, [modalRecordMoney, editRecord, setValue]);

    const onClose = () => {
        dispatch(setModalRecordMoney(false));
        dispatch(setEditRecord({ id: null, type: null }));
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            console.log('Form data submitted:', data);

            let transferSlipUrl = '';
            // if (data.customerDeposit?.files && data.customerDeposit.files.length > 0) {
            //     const formData = new FormData();
            //     formData.append('file', data.customerDeposit.files[0]);

            //     const uploadResponse = await axios.post('/api/upload', formData, {
            //         headers: {
            //             'Content-Type': 'multipart/form-data',
            //         },
            //     });

            //     if (uploadResponse.data && uploadResponse.data.success) {
            //         transferSlipUrl = uploadResponse.data.url;
            //     }
            // }
            let formattedData = { ...data };
            

            
            if (transferSlipUrl) {
                formattedData.transferSlipUrl = transferSlipUrl;
            } else if (data.customerDeposit?.existingTransferSlip) {
                formattedData.transferSlipUrl = data.customerDeposit.existingTransferSlip;
            }

            console.log("formattedData", formattedData)

            let response;
            if (editRecord?.id) {
                response = await axios.put(`/finance/record-money/${editRecord.id}`, formattedData);
            } else {
                // Create new record
                response = await axios.post('/finance/record-money', formattedData);
            }

            if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 201)) {
                Swal.fire({
                    icon: 'success',
                    title: editRecord?.id ? 'อัปเดตข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                });

                onClose();

                window.location.reload();
              
            } else {
                throw new Error(response.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={modalRecordMoney} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="sticky top-0 z-10 bg-white p-6 rounded-t-2xl border-b">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                    >
                                        <span>บันทึกข้อมูลฝากสั่งฝากซื้อ</span>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Close</span>
                                            <Lucide icon="X" className="h-6 w-6" />
                                        </button>
                                    </Dialog.Title>
                                </div>

                                <div className="overflow-y-auto max-h-[70vh] p-6">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="border-b pb-4 mb-4">
                                            <h3 className="text-lg font-medium">บันทึกข้อมูล ฝากสั่งฝากเติม:</h3>

                                            {/* First row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    {errors.date && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        พนักงานขาย
                                                    </label>
                                                    <Controller
                                                        name="salesperson"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุพนักงานขาย" }}
                                                        render={({ field }) => (
                                                            <div>
                                                                <select
                                                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.salesperson ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                        }`}
                                                                    {...field}
                                                                    disabled={employeesLoading}
                                                                >
                                                                    <option value="">เลือกพนักงานขาย</option>
                                                                    {salesSupportEmployees.map((employee) => (
                                                                        <option key={employee.id} value={employee.id}>
                                                                            {employee.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {employeesLoading && (
                                                                    <div className="mt-1 text-sm text-gray-500">กำลังโหลดข้อมูลพนักงาน...</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.salesperson && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.salesperson.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Second row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        เลขที่เอกสาร
                                                    </label>
                                                    <Controller
                                                        name="documentNumber"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุเลขที่เอกสาร" }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.documentNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="เลขที่เอกสาร"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    {errors.documentNumber && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.documentNumber.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        รหัสลูกค้า
                                                    </label>
                                                    <Controller
                                                        name="customerId"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุรหัสลูกค้า" }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerId ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="รหัสลูกค้า"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    {errors.customerId && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.customerId.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Transaction Type Selection */}
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ประเภทรายการ
                                                </label>
                                                <div className="flex flex-wrap gap-6">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="deposit"
                                                            type="radio"
                                                            name="type"
                                                            value="deposit"
                                                            checked={data.type === "deposit"}
                                                            onChange={() => setValue("type", "deposit")}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <label htmlFor="deposit" className="ml-2 block text-sm text-gray-700">
                                                            ฝากโอน
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="order"
                                                            type="radio"
                                                            name="type"
                                                            value="order"
                                                            checked={data.type === "order"}
                                                            onChange={() => setValue("type", "order")}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <label htmlFor="order" className="ml-2 block text-sm text-gray-700">
                                                            ฝากสั่งซื้อ
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="topup"
                                                            type="radio"
                                                            name="type"
                                                            value="topup"
                                                            checked={data.type === "topup"}
                                                            onChange={() => setValue("type", "topup")}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <label htmlFor="topup" className="ml-2 block text-sm text-gray-700">
                                                            ฝากเติม
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Details Section */}
                                        <div className="border-b pb-4 mb-4">
                                            <h3 className="text-lg font-medium mb-4">ข้อมูลลูกค้า ฝากชำระ:</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        จำนวนเงิน (RMB)
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.amountRMB"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุจำนวนเงิน (RMB)" }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit?.amountRMB ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="กรุณากรอกจำนวนเงิน"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    // Allow empty string or valid number
                                                                    field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);

                                                                    // Only perform calculations if we have a valid number
                                                                    if (inputValue !== '') {
                                                                        const formValues = getValues();
                                                                        const rmbAmount = parseFloat(inputValue) || 0;
                                                                        const rate = parseFloat(formValues.customerDeposit?.exchangeRate?.toString() || "0") || 0;
                                                                        const feeAmount = parseFloat(formValues.customerDeposit?.fee?.toString() || "0") || 0;
                                                                        const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                        // คำนวณกำไรอัตราแลกเปลี่ยน
                                                                        let exchangeRateProfit = 0;
                                                                        const customerDeposit = watch('customerDeposit');
                                                                        if (customerDeposit?.amountRMB && customerDeposit?.exchangeRate) {
                                                                            const customerRMB = customerDeposit.amountRMB || 0;
                                                                            const customerRate = customerDeposit.exchangeRate || 0;
                                                                            exchangeRateProfit = (rmbAmount * rate) - (customerRMB * customerRate);
                                                                        } else {
                                                                            exchangeRateProfit = rmbAmount * rate;
                                                                        }
                                                                        setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit);

                                                                        // คำนวณรายรับต่อรายการธุรกรรม
                                                                        const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                        setValue('customerDeposit.incomePerTransaction', incomePerTransaction);

                                                                        // คำนวณจำนวนเงิน THB
                                                                        const calculatedAmount = rmbAmount * rate + feeAmount;
                                                                        setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount : 0);
                                                                    } else {
                                                                        // Reset calculated values when input is empty
                                                                        setValue('customerDeposit.exchangeRateProfit', 0);
                                                                        setValue('customerDeposit.incomePerTransaction', 0);
                                                                        setValue('customerDeposit.amount', 0);
                                                                    }
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
                                                        name="customerDeposit.exchangeRate"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุอัตราแลกเปลี่ยน" }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit?.exchangeRate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    // Allow empty string or valid number
                                                                    field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                                                                    const formValues = getValues();
                                                                    const rmbAmount = parseFloat(formValues.customerDeposit?.amountRMB?.toString() || "0") || 0;
                                                                    const rate = parseFloat(inputValue) || 0;
                                                                    const feeAmount = parseFloat(formValues.customerDeposit?.fee?.toString() || "0") || 0;
                                                                    const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                    // คำนวณกำไรอัตราแลกเปลี่ยน
                                                                    let exchangeRateProfit = 0;
                                                                    const customerDeposit = watch('customerDeposit');
                                                                    if (customerDeposit?.amountRMB && customerDeposit?.exchangeRate) {
                                                                        const customerRMB = customerDeposit.amountRMB || 0;
                                                                        const customerRate = customerDeposit.exchangeRate || 0;
                                                                        exchangeRateProfit = (rmbAmount * rate) - (customerRMB * customerRate);
                                                                    } else {
                                                                        exchangeRateProfit = rmbAmount * rate;
                                                                    }
                                                                    setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit);

                                                                    // คำนวณรายรับต่อรายการธุรกรรม
                                                                    const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                    setValue('customerDeposit.incomePerTransaction', incomePerTransaction);

                                                                    // คำนวณจำนวนเงิน THB
                                                                    const calculatedAmount = rmbAmount * rate + feeAmount;
                                                                    setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount : 0);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ค่าธรรมเนียม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.fee"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit?.fee ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                                placeholder="กรุณากรอกค่าธรรมเนียม"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    field.onChange(inputValue === '' ? '' : parseFloat(inputValue) || 0);
                                                                    
                                                                    if (inputValue !== '') {
                                                                        const formValues = getValues();
                                                                        const rmbAmount = parseFloat(formValues.customerDeposit?.amountRMB?.toString() || "0") || 0;
                                                                        const rate = parseFloat(formValues.customerDeposit?.exchangeRate?.toString() || "0") || 0;
                                                                        const feeAmount = parseFloat(inputValue) || 0;
                                                                        const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                        // Recalculate all values
                                                                        const exchangeRateProfit = (rmbAmount - priceDiff) * rate;
                                                                        setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit);

                                                                        const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                        setValue('customerDeposit.incomePerTransaction', incomePerTransaction);

                                                                        const calculatedAmount = (rmbAmount - priceDiff) * rate + feeAmount;
                                                                        setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount : 0);
                                                                    }
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
                                                        name="customerDeposit.amount"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                readOnly
                                                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                                                                placeholder="0.00"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ภาษีมูลค่าเพิ่ม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.vat"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300  shadow-sm focus:ring-blue-500 sm:text-sm"
                                                                placeholder="0.00"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        จำนวนเงินรวมภาษีมูลค่าเพิ่ม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.totalWithVat"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300  shadow-sm focus:ring-blue-500 sm:text-sm"
                                                                placeholder="0.00"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        วันที่โอน
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.transferDate"
                                                        control={control}
                                                        rules={{ required: "กรุณาระบุวันที่โอน" }}
                                                        render={({ field }) => (
                                                            <input
                                                                type="date"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit?.transferDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ธนาคารบัญชีผู้รับเงิน
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.receivingAccount"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกบัญชี" }}
                                                        render={({ field }) => (
                                                            <select
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit?.receivingAccount ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                {...field}
                                                            >
                                                                <option value="">เลือกบัญชี</option>
                                                                <option value="ayong">อาหยอง</option>
                                                                <option value="jinny">จินนี่</option>
                                                            </select>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        แนบหลักฐานการโอน
                                                    </label>
                                                    <UploadImageComponent
                                                        setValue={setValue}
                                                        control={control}
                                                        // name="customerDeposit.files"
                                                        existingImage={watch('customerDeposit.existingTransferSlip')}
                                                    />
                                                </div>
                                            </div>
                                                <CustomerDepositFormComponent
                                                    control={control}
                                                    setValue={setValue}
                                                    errors={errors}
                                                    loading={loading}
                                                    customerDeposit={watch('customerDeposit')}
                                                    exchangeData={watch('exchange')}
                                                />
                                        </div>
                                    </form>
                                </div>

                                <div className="sticky bottom-0 bg-white p-6 border-t rounded-b-2xl">
                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="outline-secondary"
                                            type="button"
                                            onClick={onClose}
                                            disabled={loading}
                                        >
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            บันทึก
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog >
        </Transition >
    );
};

export default ModalRecordMoneyComponent;