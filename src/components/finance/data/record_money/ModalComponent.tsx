"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { financeData, setModalRecordMoney, setEditRecord } from "@/stores/finance";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Swal from "sweetalert2";

import { CustomerDepositFormComponent, CustomerDepositForm } from './CustomerDepositForm';

import { getSalesSupportEmployees, Employee } from '@/services/finance/employee';
import UploadImageComponent from '@/components/Uploadimage/UpdateImageComponent';
import { getCompanyAccounts } from '@/services/finance';
import { createRecordMoney, updateRecordMoney } from '@/services/record-money';

interface FormData {
    date: string;
    salesperson: string;
    documentNumber: string;
    customerId: string;
    type: 'deposit' | 'order' | '';
    deposit_purpose?: string; // เพิ่มฟิลด์สำหรับเก็บข้อมูลว่าฝากเรื่องอะไร
    customerDeposit?: any
    exchange?: any
    transferSlipUrl?: string;
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
            deposit_purpose: '',
            customerDeposit: {
                amountRMB: '',
                exchangeRate: '',
                fee: '',
                amount: '',
                includeVat: false,
                vatAmount: '',
                totalWithVat: '',
                transferDate: new Date().toISOString().split("T")[0],
                receivingAccount: '',
                exchangeRateProfit: '',
                incomePerTransaction: '',
                notes: '',
                totalDepositAmount: '',
            },
            exchange: {
                amountRMB: '',
                priceDifference: '',
                exchangeRate: '',
                fee: '',
                amount: '',
                exchangeRateProfit: '',
                incomePerTransaction: '',
                transferDate: new Date().toISOString().split("T")[0],
                receivingAccount: '',
                notes: '',
                includeVat: false,
                vatAmount: '',
                totalWithVat: '',
            }
        }
    });

    interface CompanyAccount {
        id: string;
        company_name: string;
        bank_name: string;
        bank_account: string;
    }

    const data = watch();

    const [accountCompanyOptions, setAccountCompanyOptions] = useState<CompanyAccount[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const accounts = await getCompanyAccounts() as CompanyAccount[];
                setAccountCompanyOptions(accounts);
            } catch (error) {
                console.error('Error fetching company accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

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
                response = await updateRecordMoney(editRecord.id, formattedData);
            } else {
                // Create new record
                response = await createRecordMoney(formattedData);
            }

            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                Swal.fire({
                    icon: 'success',
                    title: editRecord?.id ? 'อัปเดตข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                });

                onClose();

                window.location.reload();

            } else {
                throw new Error(response?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันคำนวณ VAT และยอดรวม
    const calculateVatAndTotal = (amount: number, includeVat: boolean) => {
        if (!includeVat || amount === 0) {
            setValue('exchange.vatAmount', 0);
            setValue('exchange.totalWithVat', amount);
            return;
        }
        
        const vatAmount = amount * 0.07;
        const totalWithVat = amount + vatAmount;
        
        setValue('exchange.vatAmount', vatAmount);
        setValue('exchange.totalWithVat', totalWithVat);
    };

    // เมื่อมีการเปลี่ยนแปลงค่า amount หรือ includeVat ให้คำนวณ VAT ใหม่
    useEffect(() => {
        const exchangeData = watch('exchange');
        if (exchangeData) {
            const amount = parseFloat(exchangeData.amount?.toString() || '0');
            const includeVat = exchangeData.includeVat || false;
            calculateVatAndTotal(amount, includeVat);
        }
    }, [watch('exchange.amount'), watch('exchange.includeVat')]);

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
                                            <h3 className="text-lg font-medium">บันทึกข้อมูล ฝากสั่ง:</h3>

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

                                                </div>
                                            </div>
                                        </div>

                                        {/* Deposit Purpose Section - แสดงเมื่อเลือกประเภทรายการเป็น "ฝากโอน" */}
                                        {data.type === "deposit" && (
                                            <div className="border-b pb-4 mb-4">
                                                <div className="grid grid-cols-1 gap-6 mt-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            หัวข้อการฝาก
                                                        </label>
                                                        <Controller
                                                            name="deposit_purpose"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm"
                                                                    placeholder="ระบุเรื่องที่ฝากโอน"
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                                                        render={({ field: { onChange, value } }) => (
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit && 'amountRMB' in errors.customerDeposit ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="0.00"
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    
                                                                    // Allow empty value for deletion
                                                                    if (inputValue === '') {
                                                                        onChange('');
                                                                        setValue('customerDeposit.amountRMB', '');
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
                                                                    setValue('customerDeposit.amountRMB', formattedValue);

                                                                    // Only perform calculations if we have a valid number
                                                                    if (formattedValue !== '') {
                                                                        const formValues = getValues();
                                                                        const rmbAmount = parseFloat(formattedValue) || 0;
                                                                        const rate = parseFloat(formValues.customerDeposit?.exchangeRate?.toString() || "0") || 0;
                                                                        const feeAmount = parseFloat(formValues.customerDeposit?.fee?.toString() || "0") || 0;
                                                                        const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                        // คำนวณกำไรอัตราแลกเปลี่ยน
                                                                        let exchangeRateProfit = 0;
                                                                        const customerDeposit = watch('customerDeposit');
                                                                        if (customerDeposit?.amountRMB && customerDeposit?.exchangeRate) {
                                                                            const customerRMB = parseFloat(customerDeposit.amountRMB.toString()) || 0;
                                                                            const customerRate = parseFloat(customerDeposit.exchangeRate.toString()) || 0;
                                                                            exchangeRateProfit = (rmbAmount * rate) - (customerRMB * customerRate);
                                                                        } else {
                                                                            exchangeRateProfit = rmbAmount * rate;
                                                                        }
                                                                        setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit.toFixed(2));

                                                                        // คำนวณรายรับต่อรายการธุรกรรม
                                                                        const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                        setValue('customerDeposit.incomePerTransaction', incomePerTransaction.toFixed(2));

                                                                        // คำนวณจำนวนเงิน THB
                                                                        const calculatedAmount = rmbAmount * rate + feeAmount;
                                                                        setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount.toFixed(2) : '0.00');
                                                                        
                                                                        // คำนวณยอดฝากชำระรวม (RMB * อัตราแลกเปลี่ยน)
                                                                        const totalDepositAmount = rmbAmount * rate;
                                                                        setValue('customerDeposit.totalDepositAmount', totalDepositAmount > 0 ? totalDepositAmount.toFixed(2) : '0.00');
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    // Format to 2 decimal places when leaving the field
                                                                    if (value !== '' && value !== null && value !== undefined) {
                                                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                                                        onChange(numValue.toFixed(2));
                                                                        setValue('customerDeposit.amountRMB', numValue.toFixed(2));
                                                                    }
                                                                }}
                                                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                                            />
                                                        )}
                                                    />
                                                    {errors.customerDeposit && 'amountRMB' in errors.customerDeposit && (
                                                        <p className="mt-1 text-sm text-red-500">{(errors.customerDeposit.amountRMB as any)?.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        อัตราแลกเปลี่ยน
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.exchangeRate"
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit && 'exchangeRate' in errors.customerDeposit ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                                                    }`}
                                                                placeholder="0.00"
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    
                                                                    // Allow empty value for deletion
                                                                    if (inputValue === '') {
                                                                        onChange('');
                                                                        setValue('customerDeposit.exchangeRate', '');
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
                                                                    setValue('customerDeposit.exchangeRate', formattedValue);

                                                                    if (formattedValue !== '') {
                                                                        const formValues = getValues();
                                                                        const rmbAmount = parseFloat(formValues.customerDeposit?.amountRMB?.toString() || "0") || 0;
                                                                        const rate = parseFloat(formattedValue) || 0;
                                                                        const feeAmount = parseFloat(formValues.customerDeposit?.fee?.toString() || "0") || 0;
                                                                        const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                        // คำนวณกำไรอัตราแลกเปลี่ยน
                                                                        let exchangeRateProfit = 0;
                                                                        const customerDeposit = watch('customerDeposit');
                                                                        if (customerDeposit?.amountRMB && customerDeposit?.exchangeRate) {
                                                                            const customerRMB = parseFloat(customerDeposit.amountRMB.toString()) || 0;
                                                                            const customerRate = parseFloat(customerDeposit.exchangeRate.toString()) || 0;
                                                                            exchangeRateProfit = (rmbAmount * rate) - (customerRMB * customerRate);
                                                                        } else {
                                                                            exchangeRateProfit = rmbAmount * rate;
                                                                        }
                                                                        setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit.toFixed(2));

                                                                        // คำนวณรายรับต่อรายการธุรกรรม
                                                                        const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                        setValue('customerDeposit.incomePerTransaction', incomePerTransaction.toFixed(2));

                                                                        // คำนวณจำนวนเงิน THB
                                                                        const calculatedAmount = rmbAmount * rate + feeAmount;
                                                                        setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount.toFixed(2) : '0.00');
                                                                        
                                                                        // คำนวณยอดฝากชำระรวม (RMB * อัตราแลกเปลี่ยน)
                                                                        const totalDepositAmount = rmbAmount * rate;
                                                                        setValue('customerDeposit.totalDepositAmount', totalDepositAmount > 0 ? totalDepositAmount.toFixed(2) : '0.00');
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    // Format to 2 decimal places when leaving the field
                                                                    if (value !== '' && value !== null && value !== undefined) {
                                                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                                                        onChange(numValue.toFixed(2));
                                                                        setValue('customerDeposit.exchangeRate', numValue.toFixed(2));
                                                                    }
                                                                }}
                                                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                                            />
                                                        )}
                                                    />
                                                    {errors.customerDeposit && 'exchangeRate' in errors.customerDeposit && (
                                                        <p className="mt-1 text-sm text-red-500">{(errors.customerDeposit.exchangeRate as any)?.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">


                                            <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ยอดฝากชำระรวม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.totalDepositAmount"
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
                                                        ค่าธรรมเนียม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.fee"
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${errors.customerDeposit && 'fee' in errors.customerDeposit ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                                                placeholder="0.00"
                                                                onChange={(e) => {
                                                                    const inputValue = e.target.value;
                                                                    
                                                                    // Allow empty value for deletion
                                                                    if (inputValue === '') {
                                                                        onChange('');
                                                                        setValue('customerDeposit.fee', '');
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
                                                                    setValue('customerDeposit.fee', formattedValue);

                                                                    if (formattedValue !== '') {
                                                                        const formValues = getValues();
                                                                        const rmbAmount = parseFloat(formValues.customerDeposit?.amountRMB?.toString() || "0") || 0;
                                                                        const rate = parseFloat(formValues.customerDeposit?.exchangeRate?.toString() || "0") || 0;
                                                                        const feeAmount = parseFloat(formattedValue) || 0;
                                                                        const priceDiff = parseFloat(formValues.customerDeposit?.priceDifference?.toString() || "0") || 0;

                                                                        // Recalculate all values
                                                                        const exchangeRateProfit = (rmbAmount - priceDiff) * rate;
                                                                        setValue('customerDeposit.exchangeRateProfit', exchangeRateProfit.toFixed(2));

                                                                        const incomePerTransaction = feeAmount + exchangeRateProfit + priceDiff;
                                                                        setValue('customerDeposit.incomePerTransaction', incomePerTransaction.toFixed(2));

                                                                        const calculatedAmount = (rmbAmount - priceDiff) * rate + feeAmount;
                                                                        setValue('customerDeposit.amount', calculatedAmount > 0 ? calculatedAmount.toFixed(2) : '0.00');
                                                                        
                                                                        // คำนวณยอดฝากชำระรวม (RMB * อัตราแลกเปลี่ยน)
                                                                        const totalDepositAmount = rmbAmount * rate;
                                                                        setValue('customerDeposit.totalDepositAmount', totalDepositAmount > 0 ? totalDepositAmount.toFixed(2) : '0.00');
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    // Format to 2 decimal places when leaving the field
                                                                    if (value !== '' && value !== null && value !== undefined) {
                                                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                                                        onChange(numValue.toFixed(2));
                                                                        setValue('customerDeposit.fee', numValue.toFixed(2));
                                                                    }
                                                                }}
                                                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                                            />
                                                        )}
                                                    />
                                                    {errors.customerDeposit && 'fee' in errors.customerDeposit && (
                                                        <p className="mt-1 text-sm text-red-500">{(errors.customerDeposit.fee as any)?.message}</p>
                                                    )}
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
                                                                type="text"
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

                                            {watch('customerDeposit.includeVat') && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ภาษีมูลค่าเพิ่ม (7%)
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.vatAmount"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
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
                                                        จำนวนเงินรวมภาษีมูลค่าเพิ่ม
                                                    </label>
                                                    <Controller
                                                        name="customerDeposit.totalWithVat"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="number"
                                                                readOnly
                                                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 sm:text-sm"
                                                                placeholder="0.00"
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            )}
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