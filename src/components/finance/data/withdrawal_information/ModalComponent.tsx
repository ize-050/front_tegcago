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
    gasoline_cost: string;
    other_cost: string;
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
    withdrawal_company: 'LOGISTIC',
    gasoline_cost: '',
    other_cost: ''
}

type FormValues = {
    transfer_amount: any;
    transfer_date: string;
    pay_gasoline: number;
    pay_price: number;
    pay_total: number;
    return_people: string;
    withdrawal_date: string;
    withdrawal_person: string;
    formatted_transfer_amount?: string;
};

const ModalWithdrawalInformation = ({ onSuccess }: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { modalWithdrawal, formwithdrawal, action } = useAppSelector(financeData)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState("")
    const [withdrawalItems, setWithdrawalItems] = useState<WithdrawalItem[]>([defaultWithdrawalItem])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // States for autocomplete
    const [queries, setQueries] = useState<string[]>([''])
    const [options, setOptions] = useState<InvoiceOption[]>([])
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
        register
    } = useForm<FormValues>({
        defaultValues: {
            transfer_amount: '',
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
        if (formwithdrawal && action.action == 'edit') {
            setValue('pay_gasoline', formwithdrawal.pay_gasoline || '')
            setValue('pay_price', formwithdrawal.pay_price || '')
            setValue('pay_total', formwithdrawal.pay_total || '')
            setValue('return_people', formwithdrawal.return_people || '')
            setValue('withdrawal_date', formwithdrawal.withdrawal_date || '')
            setValue('withdrawal_person', formwithdrawal.withdrawal_person || '')
            setValue('transfer_amount', formwithdrawal.transfer_amount || '')
            setValue('transfer_date', formwithdrawal.transfer_date || '')

            if (formwithdrawal.withdrawalItems?.length > 0) {
                setWithdrawalItems(formwithdrawal.withdrawalItems)
                setQueries(new Array(formwithdrawal.withdrawalItems.length).fill(''))
            }
        } else {
            // เคลียร์ฟอร์มเมื่อไม่มีข้อมูล formwithdrawal (กรณีเพิ่มรายการใหม่)
            reset({
                transfer_amount: '',
                transfer_date: new Date().toISOString().split('T')[0],
                pay_gasoline: 0,
                pay_price: 0,
                pay_total: 0,
                return_people: '',
                withdrawal_date: moment().format('YYYY-MM-DD'),
                withdrawal_person: '',
            });
            setWithdrawalItems([defaultWithdrawalItem]);
            setQueries(['']);
            setOptions([]);
            setActiveIndex(null);
        }
    }, [formwithdrawal, setValue, reset, action])

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
                consignee: option.consignee,
                invoice_id: option.id,
                withdrawal_company: newWithdrawalItems[index].withdrawal_company || 'LOGISTIC' // ตั้งค่าเริ่มต้นเป็น LOGISTIC ถ้ายังไม่มีค่า
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
            withdrawal_company: 'LOGISTIC', // ตั้งค่าเริ่มต้นเป็น LOGISTIC เมื่อเคลียร์ข้อมูล
            gasoline_cost: '',
            other_cost: ''
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
        // Validate that the last item has an invoice_package before adding a new one
        const lastItem = withdrawalItems[withdrawalItems.length - 1];
        if (!lastItem.invoice_package) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาระบุข้อมูล',
                text: 'กรุณาเลือก Invoice & PackingList No. ในรายการปัจจุบันก่อนเพิ่มรายการใหม่',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        const newItem = {
            invoice_package: '',
            invoice_id: '',
            consignee: '',
            head_tractor: '',
            withdrawal_date: moment().format('YYYY-MM-DD'),
            withdrawal_amount: '',
            withdrawal_company: 'LOGISTIC',
            gasoline_cost: '',
            other_cost: '',
        };

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

    useEffect(() => {
        // Calculate total withdrawal amount
        const totalWithdrawalAmount = withdrawalItems.reduce((sum, item) => sum + Number(item.withdrawal_amount || 0), 0);

        // Calculate total gasoline and other costs from individual items
        const totalGasolineCost = withdrawalItems.reduce((sum, item) => sum + Number(item.gasoline_cost || 0), 0);
        const totalOtherCost = withdrawalItems.reduce((sum, item) => sum + Number(item.other_cost || 0), 0);

        // Set the total values to the form
        setValue('pay_gasoline', totalGasolineCost);
        setValue('pay_price', totalOtherCost);

        // Calculate total
        const gasoline = Number(watch('pay_gasoline')) || 0;
        const price = Number(watch('pay_price')) || 0;
        const transferAmount = Number(watch('transfer_amount')) || 0;

        // Calculate total amount to return
        const total = transferAmount - gasoline - price;
        setValue('pay_total', total);
    }, [withdrawalItems, watch('pay_gasoline'), watch('pay_price'), watch('transfer_amount'), setValue]);

    useEffect(() => {
        const totalWithdrawal = withdrawalItems.reduce((sum, item) => sum + (Number(item.withdrawal_amount) || 0), 0);
        const gasoline = Number(watch('pay_gasoline')) || 0;
        const price = Number(watch('pay_price')) || 0;
        const transferAmount = Number(watch('transfer_amount')) || 0;

        const total = totalWithdrawal + gasoline + price - transferAmount;
        setValue('pay_total', total);

        // Automatically set return_people based on pay_total value
        if (total > 0) {
            setValue('return_people', 'คืนบริษัท');
        } else if (total < 0) {
            setValue('return_people', 'คืนShipping');
        } else {
            setValue('return_people', '');
        }
    }, [withdrawalItems, watch('pay_gasoline'), watch('pay_price'), watch('transfer_amount'), setValue]);

    const onSubmit = async (data: any) => {
        try {
            // Validate that at least one withdrawal item has been added and has an invoice_package
            const hasValidItems = withdrawalItems.some(item => item.invoice_package);
            if (!hasValidItems) {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อมูลไม่ครบถ้วน',
                    text: 'กรุณาเลือกอย่างน้อย 1 รายการ Invoice & PackingList No.',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }

            setIsSubmitting(true);

            const endpoint = formwithdrawal?.id
                ? `${process.env.NEXT_PUBLIC_URL_API}/finance/updateWidhdrawalInformation`
                : `${process.env.NEXT_PUBLIC_URL_API}/finance/submitwidhdrawalInformation`

            // ส่ง group_id ไปด้วยเมื่อทำการแก้ไขข้อมูล
            const payload = {
                ...data,
                withdrawalItems,
                d_purchase_id: selectedInvoiceId,
            }

            // เพิ่ม group_id เมื่อทำการแก้ไขข้อมูล
            if (formwithdrawal?.id) {
                payload.id = formwithdrawal.id;
                payload.group_id = formwithdrawal.group_id;
            }

            const response = await axios.post(endpoint, payload)

            if (response.status === 200 && response.data.statusCode == 200) {
                await Swal.fire({
                    icon: 'success',
                    title: formwithdrawal?.id ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })

                // Reset form and state
                reset();
                setWithdrawalItems([defaultWithdrawalItem]);
                setQueries(['']);
                setOptions([]);
                setActiveIndex(null);

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
        } finally {
            setIsSubmitting(false);
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
                                                                    rules={{ required: "กรุณาระบุวันที่เบิก" }}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="date"
                                                                            {...field}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.withdrawal_date && (
                                                                    <p className="mt-1 text-sm text-red-600">{errors.withdrawal_date.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    ผู้เบิก
                                                                </label>
                                                                <Controller
                                                                    name="withdrawal_person"
                                                                    control={control}
                                                                    rules={{ required: "กรุณาระบุผู้เบิก" }}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="text"
                                                                            {...field}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.withdrawal_person && (
                                                                    <p className="mt-1 text-sm text-red-600">{errors.withdrawal_person.message}</p>
                                                                )}
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
                                                                                                withdrawal_company: '',
                                                                                                gasoline_cost: '',
                                                                                                other_cost: ''
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
                                                                                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                                                                                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
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
                                                                                    className="ml-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                                                            <option value="8169">8169</option>
                                                                        </select>
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            ค่าน้ำมัน
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={item.gasoline_cost}
                                                                            onChange={(e) => {
                                                                                const newItems = [...withdrawalItems]
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    gasoline_cost: e.target.value
                                                                                }
                                                                                setWithdrawalItems(newItems)
                                                                            }}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                            ค่าอื่นๆ
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={item.other_cost}
                                                                            onChange={(e) => {
                                                                                const newItems = [...withdrawalItems]
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    other_cost: e.target.value
                                                                                }
                                                                                setWithdrawalItems(newItems)
                                                                            }}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button
                                                            type="button"
                                                            onClick={handleAddItem}
                                                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        >
                                                            + เพิ่มรายการเบิก
                                                        </button>

                                                        {/* Summary Section */}
                                                        <div className="mt-6 p-2 rounded-lg">
                                                            <div className="bg-blue-50 p-4 mb-4 rounded-lg border border-blue-200">
                                                                <h3 className="text-lg font-medium text-blue-800 mb-2">การคำนวณยอดเงิน</h3>
                                                                <p className="text-sm text-blue-700 mb-2">
                                                                    ค่าใช้จ่ายทั้งหมด (ค่าน้ำมันและค่าอื่นๆ) จะถูกหารเฉลี่ยให้กับทุกรายการเบิก
                                                                </p>
                                                                <ul className="list-disc list-inside text-sm text-blue-700 ml-2">
                                                                    <li>ยอดเบิกรวม = ผลรวมของยอดเบิกทุกรายการ</li>
                                                                    <li>ค่าน้ำมันต่อรายการ = ค่าน้ำมันทั้งหมด ÷ จำนวนรายการเบิก</li>
                                                                    <li>ค่าอื่นๆต่อรายการ = ค่าอื่นๆทั้งหมด ÷ จำนวนรายการเบิก</li>
                                                                    <li>ยอดสุทธิต่อรายการ = ยอดเบิก - ค่าน้ำมันต่อรายการ - ค่าอื่นๆต่อรายการ</li>
                                                                </ul>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">



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
                                                                        defaultValue=""
                                                                        rules={{
                                                                            required: false,
                                                                            pattern: {
                                                                                value: /^[0-9]*\.?[0-9]*$/,
                                                                                message: "กรุณากรอกตัวเลขเท่านั้น"
                                                                            }
                                                                        }}
                                                                        render={({ field: { onChange, value } }) => (
                                                                            <input
                                                                                type="text"
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value;

                                                                                    // Allow empty value for deletion
                                                                                    if (inputValue === '') {
                                                                                        onChange('');
                                                                                        setValue('transfer_amount', '');
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
                                                                                    setValue('transfer_amount', formattedValue);
                                                                                }}
                                                                                onBlur={() => {
                                                                                    // Format to 2 decimal places when leaving the field
                                                                                    if (value !== '' && value !== null && value !== undefined) {
                                                                                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                                                                        onChange(numValue.toFixed(2));
                                                                                        setValue('transfer_amount', numValue.toFixed(2));
                                                                                    }
                                                                                }}
                                                                                value={typeof value === 'number' ? value.toFixed(2) : value}
                                                                                placeholder="0.00"
                                                                                className={`${errors.transfer_amount ? "border-red-500" : "border-gray-200"}
                                                                                                       px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>



                                                        <div className="grid grid-cols-2 gap-4 mt-4">
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

                                                        </div>

                                                        {/* Live calculation summary */}
                                                        {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <h4 className="font-medium text-gray-700 mb-2">สรุปการคำนวณ (ตัวอย่าง)</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p>จำนวนรายการเบิก: <span className="font-medium">{withdrawalItems.length} รายการ</span></p>
                                                                <p>ยอดค่าน้ำมันรวม: <span className="font-medium">{watch('pay_gasoline') || 0} บาท</span></p>
                                                                <p>ยอดค่าอื่นๆรวม: <span className="font-medium">{watch('pay_price') || 0} บาท</span></p>
                                                                <p>ค่าน้ำมันต่อรายการ: <span className="font-medium">{withdrawalItems.length ? (Number(watch('pay_gasoline') || 0) / withdrawalItems.length).toFixed(2) : 0} บาท</span></p>
                                                                <p>ค่าอื่นๆต่อรายการ: <span className="font-medium">{withdrawalItems.length ? (Number(watch('pay_price') || 0) / withdrawalItems.length).toFixed(2) : 0} บาท</span></p>
                                                                
                                                           
                                                                
                                                                {withdrawalItems.length > 0 && withdrawalItems[0].withdrawal_amount && (
                                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                                        <p className="font-medium">การคำนวณสำหรับรายการที่ 1 ของคุณ:</p>
                                                                        <p>ยอดเบิก: <span className="font-medium">{withdrawalItems[0].withdrawal_amount} บาท</span></p>
                                                                        <p>หัก ค่าน้ำมัน: <span className="font-medium">{withdrawalItems.length ? (Number(watch('pay_gasoline') || 0) / withdrawalItems.length).toFixed(2) : 0} บาท</span></p>
                                                                        <p>หัก ค่าอื่นๆ: <span className="font-medium">{withdrawalItems.length ? (Number(watch('pay_price') || 0) / withdrawalItems.length).toFixed(2) : 0} บาท</span></p>
                                                                        <p className="font-medium text-green-600">
                                                                            ยอดสุทธิ: <span className="font-medium">{(
                                                                                Number(withdrawalItems[0].withdrawal_amount || 0) - 
                                                                                (withdrawalItems.length ? Number(watch('pay_gasoline') || 0) / withdrawalItems.length : 0) - 
                                                                                (withdrawalItems.length ? Number(watch('pay_price') || 0) / withdrawalItems.length : 0)
                                                                            ).toFixed(2)} บาท</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div> */}

                                                        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
                                                            <button
                                                                type="button"
                                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                                onClick={() => {
                                                                    dispatch(setModalWithdrawal(false))
                                                                    dispatch(setFormWithdrawal(null))
                                                                }}
                                                            >
                                                                ยกเลิก
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleAddItem}
                                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                            >
                                                                เพิ่มรายการ
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        กำลังบันทึก...
                                                                    </>
                                                                ) : formwithdrawal?.id ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                                                            </button>
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