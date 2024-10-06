import { useForm, Controller, FormProvider } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import moment from "moment";
import { customerData } from "@/stores/customer";

import { submitPrePurchase } from "@/stores/purchase";

//interface

import { RouteData, TermData, TransportData } from "../prepurchase.interface";

//service

import { getSelectCustomer } from "@/services/customer";

//component

import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import SelectAutocomplete from "@/components/Autocomplete/SelectAutoComplete";
import Lucide from "@/components/Base/Lucide";

const AddPurchase = ({ BookingId }: any) => {
  const dispatch = useAppDispatch();
  const methods = useForm();
  const [selectCustomer, SetSelectCustomer] = useState<any[]>([]);
  const session: any = useSession();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;

  const router = useRouter();
  const [openTag,setOpenTag] = useState<boolean>(false)
  const [data, setData] = useState<Partial<any>>({});
  const [Bookdate, SetBookingDate] = useState<string>(
    moment().format("DD/MM/DD HH:mm")
  );

  async function onSubmit(request: any) {
    try {
      request.book_number = BookingId;
      console.log("request", request.files);
      dispatch(submitPrePurchase(request)).then((response:any) => {
        if (response.payload.data.statusCode === 200) {
          router.push("/purchase");
        } 
      })
    } catch (err) {
      console.log(err);
    }
  }



  const handleSelect = (selectedOption: Partial<any>) => {
    setValue("customer_id", selectedOption.id);
  };

  useEffect(() => {
    (async () => {
      let customer: any = await getSelectCustomer();
      console.log("customerSelect", customer);
      SetSelectCustomer(customer);
    })();
  }, []);

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-auto flex flex-col ">
            <div className="bg-[#D2D6E1] bg-opacity-30 p-2   flex items-center">
              <Lucide
                color="#6C9AB5"
                icon="Info"
                className="inset-y-0 bg-secondary-400  pr-1  justify-center  text-slate-500"
              ></Lucide>

              <label className={"pr-5"}>เลือกรายชื่อลูกค้า </label>

              <div className="relative ">
                <SelectAutocomplete
                  options={selectCustomer}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          </div>
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
          <h1 className="mb-5  text-1xl">ข้อมูลขนส่ง</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Route
              </label>
              <Controller
                name="d_route"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <select
                    onChange={onChange}
                    value={value}
                    id="countries"
                    className={`${
                      errors.d_route ? "border-red-500" : "border-gray-200"
                    } border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  >
                    <option selected>เลือก</option>
                    {RouteData.map((item, index) => {
                      return (
                        <>
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        </>
                      );
                    })}
                  </select>
                )}
              />
              {errors.d_route && <p className="text-red-500">กรุณาเลือก.</p>}
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                ขนส่ง
              </label>
              <Controller
                name="d_transport"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <select
                    onChange={onChange}
                    value={value}
                    id="countries"
                    className={`${
                      errors.d_transport ? "border-red-500" : "border-gray-200"
                    } border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                         dark:focus:border-blue-500`}
                  >
                    <option selected>เลือก</option>
                    {TransportData.map((item, index) => {
                      return (
                        <>
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        </>
                      );
                    })}
                  </select>
                )}
              />
              {errors.d_transport && (
                <p className="text-red-500">กรุณาเลือก.</p>
              )}
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Term
              </label>
              <Controller
                name="d_term"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <select
                    onChange={onChange}
                    value={value}
                    id="countries"
                    className={`${
                      errors.d_term ? "border-red-500" : "border-gray-200"
                    } border border-gray-200 text-gray-900 text-sm rounded-lg 
                                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  >
                    <option selected>เลือก</option>
                    {TermData.map((item, index) => {
                      return (
                        <>
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        </>
                      );
                    })}
                  </select>
                )}
              />
              {errors.d_term && <p className="text-red-500">กรุณาเลือก.</p>}
            </div>
          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block flex mb-1 text-gray-600 font-semibold">
                เลือกประเภทงาน
              </label>
              <Controller
                name="d_group_work"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <select
                    onChange={onChange}
                    className=" border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                  >
                    <option value="เลือกประเภทงาน">เลือกประเภทงาน</option>
                    <option value="งานเหมา Allin">งานเหมา Allin</option>
                    <option value="งาน Shipping">งาน Shipping</option>
                    <option value="งาน Green ตามจริง">งาน Green ตามจริง</option>
                    <option value="งานเคลียร์ขาเข้าทางเรือ">
                      งานเคลียร์ขาเข้าทางเรือ
                    </option>
                    <option value="งานเคลียร์ขาเข้าทางรถ">
                      งานเคลียร์ขาเข้าทางรถ
                    </option>
                  </select>
                )}
              />
              {errors.d_group_work && (
                <p className="text-red-500">กรุณากรอกประเภทงาน.</p>
              )}
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                วันที่โหลดตู้
              </label>
              <Controller
                name="date_cabinet"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="date"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                  />
                )}
              />
              {errors.date_cabinet && (
                <p className="text-red-500">กรุณากรอกชื่อสินค้า.</p>
              )}
            </div>
          </div>

          <hr className="mb-5 mt-5"></hr>
          <h1 className="mb-5  text-1xl">ข้อมูลสินค้า</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                ชื่อสินค้า
              </label>
              <Controller
                name="d_product"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                  />
                )}
              />
              {errors.d_product && (
                <p className="text-red-500">กรุณากรอกชื่อสินค้า.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2 text-gray-700  text-sm font-semibold">
                เพิ่มรูปภาพ / ไฟล์
              </label>
              <UploadImageComponent
                setValue={setValue}
                control={control}
              ></UploadImageComponent>
            </div>
          </div>

          <hr className="mb-5 mt-5"></hr>
          <h1 className="mb-5  text-1xl">ข้อมูลการขนส่ง</h1>
          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Port ต้นทาง
              </label>
              <Controller
                name="d_origin"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_origin ? "border-red-500" : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_origin && (
                <p className="text-red-500">กรุณากรอกข้อมูลต้นทาง.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">
                Port ปลายทาง
              </label>
              <Controller
                name="d_destination"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_destination
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_destination && (
                <p className="text-red-500">กรุณากรอกข้อมูลปลายทาง.</p>
              )}
            </div>
          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
              <div className="w-full md:w-2/4 flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">
                  ขนาดตู้
                </label>
                <Controller
                  name="d_size_cabinet"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      type="text"
                      onChange={onChange}
                      value={value}
                      placeholder="กรอก"
                      className={`${
                        errors.d_size_cabinet
                          ? "border-red-500"
                          : "border-gray-200"
                      } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                    />
                  )}
                />
                {errors.d_size_cabinet && (
                  <p className="text-red-500">กรุณากรอกรหัสตู้.</p>
                )}
              </div>
              <div className="w-full md:w-2/4  flex flex-col">
                <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">
                  น้ำหนัก
                </label>
                <Controller
                  name="d_weight"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      type="text"
                      onChange={onChange}
                      value={value}
                      placeholder="กรอก"
                      className={`${
                        errors.d_weight ? "border-red-500" : "border-gray-200"
                      } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                    />
                  )}
                />
                {errors.d_weight && <p className="text-red-500">น้ำหนัก.</p>}
              </div>
            </div>
            <div className="w-full md:w-1/2  flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                บริการหัวรถลาก
              </label>
              <Controller
                name="d_truck"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
                      <div className="flex w-1/2 items-center ps-3 border border-gray-200 rounded dark:border-gray-700">
                        <input
                          onChange={onChange}
                          id="bordered-radio-2"
                          type="radio"
                          value="บริการหัวลากต้นทาง"
                          name="bordered-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          บริการหัวลากต้นทาง
                        </label>
                      </div>
                      <div className="flex  w-1/2  items-center ps-3 border border-gray-200 rounded dark:border-gray-700">
                        <input
                          onChange={onChange}
                          id="bordered-radio-2"
                          type="radio"
                          value="บริการหัวลากปลายทาง"
                          name="bordered-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          บริการหัวลากปลายทาง
                        </label>
                      </div>
                    </div>
                  </>
                  // <input
                  //   type="text"
                  //   onChange={onChange}
                  //   value={value}
                  //   placeholder="กรอก"
                  //   className={`${
                  //     errors.d_truck ? "border-red-500" : "border-gray-200"
                  //   } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  // />
                )}
              />
              {errors.d_truck && (
                <p className="text-red-500">บริการหัวรถลาก.</p>
              )}
            </div>
          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2 text-gray-700  text-sm font-semibold">
                ที่อยู่ต้นทาง
              </label>
              <Controller
                name="d_address_origin"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_origin
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_origin && (
                <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                ที่อยู่ปลายทาง{" "}
              </label>
              <Controller
                name="d_address_destination"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_weight ? "border-red-500" : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_destination && (
                <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>
              )}
            </div>
          </div>

          <div className=" flex w-full flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Latitude
              </label>
              <Controller
                name="d_address_origin_la"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_origin_la
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_origin_la && (
                <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Longitude{" "}
              </label>
              <Controller
                name="d_address_origin_long"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_origin_long
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_origin_long && (
                <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Latitude
              </label>
              <Controller
                name="d_address_destination_la"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_destination_la
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_destination_la && (
                <p className="text-red-500">กรุณากรอกที่อยู่ต้นทาง.</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Longitude{" "}
              </label>
              <Controller
                name="d_address_destination_long"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_destination_long
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.d_address_destination_long && (
                <p className="text-red-500">กรุณากรอกที่อยู่ปลายทาง.</p>
              )}
            </div>
          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
              Link map ต้นทาง{" "}
              </label>
              <Controller
                name="link_d_origin"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_destination_long
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.link_d_origin && (
                <p className="text-red-500">กรุณากรอกLinkmap.</p>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
              Link map ปลายทาง{" "}
              </label>
              <Controller
                name="link_d_destination"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_address_destination_long
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
              {errors.link_ && (
                <p className="text-red-500">กรุณากรอกLinkmap.</p>
              )}
            </div>

          </div>

          <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                Refund Tax ต้นทาง
              </label>

              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
                <div className="flex w-1/2 items-center ps-3  rounded">
                  <input
                    onChange={() => {
                      setOpenTag(true)
                    }}
                    id="bordered-radio-1"
                    type="radio"
                    value="true"
                    name="bordered-radio-1"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    ใช่
                  </label>
                </div>
                <div className="flex  w-1/2  items-center ps-3">
                  <input
                    onChange={() => {
                      setOpenTag(false)
                    }}
                    id="bordered-radio-1"
                    type="radio"
                    value="false"
                    name="bordered-radio-1"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    ไม่ใช่
                  </label>
                </div>
              </div>
            {openTag &&
              <Controller
                name="d_refund_tag"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className={`${
                      errors.d_refund_tag ? "border-red-500" : "border-gray-200"
                    } px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}
                  />
                )}
              />
            }
              {errors.d_weight && (
                <p className="text-red-500">กรุณากรอก Refund Tax ต้นททาง.</p>
              )}
            
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <label className="block mb-2  text-gray-700  text-sm font-semibold">
                หมายเหตุ{" "}
              </label>
              <Controller
                name="d_etc"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    placeholder="กรอก"
                    className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base"
                  />
                )}
              />
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

export default AddPurchase;
