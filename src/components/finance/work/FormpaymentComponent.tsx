import { useForm, Controller, FormProvider } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import moment from "moment";
import { customerData } from "@/stores/customer";

import { submitPrePurchase } from "@/stores/purchase";

//interface



//service

import { getSelectCustomer } from "@/services/customer";

//component

import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import SelectAutocomplete from "@/components/Autocomplete/SelectAutoComplete";
import Lucide from "@/components/Base/Lucide";
import Swal from "sweetalert2";

const FormfinanceComponent = ({ BookingId }: any) => {
    const dispatch = useAppDispatch();
    const methods = useForm();
    const [selectCustomer, SetSelectCustomer] = useState<any[]>([]);

    const [PriceCh, SetPriceCh] = useState<number>(0)
    const session: any = useSession();
    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
        watch
    } = methods;

    const router = useRouter();
    const [openTag, setOpenTag] = useState<boolean>(false)
    const [data, setData] = useState<Partial<any>>({});
    const [Bookdate, SetBookingDate] = useState<string>(
        moment().format("DD/MM/DD HH:mm")
    );

    const setPriceCh = (value: string) => {
        console.log('value', value)
        const fresh_ch = watch('ch_freight') * Number(value)
        setValue('ch_freight_total', fresh_ch)
    }

    const onSubmit = async (data: any) => {
        try {

        }
        catch (err: any) {

        }
    }

    const numberFormatTh = (number: any) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const numberFormatcn = (number: any) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }


    const calculateTotalShipping = useCallback(() => {
        const th_duty = watch('th_duty') || 0;
        const th_tax = watch('th_tax') || 0;
        const th_custom_fees = watch('th_custom_fees') || 0;
        const th_employee = watch('th_employee') || 0;
        const th_warehouse = watch('th_warehouse') || 0;
        const th_gasoline = watch('th_gasoline') || 0;
        const th_other_shipping = watch('th_other_shipping') || 0;
        const th_overtime = watch('th_overtime') || 0;
        const th_hairy = watch('th_hairy') || 0;
        const th_head_tractor = watch('th_head_tractor') || 0;
        const th_price_head_tractor = watch('th_price_head_tractor') || 0;
        const th_other_fee = watch('th_other_fee') || 0;

        const total =
            Number(th_duty) +
            Number(th_tax) +
            Number(th_custom_fees) +
            Number(th_employee) +
            Number(th_warehouse) +
            Number(th_gasoline) +
            Number(th_other_shipping) +
            Number(th_overtime);
        setValue('th_total_shipping', total);
    }, [
        watch('th_duty'),
        watch('th_tax'),
        watch('th_custom_fees'),
        watch('th_employee'),
        watch('th_warehouse'),
        watch('th_gasoline'),
        watch('th_other_shipping'),
        watch('th_overtime'),
    ]);

    useEffect(() => {
        calculateTotalShipping();
    }, [calculateTotalShipping]);

    useEffect(() => {
        (async () => {
            let customer: any = await getSelectCustomer();
            console.log("customerSelect", customer);
            SetSelectCustomer(customer);
        })();
    }, []);

    return (
        <div className="flex flex-col p-5">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className=" flex  flex-col  md:flex-row  mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                เลขตีราคา
                            </label>
                            <p>{BookingId}</p>
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ชื่อเซลล์
                            </label>
                            {session?.data?.fullname} ({session?.data?.role})
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                วันที่/เวลา
                            </label>
                            {Bookdate && <p>{Bookdate}</p>}
                        </div>
                    </div>

                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm">
                                invoice & Packinglist No.
                            </label>
                        </div>
                    </div>

                    <hr className="mb-5"></hr>
                    <h1 className="mb-5  text-1xl font-bold">ค่าใช้จ่ายฝั่งจีน</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                Freight (cn)
                            </label>
                            <Controller
                                name="ch_freight"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.d_destination
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.ch_freight && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                เรทเงิน
                            </label>
                            <Controller
                                name="ch_rate"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                            setPriceCh(event.target.value)
                                        }} value={value} placeholder="กรอกเรทเงิน"
                                            className={`${errors.ch_rate
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.ch_rate && (
                                <p className="text-red-500">กรุณาเลือกประเภทเรทเงิน.</p>
                            )}
                        </div>


                    </div>

                    <div className="w-full flex flex-col self-end align-end mt-10"
                        style={{ justifyContent: "end", alignItems: "self-end" }}
                    >
                        <label className="block mb-2  text-gray-700  text-sm font-semibold">
                            รวมฝั่งจีน
                        </label>
                        <Controller
                            name="ch_freight_total"
                            control={control}
                            rules={{ required: false }}
                            defaultValue={0}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <p>
                                        {value === 0 ? value : numberFormatcn(value)} THB
                                    </p>
                                </>
                            )}
                        />
                        {errors.ch_rate && (
                            <p className="text-red-500">กรุณาเลือกประเภทเรทเงิน.</p>
                        )}
                    </div>



                    <hr className="mb-5 mt-10"></hr>
                    <h1 className="mb-5  text-1xl font-bold">ค่าใช้จ่ายฝั่งไทย</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                อากร
                            </label>
                            <Controller
                                name="th_duty"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.th_duty
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_duty && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ภาษี
                            </label>
                            <Controller
                                name="th_tax"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกข้อมูล"
                                            className={`${errors.th_tax
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_tax && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>


                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ค่าธรรมเนียบศุลกากร
                            </label>
                            <Controller
                                name="th_custom_fees"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกข้อมูล"
                                            className={`${errors.th_custom_fees
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_custom_fees && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>

                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ค่าล่วงเวลา
                            </label>
                            <Controller
                                name="th_overtime"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกข้อมูล"
                                            className={`${errors.th_overtime
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_overtime && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>



                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                เคลียเจ้าหน้าที่
                            </label>
                            <Controller
                                name="th_employee"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.th_employee
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_employee && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ค่าเช่าโกดัง
                            </label>
                            <Controller
                                name="th_warehouse"
                                control={control}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกรายละเอียด"
                                            className={`${errors.th_warehouse
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_warehouse && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>




                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">

                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ค่าน้ำมัน Shipping
                            </label>
                            <Controller
                                name="th_gasoline"
                                defaultValue={0}
                                control={control}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกข้อมูล"
                                            className={`${errors.th_gasoline
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_gasoline && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>


                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                อื่นๆชิปปิ้ง
                            </label>
                            <Controller
                                name="th_other_shipping"
                                defaultValue={0}
                                control={control}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.th_other_shipping
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_other_shipping && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                    </div>

                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">

                        <div className="w-full   flex flex-col justify-end  align-end"
                            style={{
                                justifyContent: "end", alignItems: "end"

                            }}
                        >
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                รวมเคลียร์Shipping
                            </label>
                            <Controller
                                name="th_total_shipping"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <p>
                                            {value === 0 ? value : numberFormatTh(value)}  THB
                                        </p>
                                    </>
                                )}
                            />
                            {errors.th_total_shipping && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>




                    </div>








                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                หัวลาก
                            </label>
                            <Controller
                                name="th_head_tractor"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.th_head_tractor
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_head_tractor && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                ค่าใช้จ่ายหัวลาก
                            </label>
                            <Controller
                                name="th_price_head_tractor"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกรายละเอียด"
                                            className={`${errors.th_price_head_tractor
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_price_head_tractor && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>


                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                อื่นๆ
                            </label>
                            <Controller
                                name="th_other_fee"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                        }} value={value} placeholder="กรอกเรทเงิน"
                                            className={`${errors.th_other_fee
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.th_other_fee && (
                                <p className="text-red-500">กรุณากรอกข้อมูลภาษี.</p>
                            )}
                        </div>

                    </div>





                    <hr className="mb-5"></hr>
                    <h1 className="mb-5  text-1xl font-bold">รวม ค่าใช้จ่าย</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                รวมเคลียร์Shipping
                            </label>
                            <Controller
                                name="ch_freight"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={onChange}
                                            value={value}
                                            placeholder="กรอกข้อมูล"
                                            className={`${errors.d_destination
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.ch_freight && <p className="text-red-500">กรุณาเลือกกรอกข้อมูล.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm font-semibold">
                                เรทเงิน
                            </label>
                            <Controller
                                name="ch_rate"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^[0-9]*$/,
                                        message: "กรุณากรอกตัวเลขเท่านั้น"
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <input type="number" onChange={(event) => {
                                            onChange(event.target.value)
                                            setPriceCh(event.target.value)
                                        }} value={value} placeholder="กรอกเรทเงิน"
                                            className={`${errors.ch_rate
                                                ? "border-red-500"
                                                : "border-gray-200"
                                                } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                        />
                                    </>
                                )}
                            />
                            {errors.ch_rate && (
                                <p className="text-red-500">กรุณาเลือกประเภทเรทเงิน.</p>
                            )}
                        </div>


                    </div>




                    <div className="flex items-center justify-end  rounded-b mt-5">
                        <button
                            style={{
                                border: "1px solid #417CA0",
                                color: "#305D79",
                                marginRight: "10px",
                            }}
                            className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => reset()}
                        >
                            ยกเลิก
                        </button>
                        <button
                            className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg   mr-1 mb-1 "
                            type="submit"
                        // onClick={() => setShowModal(false)}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default FormfinanceComponent;
