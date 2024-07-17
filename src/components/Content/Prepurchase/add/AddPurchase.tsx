import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setOpenToast } from '@/stores/util';
import { signIn } from 'next-auth/react';

import { getPurchaseById } from '@/services/purchase'

import { customerData } from '@/stores/customer'


import {
    setPurchaseData,
    submitPrePurchase,
    purchaseData
} from '@/stores/purchase'

//interface

import {
    RouteData,
    TermData,
    TransportData,
} from '../prepurchase.interface'


//component

import UploadImageComponent from '@/components/Content/Prepurchase/upload/UpdateImageComponent'

const  AddPurchase = ({purchase}:any) => {
    const { customer_detail } = useAppSelector(customerData)
    const dispatch = useAppDispatch()
    const methods = useForm()
    const {
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        getFieldState,
        setError,
        control,
        watch,
    } = methods;

    const router = useRouter();
    const [data, setData] = useState<Partial<any>>({})

    async function onSubmit(request: any) {
        try{
          request.customer_id = customer_detail.customer_id;
          request.book_number = data.book_number;

          console.log('request',request.files)
          dispatch(submitPrePurchase(request));
        }
        catch(err) {
          console.log(err)
        }
        finally{
          
        }
  
      }
    
      useEffect(() => {
          if (purchase) {
              setData(purchase)
          }
      }, [purchase])
    

    return (
        <div>
           <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className=" flex  flex-col  md:flex-row  mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เลขตีราคา</label>
                            <p>{data?.book_number}</p>
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ชื่อเซลล์</label>
                          
                          {customer_detail?.customer_emp?.length >0 && 
                           <p>{customer_detail.customer_emp[0].user?.fullname}</p>
                          }
                        
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">วันที่/เวลา</label>
                            <p>{customer_detail.cus_sex}</p>
                        </div>
                    </div>

                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2  text-gray-700  text-sm">invoice & Packinglist No.</label>
                            <Controller
                                name="customer_number"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก"  className={`${errors.customer_number ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                                )}
                            />
                            {errors.customer_number && <p className="text-red-500">กรุณากรอกinvoice & Packinglist No. (ถ้ามี).</p>}
                        </div>
                    </div>


                    <hr className="mb-5"></hr>
                    <h1 className="mb-5  text-1xl">ข้อมูลขนส่ง</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Route</label>
                            <Controller
                                name="d_route"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <select
                                        onChange={onChange}
                                        value={value}
                                        id="countries" 
                                        className={`${errors.d_route ? 'border-red-500' : 'border-gray-200'} border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                        >

                                        <option selected>เลือก</option>
                                        {RouteData.map((item, index) => {
                                            return (
                                                <>
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                </>
                                            )
                                        })
                                        }
                                    </select>
                                )}

                            />
                            {errors.d_route && <p className="text-red-500">กรุณาเลือก.</p>}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ขนส่ง</label>
                            <Controller
                                name="d_transport"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <select
                                        onChange={onChange}
                                        value={value}
                                        id="countries" 
                                        className={`${errors.d_transport ? 'border-red-500' : 'border-gray-200'} border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                         dark:focus:border-blue-500`}>

                                        <option selected>เลือก</option>
                                        {TransportData.map((item, index) => {
                                            return (
                                                <>
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                </>
                                            )
                                        })
                                        }
                                    </select>
                                )}

                            />
                            {errors.d_transport && <p className="text-red-500">กรุณาเลือก.</p>}
                        </div>
                        <div className="w-full md:w-1/3 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Term</label>
                            <Controller
                                name="d_term"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <select
                                        onChange={onChange}
                                        value={value}
                                        id="countries" className={`${errors.d_term ? 'border-red-500' : 'border-gray-200'} border border-gray-200 text-gray-900 text-sm rounded-lg 
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}>

                                        <option selected>เลือก</option>
                                        {TermData.map((item, index) => {
                                            return (
                                                <>
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                </>
                                            )
                                        })
                                        }
                                    </select>
                                )}

                            />
                            {errors.d_term && <p className="text-red-500">กรุณาเลือก.</p>}
                        </div>
                    </div>



                    <hr className="mb-5 mt-5"></hr>
                    <h1 className="mb-5  text-1xl">ข้อมูลสินค้า</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ชื่อสินค้า</label>
                            <Controller
                                name="d_product"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}
                            />
                            {errors.d_product && <p className="text-red-500">กรุณากรอกชื่อสินค้า.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">เพิ่มรูปภาพ</label>
                            <UploadImageComponent setValue={setValue} control={control} ></UploadImageComponent>
                        </div>
                    </div>


                    <hr className="mb-5 mt-5"></hr>
                    <h1 className="mb-5  text-1xl">ข้อมูลการขนส่ง</h1>
                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Port ต้นทาง</label>
                            <Controller
                                name="d_origin"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" 
                                    className={`${errors.d_origin ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                                )}
                            />
                                {errors.d_origin && <p className="text-red-500">กรุณากรอกข้อมูลต้นทาง.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Port ปลายทาง</label>
                            <Controller
                                name="d_destination"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" 
                                    className={`${errors.d_destination ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}  />
                                )}
                            />
                                {errors.d_destination && <p className="text-red-500">กรุณากรอกข้อมูลปลายทาง.</p>}
                        </div>

                    </div>

                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-2/4 flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ขนาดตู้</label>
                                <Controller
                                name="d_size_cabinet"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                                    className={`${errors.d_size_cabinet ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}  />
                                )}
                            />
                                {errors.d_size_cabinet && <p className="text-red-500">กรุณากรอกรหัสตู้.</p>}
                            </div>
                            <div className="w-full md:w-2/4  flex flex-col">
                                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">น้ำหนัก</label>
                                <Controller
                                name="d_weight"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className={`${errors.d_weight ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}/>
                                )}
                            />
                                {errors.d_weight && <p className="text-red-500">น้ำหนัก.</p>}
                            </div>

                        </div>
                        <div className="w-full md:w-1/2  flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">บริการหัวรถลาก</label>
                            <Controller
                                name="d_truck"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className={`${errors.d_truck ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                                )}
                            />
                                {errors.d_truck && <p className="text-red-500">บริการหัวรถลาก.</p>}
                        </div>
                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่อยู่ต้นทาง</label>
                            <Controller
                                name="d_address_origin"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <textarea  onChange={onChange} value={value} placeholder="กรอก" className={`${errors.d_address_origin ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                                )}
                            />
                                {errors.d_address_origin && <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่อยู่ปลายทาง </label>
                            <Controller
                                name="d_weight"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <textarea  onChange={onChange} value={value} placeholder="กรอก" className={`${errors.d_weight ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                                )}
                            />
                                {errors.d_weight && <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>}
                        </div>
                    </div>


                    <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Refund Tax ต้นทาง</label>
                            <Controller
                                name="d_refund_tag"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" 
                                    className={`${errors.d_refund_tag ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                                    />
                                )}
                            />
                                {errors.d_weight && <p className="text-red-500">กรุณากรอก Refund Tax ต้นททาง.</p>}
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">หมายเหตุ </label>
                            <Controller
                                name="d_etc"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end  rounded-b mt-5">
                            <button
                                style={{
                                    border: '1px solid #417CA0',
                                    color: "#305D79",
                                    marginRight: '10px'
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
    )
}

export default AddPurchase