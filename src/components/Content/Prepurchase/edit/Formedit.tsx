"use client";

import React, { useState, useEffect, Fragment } from 'react';

//lib
import { useForm, Controller, SubmitHandler, FormProvider } from "react-hook-form"
import { useSession } from 'next-auth/react';
import moment from 'moment'

//interface
import {
  RouteData,
  TermData,
  TransportData,
} from '../prepurchase.interface'


//store 
import { useAppDispatch } from '@/stores/hooks';
import { changeFormeditPurchase, submitEditPrePurchase } from '@/stores/purchase';

//component
import Lucide from "@/components/Base/Lucide";
import EdituploadComponent from '@/components/Uploadimage/edit/EdituploadComponent';
import UploadImageComponent from '@/components/Uploadimage/UpdateImageComponent';


const FormEdit = ({ purchase }: {
  purchase: Partial<any>
}) => {
  const methods = useForm()
  const session: any = useSession()
  const dispatch = useAppDispatch()

  const [Bookdate, setBookdate] = useState<string>(moment(purchase.createdAt).format('YYYY-MM-DD HH:mm:ss'))

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;

  //hook
  useEffect(() => {
    console.log('formProduct', purchase)
  }, [purchase])


  const viewEdit = (value: boolean) => {
    dispatch(changeFormeditPurchase(value))
  }

  //function 
  const onSubmit: SubmitHandler<any> = (data) => {
    try {
      data.id = purchase.id

      console.log("dataSubmit", data)
      dispatch(submitEditPrePurchase(data));
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* <div className="h-auto flex flex-col ">
            <div
              className="bg-[#D2D6E1] bg-opacity-30 p-2   flex items-center">
              <Lucide
                color="#6C9AB5"
                icon="Info"
                className="inset-y-0 bg-secondary-400  pr-1  justify-center  text-slate-500"></Lucide>

              <label className={"pr-5"}>เลือกรายชื่อลูกค้า11 </label>

              <div className="relative ">
               
              </div>

            </div>
          </div> */}
          <div className=" flex  flex-col  md:flex-row  mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">เลขตีราคา</label>
              {purchase.book_number}
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">ชื่อเซลล์</label>

              {session?.data?.fullname} ({session?.data?.role})

            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">วันที่/เวลา</label>
              {Bookdate &&
                <p>{Bookdate}</p>
              }

            </div>
          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm">invoice & Packinglist No.</label>

            </div>
          </div>


          <hr className="mb-5"></hr>
          <h1 className="mb-5  text-1xl">ข้อมูลขนส่ง</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">Route</label>
              <Controller
                name="d_route"
                control={control}
                rules={{ required: true }}
                defaultValue={purchase.d_route}
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
              <label className="block mb-2  text-gray-700  text-sm font-semibold">ขนส่ง</label>
              <Controller
                name="d_transport"
                control={control}
                rules={{ required: true }}
                defaultValue={purchase.d_transport}
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
              <label className="block mb-2  text-gray-700  text-sm font-semibold">Term</label>
              <Controller
                name="d_term"
                control={control}
                rules={{ required: true }}
                defaultValue={purchase.d_term}
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

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block flex mb-1 text-gray-600 font-semibold">เลือกประเภทงาน</label>
              <Controller
                name="d_group_work"
                defaultValue={purchase.d_group_work}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <select
                    onChange={onChange}
                    value={value}
                    className=" border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ">
                    <option value="เลือกประเภทงาน">เลือกประเภทงาน</option>
                    <option value="งานเหมา Allin">งานเหมา Allin</option>
                    <option value="งาน Shipping">งาน Shipping</option>
                    <option value="งาน Green ตามจริง">งาน Green ตามจริง</option>
                    <option value="งานเคลียร์ขาเข้าทางเรือ">งานเคลียร์ขาเข้าทางเรือ</option>
                    <option value="งานเคลียร์ขาเข้าทางรถ">งานเคลียร์ขาเข้าทางรถ</option>

                  </select>
                )}

              />
              {errors.d_group_work && <p className="text-red-500">กรุณากรอกประเภทงาน.</p>}
            </div>
          </div>


          <hr className="mb-5 mt-5"></hr>
          <h1 className="mb-5  text-1xl">ข้อมูลสินค้า</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">ชื่อสินค้า</label>
              <Controller
                name="d_product"
                control={control}
                defaultValue={purchase.d_product.d_product_name}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                )}
              />
              {errors.d_product && <p className="text-red-500">กรุณากรอกชื่อสินค้า.</p>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">เพิ่มรูปภาพ / ไฟล์</label>
              <EdituploadComponent setValue={setValue} control={control}
                image={purchase.d_product.d_product_image}
              ></EdituploadComponent>
            </div>
          </div>


          <hr className="mb-5 mt-5"></hr>
          <h1 className="mb-5  text-1xl">ข้อมูลการขนส่ง</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">Port
                ต้นทาง</label>
              <Controller
                name="d_origin"
                control={control}
                defaultValue={purchase.d_origin}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_origin ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_origin && <p className="text-red-500">กรุณากรอกข้อมูลต้นทาง.</p>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2 text-gray-700  text-sm font-semibold">Port
                ปลายทาง</label>
              <Controller
                name="d_destination"
                defaultValue={purchase.d_destination}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_destination ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_destination && <p className="text-red-500">กรุณากรอกข้อมูลปลายทาง.</p>}
            </div>

          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
              <div className="w-full md:w-2/4 flex flex-col">
                <label
                  className="block mb-2  text-gray-700  text-sm font-semibold">ขนาดตู้</label>
                <Controller
                  name="d_size_cabinet"
                  defaultValue={purchase.d_size_cabinet}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                      className={`${errors.d_size_cabinet ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                  )}
                />
                {errors.d_size_cabinet && <p className="text-red-500">กรุณากรอกรหัสตู้.</p>}
              </div>
              <div className="w-full md:w-2/4  flex flex-col">
                <label
                  className="block mb-2 text-gray-700  text-sm font-semibold">น้ำหนัก</label>
                <Controller
                  name="d_weight"
                  defaultValue={purchase.d_weight}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                      className={`${errors.d_weight ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                  )}
                />
                {errors.d_weight && <p className="text-red-500">น้ำหนัก.</p>}
              </div>

            </div>
            <div className="w-full md:w-1/2  flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">บริการหัวรถลาก</label>
              <Controller
                name="d_truck"
                defaultValue={purchase.d_truck}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_truck ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_truck && <p className="text-red-500">บริการหัวรถลาก.</p>}
            </div>
          </div>


          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">ที่อยู่ต้นทาง</label>
              <Controller
                name="d_address_origin"
                defaultValue={purchase.d_address_origin}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <textarea onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_address_origin ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_origin && <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">ที่อยู่ปลายทาง </label>
              <Controller
                name="d_address_destination"
                defaultValue={purchase.d_address_destination}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <textarea onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_weight ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_destination && <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>}
            </div>
          </div>

          <div className=" flex w-full flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">Latitude</label>
              <Controller
                name="d_address_origin_la"
                defaultValue={purchase.d_address_origin_la}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_address_origin_la ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_origin_la && <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">Longitude </label>
              <Controller
                name="d_address_origin_long"
                defaultValue={purchase.d_address_origin_long}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_address_origin_long ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_origin_long && <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>}
            </div>


            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">Latitude</label>
              <Controller
                name="d_address_destination_la"
                defaultValue={purchase.d_address_destination_la}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_address_destination_la ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_destination_la && <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label
                className="block mb-2  text-gray-700  text-sm font-semibold">Longitude </label>
              <Controller
                name="d_address_destination_long"
                defaultValue={purchase.d_address_destination_long}
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className={`${errors.d_address_destination_long ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`} />
                )}
              />
              {errors.d_address_destination_long && <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>}
            </div>

          </div>



          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">Refund Tax
                ต้นทาง</label>
              <Controller
                name="d_refund_tag"
                defaultValue={purchase.d_refund_tag}
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
              <label className="block mb-2  text-gray-700  text-sm font-semibold">หมายเหตุ </label>
              <Controller
                name="d_etc"
                control={control}
                defaultValue={purchase.d_etc}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input type="text" onChange={onChange} value={value} placeholder="กรอก"
                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                )}
              />
            </div>
          </div>



          <hr className="mb-5 mt-5"></hr>


          <div className="flex items-center justify-end  rounded-b mt-5">
            <button
              style={{
                border: '1px solid #417CA0',
                color: "#305D79",
                marginRight: '10px'
              }}
              className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                viewEdit(false)
              }}
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
    </>
  )
}

export default FormEdit