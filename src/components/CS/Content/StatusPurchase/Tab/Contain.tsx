"use client";

import React, { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";




import { useRouter } from "next/navigation";
import {
    Controller,
    FormProvider,
    useForm
} from "react-hook-form";
import { Button } from "@headlessui/react";
import Lucide from "@/components/Base/Lucide";
import UploadImageComponent from "@/components/CS/Content/StatusPurchase/Tab/Image/UploadImageTab";
import { CirclePlus } from "lucide-react";
import Table from "@/components/Base/Table";

//service
import { getContain } from "@/services/statusOrder";


//store
import { statusOrderData, setEditForm, setForm ,createContain } from "@/stores/statusOrder"
import { setOpenToast } from "@/stores/util";


const ContainComponent = ({ purchase }: {
    purchase: any
}) => {

    const methods = useForm()

    const { status ,dataCspurchase } = useAppSelector(statusOrderData)

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

    const dispatch = useAppDispatch()
    const router = useRouter()

    const [dataStatus, setStatus] = useState<Partial<any>>({
        type: "view"
    })

    const [data, setData] = useState<any>({})

    useEffect(() => {
        setStatus(status)
    }, [status])

    

    const fetchData = useCallback(
        async (id_get: string) => {
          try {
            const response = await getContain(id_get);
            setData(response);
          } catch (error) {
            console.log(error);
          }
        },
        [dataCspurchase]
      );
    

    useEffect(() => {
        const checkCreate = dataCspurchase?.find((status: any) => {
          return status.status_key === "Contain";
        });
        if (checkCreate?.status_key == "Contain") {
          fetchData(checkCreate.id);
          dispatch(
            setForm({
              id: "3",
              tabName: "บรรจุตู้",
              tabKey: "Contain",
              active: true,
              type: "view",
            })
          );
        } else {
          dispatch(
            setForm({
              id: "2",
              tabName: "บรรจุตู้",
              tabKey: "Contain",
              active: true,
              type: "create",
            })
          );
        }
      }, [dataCspurchase]);


      const onSubmit = async (data: any) => {
        try {
          console.log("data", data);
          const formData = {
            ...data,
            d_purchase_id: purchase?.id,
          };
          if (status.type === "create") {
            dispatch(createContain(formData)).then((response: any) => {
              console.log("response", response);
              if (response.payload.data.statusCode == 200) {
                dispatch(setEditForm("view"));
                dispatch(
                  setOpenToast({
                    type: "success",
                    message: response.payload.message,
                  })
                );
              }
            });
          } else {
          }
        } catch (err: any) {
          console.log("errr", err);
        } finally {
        //   setTimeout(() => {
        //       location.reload()
        //   }, 2000)
        }
      };




    const changeEdit = (value: boolean) => {
        if (value) {
            dispatch(setEditForm("edit"))
        }
        else {
            dispatch(setEditForm("view"))
        }
    }


    const TablePlus = () => {
        return (
            <Table>
                <Table.Tr>
                    <Table.Th>สินค้า</Table.Th>
                    <Table.Th>H.s.Code</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>
                        <Controller
                            name="booking_date"
                            control={control}
                            defaultValue={dataStatus?.booking_date}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                    placeholder='กรอก'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                            )}
                        />
                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                    </Table.Td>
                    <Table.Td>
                        <Controller
                            name="booking_date"
                            control={control}
                            defaultValue={dataStatus?.booking_date}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                    placeholder='กรอก'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                            )}
                        />
                        {errors.booking_date && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                    </Table.Td>


                    <Table.Td >
                        <button type="button" className="bg-red-300  hover:bg-red-700 w-8 h-8 rounded-lg">
                            <Lucide
                                onClick={() => {
                                    console.log("click")
                                }}
                                color="#FF5C5C"
                                icon="Trash"
                                className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                            ></Lucide>
                        </button>
                    </Table.Td>
                </Table.Tr>
            </Table>
        )
    }



    return (
        <Fragment>
            <div>
                <div className="mx-auto text-black">
                    <div className="flex bg-gray-50">
                        <div className=" flex-1 w-50  px-5  rounded-md">
                            <h1 className="mb-5  text-1xl font-semibold">รายละเอียดบรรจุตู้</h1>
                        </div>
                        <div className="flex-end justify-center mt-1">
                            <Button
                                onClick={() => changeEdit(true)}
                                // onClick={() => changeEdit(!formEditcustomer)}
                                style={{
                                    background: "#C8D9E3",
                                    color: "#417CA0",
                                    width: "119px",
                                    height: "36px"
                                }}
                                className="flex hover:bg-blue-700   mr-1"
                            >
                                <Lucide
                                    color="#6C9AB5"
                                    icon="Pencil"
                                    className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
                                ></Lucide>
                                <p
                                    className="text-[#417CA0] text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"
                                >
                                    แก้ไขข้อมูล
                                </p>
                            </Button>
                        </div>
                    </div>
                </div>

                <FormProvider  {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">วันที่บรรจุตู้</label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="date_booking"
                                            control={control}
                                            defaultValue={data?.date_booking}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='กรุณากรอกข้อมูล'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="date" className={`
                                            ${errors.date_booking ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.date_booking && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.date_booking}</p>}
                            </div>

                        </div>



                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">Carbon Total
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="carbon_total"
                                            control={control}
                                            defaultValue={data?.carbon_total}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0.0'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.carbon_total ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.carbon_total && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.carbon_total}</p>}
                            </div>


                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">CBM Total
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="cmb_total"
                                            control={control}
                                            defaultValue={dataStatus?.cmb_total}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0.0'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.booking_date ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.cmb_total && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.cmb_total}</p>}
                            </div>

                        </div>


                        <div className="flex">
                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">N.W. Total
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="nw_total"
                                            control={control}
                                            defaultValue={dataStatus?.nw_total}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0.0'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.nw_total ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.nw_total && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.nw_total}</p>}
                            </div>


                            <div className="w-1/2 p-5">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">G.W. Total
                                </label>
                                {dataStatus.type !== "view" ?
                                    <>
                                        <Controller
                                            name="gw_total"
                                            control={control}
                                            defaultValue={dataStatus?.gw_total}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <input
                                                    placeholder='0.0'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    type="text" className={`
                                            ${errors.gw_total ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`} />
                                            )}
                                        />
                                        {errors.gw_total && <p className="text-red-500">กรุณากรอกข้อมูล.</p>}
                                    </>
                                    : <p>{data?.gw_total}</p>}
                            </div>

                        </div>


                        <div className="mx-auto text-black">
                            <div className="flex">
                                <div className=" flex-1 w-50  px-5  rounded-md">
                                    <h1 className="mb-5  text-1xl font-semibold">สินค้าทั้งหมด</h1>
                                </div>
                                {dataStatus.type !== "view" &&
                                    <div className="flex-end justify-center mt-1">
                                        <Button
                                            onClick={() => {
                                                console.log("click")
                                            }}
                                            className="flex items-center px-4 py-2 space-x-2 bg-[#273A6F]    text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <CirclePlus size={20} />
                                            <span>เพิ่มข้อมูล</span>
                                        </Button>
                                    </div>
                                }
                            </div>


                            <div className="flex">
                                <TablePlus></TablePlus>
                            </div>
                        </div>




                        <div className="flex">
                                <div className=" flex-1 w-50  px-5  rounded-md">
                                    <h1 className="mb-5  text-1xl font-semibold">รูปภาพบรรจุตู้</h1>
                                </div>
                        </div>


                        <div className="flex ">
                            <div className="p-5 w-1/2">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">แนบรูปการตรวจตู้</label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <div className="">
                                            <UploadImageComponent 
                                            name="cabinet"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </div>
                                        
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>

                            <div className="p-5 w-1/2">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">แนบรูปสินค้า</label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <div className="">
                                            <UploadImageComponent
                                            name="product"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </div>
                                        
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                        </div>


                        <div className="flex ">
                            <div className="p-5 w-1/2">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">แนบรูปปิดตู้</label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <div className="">
                                        <UploadImageComponent
                                            name="close_cabinet"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </div>
                                        
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>

                            <div className="p-5 w-1/2">
                                <label className="block mb-2 text-lg text-gray-500  sm:text-sm font-semibold">แนบรูปอื่นๆ</label>

                                {dataStatus.type !== "view" ?
                                    <>
                                        <div className="">
                                            <UploadImageComponent 
                                            name="etc"
                                            setValue={setValue} control={control}></UploadImageComponent>
                                        </div>
                                        
                                    </>
                                    : <p>{dataStatus?.booking_date}</p>}
                            </div>
                        </div>

                        {dataStatus.type !== "view" &&
                            <div className="flex items-center justify-end  rounded-b">
                                <button
                                    style={{
                                        border: '1px solid #417CA0',
                                        color: "#305D79",
                                        marginRight: '10px'
                                    }}
                                    className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => changeEdit(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg   mr-1 mb-1 "
                                    type="submit"
                                // onClick={() => setShowModal(false)}
                                >
                                    บันทึก
                                </button>
                            </div>
                        }
                    </form>
                </FormProvider>


            </div>
        </Fragment>
    )
}


export default ContainComponent
