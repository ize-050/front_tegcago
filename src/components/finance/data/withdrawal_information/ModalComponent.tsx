"use client"
import React, { Fragment, useEffect, useState } from 'react'
import axios from '../../../../../axios'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

// components
import { FormInput, FormSelect } from '@/components/Base/Form'
import Button from '@/components/Base/Button'

// store
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { financeData, setModalWithdrawal, setFormWithdrawal } from '@/stores/finance'

// types for autocomplete
type InvoiceOption = {
    id: string
    invoice_package: string
}

interface Props {
    onSuccess: () => void
}

const ModalWithdrawalInformation = ({ onSuccess }: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { modalWithdrawal, formwithdrawal } = useAppSelector(financeData)
    const [query, setQuery] = useState('')
    const [headTractorQuery, setHeadTractorQuery] = useState('')
    const [options, setOptions] = useState<InvoiceOption[]>([])
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('')
    const [headTractorOptions, setHeadTractorOptions] = useState(['LOGISTIC', '8168'])

    const filteredHeadTractorOptions = headTractorQuery === ''
        ? headTractorOptions
        : headTractorOptions.filter((option) =>
            option.toLowerCase().includes(headTractorQuery.toLowerCase())
        )

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            invoice_package: '',
            consignee: '',
            withdrawal_date: '',
            head_tractor: '',
            withdrawal_amount: '',
            pay_price: '',
            pay_gasoline: '',
            pay_total: '',
            return_people: ''
        }
    })

    // Watch values for automatic calculation
    const withdrawal_amount = watch('withdrawal_amount')
    const pay_price = watch('pay_price')
    const pay_gasoline = watch('pay_gasoline')

    // Calculate remaining balance whenever any of the watched values change
    useEffect(() => {
        if (withdrawal_amount && pay_price && pay_gasoline) {
            const remaining = Number(withdrawal_amount) - (Number(pay_price) + Number(pay_gasoline))
            setValue('pay_total', remaining.toString())
            // Set return_people based on remaining balance
            setValue('return_people', remaining >= 0 ? 'คืนบริษัท' : 'คืนพี่เปิ้ล')
        }
    }, [withdrawal_amount, pay_price, pay_gasoline, setValue])

    useEffect(() => {
        if (formwithdrawal) {
            setValue('invoice_package', formwithdrawal.invoice_package || '')
            setValue('consignee', formwithdrawal.consignee || '')
            setValue('head_tractor', formwithdrawal.head_tractor || '')
            setValue('withdrawal_date', formwithdrawal.withdrawal_date || '')
            setValue('withdrawal_amount', formwithdrawal.withdrawal_amount || '')
            setValue('pay_price', formwithdrawal.pay_price || '')
            setValue('pay_gasoline', formwithdrawal.pay_gasoline || '')
            setValue('pay_total', formwithdrawal.pay_total || '')
            setValue('return_people', formwithdrawal.return_people || '')
            // If editing, store the ID
            if (formwithdrawal.id) {
                setSelectedInvoiceId(formwithdrawal.id)
            }
        }
    }, [formwithdrawal, setValue])

    // TODO: Implement API call to fetch invoice options
    const fetchInvoiceOptions = async (searchQuery: string) => {
        // This will be implemented when the API is ready
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/purchase?search=${searchQuery}`)
        const data = await response.data.data;
        setOptions(data.map((item: any) => ({ id: item.id, invoice_package: item.d_shipment_number })))
    }

    useEffect(() => {
        if (query) {
            fetchInvoiceOptions(query)
        }
    }, [query])

    const onSubmit = async (data: any) => {
        try {
            const endpoint = formwithdrawal?.id 
                ? `${process.env.NEXT_PUBLIC_URL_API}/finance/updateWidhdrawalInformation`
                : `${process.env.NEXT_PUBLIC_URL_API}/finance/submitwidhdrawalInformation`

            const payload = {
                ...data,
                d_purchase_id: selectedInvoiceId,
                withdrawal_date: moment(data.withdrawal_date).format('YYYY-MM-DD')
            }

            // If editing, include the ID
            if (formwithdrawal?.id) {
                payload.id = formwithdrawal.id
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
            
                dispatch(setFormWithdrawal({
                    invoice_package: '',
                    consignee: '',
                    withdrawal_date: '',
                    head_tractor: '',
                    withdrawal_amount: '',
                    pay_price: '',
                    pay_gasoline: '',
                    pay_total: '',
                    return_people: ''
                }))
                
                // Call the refresh callback
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

    const handleClose = () => {
        // Clear form when closing
        dispatch(setFormWithdrawal({
            invoice_package: '',
            consignee: '',
            withdrawal_date: '',
            head_tractor: '',
            withdrawal_amount: '',
            pay_price: '',
            pay_gasoline: '',
            pay_total: '',
            return_people: ''
        }))
        dispatch(setModalWithdrawal(false))
    }

    const filteredOptions = options.filter((option: any) =>
        option?.invoice_package?.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <Transition.Root show={modalWithdrawal} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            เพิ่มข้อมูลการเบิกเงินแผนกชิป
                                        </Dialog.Title>

                                        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Invoice & PackingList No.
                                                    </label>
                                                    <Controller
                                                        name="invoice_package"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <Combobox
                                                                as="div"
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    field.onChange(value)
                                                                    // Find the selected option and store its ID
                                                                    const selectedOption = options.find(opt => opt.invoice_package === value)
                                                                    if (selectedOption) {
                                                                        setSelectedInvoiceId(selectedOption.id)
                                                                    }
                                                                }}
                                                            >
                                                                <div className="relative">
                                                                    <Combobox.Input
                                                                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                                        onChange={(event) => setQuery(event.target.value)}
                                                                        displayValue={(value: string) => value}
                                                                        placeholder="กรุณาค้นหา"
                                                                    />
                                                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                    </Combobox.Button>

                                                                    {filteredOptions.length > 0 && (
                                                                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                            {filteredOptions.map((option:any) => (
                                                                                <Combobox.Option
                                                                                    key={option.id}
                                                                                    value={option.invoice_package}
                                                                                    className={({ active }) =>
                                                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                                                            active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                                        }`
                                                                                    }
                                                                                   
                                                                                >
                                                                                    {option.invoice_package}
                                                                                </Combobox.Option>
                                                                            ))}
                                                                        </Combobox.Options>
                                                                    )}
                                                                </div>
                                                            </Combobox>
                                                        )}
                                                    />
                                                    {errors.invoice_package && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.invoice_package.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Consignee
                                                    </label>
                                                    <Controller
                                                        name="consignee"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.consignee && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.consignee.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        หัวจ่าย
                                                    </label>
                                                    <Controller
                                                        name="head_tractor"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <Combobox
                                                                as="div"
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    // If value is not in options, add it
                                                                    if (value && !headTractorOptions.includes(value)) {
                                                                        setHeadTractorOptions([...headTractorOptions, value])
                                                                    }
                                                                    field.onChange(value)
                                                                }}
                                                            >
                                                                <div className="relative">
                                                                    <Combobox.Input
                                                                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                                        onChange={(event) => setHeadTractorQuery(event.target.value)}
                                                                        displayValue={(value: string) => value}
                                                                        placeholder="เลือกหัวจ่าย"
                                                                    />
                                                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                    </Combobox.Button>

                                                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                        {filteredHeadTractorOptions.map((option) => (
                                                                            <Combobox.Option
                                                                                key={option}
                                                                                value={option}
                                                                                className={({ active }) =>
                                                                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                                                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                                    }`
                                                                                }
                                                                            >
                                                                                {option}
                                                                            </Combobox.Option>
                                                                        ))}
                                                                        {headTractorQuery && !filteredHeadTractorOptions.includes(headTractorQuery) && (
                                                                            <Combobox.Option
                                                                                value={headTractorQuery}
                                                                                className={({ active }) =>
                                                                                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                                                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                                    }`
                                                                                }
                                                                            >
                                                                                เพิ่ม "{headTractorQuery}"
                                                                            </Combobox.Option>
                                                                        )}
                                                                    </Combobox.Options>
                                                                </div>
                                                            </Combobox>
                                                        )}
                                                    />
                                                    {errors.head_tractor && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.head_tractor.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        วันที่เบิก
                                                    </label>
                                                    <Controller
                                                        name="withdrawal_date"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="date"
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
                                                        ยอดเบิก
                                                    </label>
                                                    <Controller
                                                        name="withdrawal_amount"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.withdrawal_amount && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.withdrawal_amount.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        ยอดจ่าย
                                                    </label>
                                                    <Controller
                                                        name="pay_price"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.pay_price && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.pay_price.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        ค่าน้ำมัน
                                                    </label>
                                                    <Controller
                                                        name="pay_gasoline"
                                                        control={control}
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.pay_gasoline && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.pay_gasoline.message}</p>
                                                    )}
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
                                                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                                                        rules={{ required: 'This field is required' }}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                readOnly
                                                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                        )}
                                                    />
                                                    {errors.return_people && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.return_people.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                                                <Button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    onClick={handleClose}
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
                                        </form>
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