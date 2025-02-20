"use client"
import React, { Fragment, useEffect, useState } from 'react'
import axios from '../../../../../axios'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { CheckIcon } from '@heroicons/react/20/solid'

// components
import { FormInput, FormSelect } from '@/components/Base/Form'
import Button from '@/components/Base/Button'

// store
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { financeData, setModalWithdrawal, setFormWithdrawal } from '@/stores/finance'

// types for autocomplete
interface WithdrawalItem {
    invoice_package: string;
    invoice_id: string;
    consignee: string;
    head_tractor: string;
    withdrawal_date: string;
    withdrawal_amount: string;
    withdrawal_company: string;
}

interface InvoiceOption {
    id: string;
    invoice_package: string;
    consignee: string;
}

interface Props {
    onSuccess: () => void
}

const defaultWithdrawalItem = {
    invoice_package: '',
    invoice_id: '',
    consignee: '',
    head_tractor: '',
    withdrawal_date: moment().format('YYYY-MM-DD'),
    withdrawal_amount: '',
    withdrawal_company: '',
}

type FormValues = {
    transfer_amount: number;
    transfer_date: string;
    pay_gasoline: number;
    pay_price: number;
    pay_total: number;
    return_people: string;
    withdrawal_date: string;
    withdrawal_person: string;
};

const ModalWithdrawalInformation = ({ onSuccess }: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { modalWithdrawal, formwithdrawal } = useAppSelector(financeData)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState("")
    const [withdrawalItems, setWithdrawalItems] = useState<WithdrawalItem[]>([defaultWithdrawalItem])

    // States for autocomplete
    const [queries, setQueries] = useState<string[]>([''])
    const [options, setOptions] = useState<InvoiceOption[]>([])
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        register
    } = useForm<FormValues>({
        defaultValues: {
            transfer_amount: 0,
            transfer_date: new Date().toISOString().split('T')[0],
            pay_gasoline: 0,
            pay_price: 0,
            pay_total: 0,
            return_people: '',
            withdrawal_date: moment().format('YYYY-MM-DD'),
            withdrawal_person: '',
        }
    })

    useEffect(() => {
        if (formwithdrawal) {
            setValue('pay_gasoline', formwithdrawal.pay_gasoline || '')
            setValue('pay_price', formwithdrawal.pay_price || '')
            setValue('pay_total', formwithdrawal.pay_total || '')
            setValue('return_people', formwithdrawal.return_people || '')
            setValue('withdrawal_date', formwithdrawal.withdrawal_date || '')
            setValue('withdrawal_person', formwithdrawal.withdrawal_person || '')
            
            if (formwithdrawal.withdrawalItems?.length > 0) {
                setWithdrawalItems(formwithdrawal.withdrawalItems)
                setQueries(new Array(formwithdrawal.withdrawalItems.length).fill(''))
            }
        }
    }, [formwithdrawal, setValue])

    // Fetch invoice options when query changes
    const fetchInvoiceOptions = async () => {
        if (activeIndex !== null && queries[activeIndex]?.length > 0) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/purchase?search=${queries[activeIndex]}`)
                const data = response.data.data;
                
                
                // Get all selected invoice packages except the current row
                const selectedInvoicePackages = withdrawalItems
                    .filter((item, idx) => idx !== activeIndex && item.invoice_package)
                    .map(item => item.invoice_package);

                console.log('Selected packages:', selectedInvoicePackages);
                console.log('Current withdrawalItems:', withdrawalItems);
                console.log('Active Index:', activeIndex);
                
                                                                        // Filter out options that are already selected in other rows
                const filteredOptions = data.filter((item: any) => {
                    console.log('Checking item:', item.d_shipment_number);
                    console.log('Is selected?', selectedInvoicePackages.includes(item.d_shipment_number));
                    return !selectedInvoicePackages.includes(item.d_shipment_number);
                });

                console.log('Filtered options:', filteredOptions);

                setOptions(filteredOptions.map((item: any) => ({ 
                    id: item.id, 
                    invoice_package: item.d_shipment_number,
                    consignee: item.cs_purchase[0]?.bookcabinet?.consignee
                })));
                
            } catch (error) {
                console.error('Error fetching invoice options:', error)
                setOptions([]);
            }
        } else {
            setOptions([])
        }
    }

    useEffect(() => {
        fetchInvoiceOptions()
    }, [queries, activeIndex, withdrawalItems])

    // Handle invoice selection
    const handleInvoiceSelect = async (index: number, option: InvoiceOption) => {
        try {
            // In edit mode, only check for duplicates if the selected value is different from the original
            const isEditMode = formwithdrawal?.id !== undefined;
            const originalValue = formwithdrawal?.withdrawalItems?.[index]?.invoice_package;
            
            // Only check for duplicates if:
            // 1. We're in insert mode (not edit mode) OR
            // 2. We're in edit mode AND the selected value is different from the original value
            if (!isEditMode || (isEditMode && option.invoice_package !== originalValue)) {
                const isAlreadySelected = withdrawalItems.some((item, idx) => 
                    idx !== index && item.invoice_package === option.invoice_package
                );

                if (isAlreadySelected) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถเลือกได้',
                        text: 'Invoice & PackingList No. นี้ถูกเลือกไปแล้ว',
                        confirmButtonText: 'ตกลง'
                    });
                    return;
                }
            }
            
            // Update withdrawalItems with the selected invoice_package
            const newWithdrawalItems = [...withdrawalItems];
            newWithdrawalItems[index] = {
                ...newWithdrawalItems[index],
                invoice_package: option.invoice_package,
                consignee: option.consignee
            };
            setWithdrawalItems(newWithdrawalItems);
            
            // Keep the selected value in the input
            const newQueries = [...queries];
            
            newQueries[index] = option.invoice_package;
            setQueries(newQueries);
            setOptions([]);
        } catch (error) {
            console.error('Error in handleInvoiceSelect:', error)
        }
    }

    // Clear invoice selection for a specific row
    const handleClearInvoice = (index: number) => {
        const newWithdrawalItems = [...withdrawalItems];
        newWithdrawalItems[index] = {
            ...newWithdrawalItems[index],
            invoice_package: '',
            invoice_id: '',
            consignee: '',
            head_tractor: '',
            withdrawal_amount: '',
            withdrawal_company: ''
        };
        setWithdrawalItems(newWithdrawalItems);

        const newQueries = [...queries];
        newQueries[index] = '';
        setQueries(newQueries);
        
        // Refresh options if this is the active row
        if (index === activeIndex && queries[activeIndex]?.length > 0) {
            fetchInvoiceOptions();
        }
    };

    // Add new withdrawal item
    const handleAddItem = () => {
        const newItem = {
            invoice_package: '',
            invoice_id: '',
            consignee: '',
            head_tractor: '',
            withdrawal_date: moment().format('YYYY-MM-DD'),
            withdrawal_amount: '',
            withdrawal_company: '',
        };
        console.log('Adding new item:', newItem);
        console.log('Current withdrawalItems:', withdrawalItems);
        
        setWithdrawalItems([...withdrawalItems, newItem]);
        setQueries([...queries, '']);
    }

    // Remove withdrawal item
    const handleRemoveItem = (index: number) => {
        // Remove the item from withdrawalItems
        const newWithdrawalItems = [...withdrawalItems]
        newWithdrawalItems.splice(index, 1)
        setWithdrawalItems(newWithdrawalItems)

        // Remove the query
        const newQueries = [...queries]
        newQueries.splice(index, 1)
        setQueries(newQueries)

        // If we're removing the active row, clear the options
        if (index === activeIndex) {
            setOptions([])
        }
        // If we're removing a different row, and we have an active row open,
        // refresh the options for the active row
        else if (activeIndex !== null && queries[activeIndex]?.length > 0) {
            fetchInvoiceOptions()
        }
    }

    const onSubmit = async (data: any) => {
        try {
            const endpoint = formwithdrawal?.id 
                ? `${process.env.NEXT_PUBLIC_URL_API}/finance/updateWidhdrawalInformation`
                : `${process.env.NEXT_PUBLIC_URL_API}/finance/submitwidhdrawalInformation`

            const payload = {
                ...data,
                withdrawalItems,
                d_purchase_id: selectedInvoiceId,
            }

            const response = await axios.post(endpoint, payload)

            if(response.status === 200 && response.data.statusCode == 200) {
                await Swal.fire({
                    icon: 'success',
                    title: formwithdrawal?.id ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(setModalWithdrawal(false))
                dispatch(setFormWithdrawal(null))
                onSuccess()
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'มีข้อมูล invoice & packageing นี้อยู่แล้ว',
                    text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ตกลง'
                })
            }
        } catch (err) {
            console.error('err', err)
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            })
        }
    }

    return (
        <Transition.Root show={modalWithdrawal} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => dispatch(setModalWithdrawal(false))}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-1 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                <div className="bg-white">
                                    <div className="sm:flex sm:items-start">
                                        <div className="w-full">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 p-6 pb-0">
                                                เพิ่มรายการเบิก
                                            </Dialog.Title>
                                            <div className="mt-2 p-2 pt-4">
                                                <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                                    {/* Header Section */}
                                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    วันที่เบิก
                                                                </label>
                                                                <Controller
                                                                    name="withdrawal_date"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="date"
                                                                            {...field}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    ผู้เบิก
                                                                </label>
                                                                <Controller
                                                                    name="withdrawal_person"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="text"
                                                                            {...field}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto ">
                                                        {withdrawalItems.map((item, index) => (
                                                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h3 className="text-lg font-medium">รายการที่ {index + 1}</h3>
                                                                    {index > 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveItem(index)}
                                                                            className="text-red-600 hover:text-red-800"
                                                                        >
                                                                            ลบรายการ
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Invoice & PackingList No.
                                                                        </label>
                                                                        <div className="relative flex">
                                                                            <div className="flex-1">
                                                                                <Combobox
                                                                                    as="div"
                                                                                    value={withdrawalItems[index].invoice_package}
                                                                                    onChange={(value: any | InvoiceOption) => {
                                                                                        if (typeof value === 'string') {
                                                                                            // Handle clearing the value
                                                                                            const newWithdrawalItems = [...withdrawalItems];
                                                                                            newWithdrawalItems[index] = {
                                                                                                ...newWithdrawalItems[index],
                                                                                                invoice_package: '',
                                                                                                invoice_id: '',
                                                                                                consignee: '',
                                                                                                head_tractor: '',
                                                                                                withdrawal_amount: '',
                                                                                                withdrawal_company: ''
                                                                                            };
                                                                                            setWithdrawalItems(newWithdrawalItems);
                                                                                        } else {
                                                                                            // Handle selecting an option
                                                                                            handleInvoiceSelect(index, value);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <div className="relative">
                                                                                        <Combobox.Input
                                                                                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                                            onChange={(e) => {
                                                                                                const newQueries = [...queries]
                                                                                                newQueries[index] = e.target.value
                                                                                                setQueries(newQueries)
                                                                                                setActiveIndex(index)
                                                                                            }}
                                                                                            displayValue={(value: string | InvoiceOption | null) => {
                                                                                                if (typeof value === 'string') return value;
                                                                                                return value?.invoice_package || queries[index];
                                                                                            }}
                                                                                            placeholder="ค้นหา Invoice"
                                                                                        />
                                                                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                                        </Combobox.Button>
                                                                                    </div>
                                                                                    <Transition
                                                                                        leave="transition ease-in duration-100"
                                                                                        leaveFrom="opacity-100"
                                                                                        leaveTo="opacity-0"
                                                                                        afterLeave={() => setQueries(queries.map(q => q))}
                                                                                    >
                                                                                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                            {options.length === 0 && queries[index] !== '' ? (
                                                                                                <div className="px-4 py-2 text-sm text-gray-500">
                                                                                                    ไม่พบข้อมูล
                                                                                                </div>
                                                                                            ) : (
                                                                                                options.map((option) => (
                                                                                                    <Combobox.Option
                                                                                                        key={option.id}
                                                                                                        value={option}
                                                                                                        className={({ active }) =>
                                                                                                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                                                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                                                                            }`
                                                                                                        }
                                                                                                    >
                                                                                                        {({ active, selected }) => (
                                                                                                            <>
                                                                                                                <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                                                                                                                    {option.invoice_package}
                                                                                                                </span>
                                                                                                                {selected && (
                                                                                                                    <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </>
                                                                                                        )}
                                                                                                    </Combobox.Option>
                                                                                                ))
                                                                                            )}
                                                                                        </Combobox.Options>
                                                                                    </Transition>
                                                                                </Combobox>
                                                                            </div>
                                                                            {item.invoice_package && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleClearInvoice(index)}
                                                                                    className="ml-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                                >
                                                                                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            Consignee
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={item.consignee}
                                                                            readOnly
                                                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    </div>

                                                                   

                                                                 

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            ยอดเบิก
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={item.withdrawal_amount}
                                                                            onChange={(e) => {
                                                                                const newItems = [...withdrawalItems]
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    withdrawal_amount: e.target.value
                                                                                }
                                                                                setWithdrawalItems(newItems)
                                                                            }}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            เบิกจากบริษัท
                                                                        </label>
                                                                        <select
                                                                            value={item.withdrawal_company}
                                                                            onChange={(e) => {
                                                                                const newItems = [...withdrawalItems]
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    withdrawal_company: e.target.value
                                                                                }
                                                                                setWithdrawalItems(newItems)
                                                                            }}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        >
                                                                            <option value="">เลือกบริษัท</option>
                                                                            <option value="LOGISTIC">LOGISTIC</option>
                                                                            <option value="8196">8196</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button
                                                            type="button"
                                                            onClick={handleAddItem}
                                                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            + เพิ่มรายการเบิก
                                                        </button>

                                                        {/* Summary Section */}
                                                        <div className="mt-6 p-2 rounded-lg">
                                                          
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        ค่าน้ำมัน
                                                                    </label>
                                                                    <Controller
                                                                        name="pay_gasoline"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                type="number"
                                                                                {...field}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e);
                                                                                    const gasoline = Number(e.target.value) || 0;
                                                                                    const others = Number(watch('pay_price')) || 0;
                                                                                    setValue('pay_total', gasoline + others);
                                                                                }}
                                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        ค่าอื่นๆ
                                                                    </label>
                                                                    <Controller
                                                                        name="pay_price"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                type="number"
                                                                                {...field}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e);
                                                                                    const others = Number(e.target.value) || 0;
                                                                                    const gasoline = Number(watch('pay_gasoline')) || 0;
                                                                                    setValue('pay_total', gasoline + others);
                                                                                }}
                                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        ยอดเบิกรวม
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            withdrawalItems.reduce((sum, item) => sum + (Number(item.withdrawal_amount) || 0), 0) +
                                                                            (Number(watch('pay_gasoline')) || 0) +
                                                                            (Number(watch('pay_price')) || 0)
                                                                        }
                                                                        readOnly
                                                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        ยอดโอน
                                                                    </label>
                                                                    <Controller
                                                                        name="transfer_amount"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                type="number"
                                                                                {...field}
                                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Other form fields */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    วันที่โอน
                                                                </label>
                                                                <Controller
                                                                    name="transfer_date"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="date"
                                                                            {...field}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    คงเหลือ
                                                                </label>
                                                                <Controller
                                                                    name="pay_total"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            {...field}
                                                                            type="number"
                                                                            readOnly
                                                                            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    คืนใคร
                                                                </label>
                                                                <Controller
                                                                    name="return_people"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            {...field}
                                                                            type="text"
                                                                            readOnly
                                                                            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-5 flex justify-end space-x-3">
                                                            <Button
                                                                type="button"
                                                                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                onClick={() => dispatch(setModalWithdrawal(false))}
                                                            >
                                                                ยกเลิก
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                            >
                                                                บันทึก
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalWithdrawalInformation