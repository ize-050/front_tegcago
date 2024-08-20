"use client";
import React, { useEffect, useState,useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';

import {
  purchaseData,
   setModalAgentcy,
  setSubmitAddAgency
} from '@/stores/purchase'
import { Controller, useForm ,useWatch,useFieldArray} from 'react-hook-form';
import moment from "moment/moment";

//component
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";

import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import {any} from "prop-types";
import { set } from 'lodash';

//router
import {useRouter}  from 'next/navigation'

//service


const ModalAdddocument = () => {

  const dispatch = useAppDispatch()
  const router = useRouter()
  const [ListPrice ,SETListPrice] = useState<any[]>([{
    List :'',
    Listname: '',
    price: '6500',
    currency: 'THB',
    discount: 0,
    total_price: '',
  }])
  const { agentcy,purchase } = useAppSelector(purchaseData);

  const { handleSubmit,trigger, control, reset,setValue,getValues, formState: { errors } } = useForm({
    // defaultValues: {
    //   agentcy_id: "",
    //   agent_boat: "",
    //   agentcy_tit:"",
    //   agentcy_eta:"",
    //   agentcy_etd:"",
    //   agentcy_etc:"",
    //   files:[],
    //   type:[
    //     {
    //       d_type: '',
    //       d_type_text: '',
    //       d_price: '',
    //       d_currency: 'THB',
    //       d_nettotal: 6500,
    //       d_discount: '',
    //       d_net_balance: 6500
    //     }
    //   ]
    // }
  })

  const { fields, append, remove } = useFieldArray({
    control,
     name: "type"

  });

  const formValues = useWatch({ control });
  const setShowModal = (data: boolean) => {
    dispatch(setModalAgentcy(data))
  }


  const AddRow =() =>{
    SETListPrice(prevListPrice => ([
      ...prevListPrice,
      {
        list: '',
        listname: '',
        price: '6500',
        currency: 'THB',
        discount: 0,
        total_price: 0,
      }
    ]));

    append({
      d_type: '',
      d_type_text: '',
      d_price: '',
      d_currency: 'THB',
      d_nettotal: 6500,
      d_discount: '',
      d_net_balance: 6500,
    })
    // Reset the `d_discount` field for the newly added item

  }

   useEffect(()=>{
        
        setValue(`type[0].d_nettotal`, 6500);
        setValue(`type[0].d_net_balance`, 6500);
        setValue(`type[0].d_currency`, 'THB');
        setValue(`type[0].d_discount`, "");
        setValue(`type[0].d_price`, "");
        setValue(`type[0].d_type`, "");
        setValue(`type[0].d_type_text`, "");
     
   },[])

  const setCurrency =(e:any ,index:number)=>{
    switch (e) {
      case 'THB':
        setValue(`type[${index}].d_nettotal`, 6500);
        break;
      case 'RMB':
        setValue(`type[${index}].d_nettotal`, 1200);
        break;
      case 'USD':
        setValue(`type[${index}].d_nettotal`, 3000);
        break;
      case 'EUR':
        setValue(`type[${index}].d_nettotal`, 2800);
        break;
      default:
        break;
    }
  }


  function calculateNetTotal(price: number, currency: string, discount: number): number {

    const exchangeRates:any = {
      THB: 6500,  // Thai Baht (base currency)
      RMB: 1200, // Example: 1 RMB = 0.22 THB
      USD: 3000, // Example: 1 USD = 0.03 THB
      EUR: 2800 // Example: 1 EUR = 0.028 THB
    };

    const adjustedPrice = Number(price) + Number(exchangeRates[currency]);
    const discountAmount =discount;
    const netTotal = adjustedPrice - discountAmount;
    return netTotal;
  }


  const onSubmit = (data:any) => {
    try{
      console.log('data',data)
      const RequestData ={
        ...data,
        purchase_id : purchase.id
      }
      dispatch(setSubmitAddAgency(RequestData))
      router.push('/cs/purchase')
    }
    catch(err:any){
      throw err;
    }


  }

  return (
    <>

      <div
        className="text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative my-6 mx-auto max-w-5xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-1xl font-semibold">
                เพิ่ม Agency
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() =>{}}
              >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
              </button>
            </div>
            {/*body*/}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={"p-6"}>
                <div className="mb-5   w-1/2 ">
                  <label className="block flex mb-1 text-gray-600 font-semibold">Agency</label>
                  <Controller
                    name="agentcy_id"
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, onBlur, value}}) => (
                      <select
                        className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={onChange}
                      >
                        <option>เลือก</option>
                        {agentcy.map((data: any, key: number) => {
                          return (
                            <option className="text-black"
                                    value={data.id}>{data.agent_name}</option>
                          )
                        })}
                      </select>
                    )}

                  />
                  {errors.agentcy_id && <p className="text-red-500">กรุณาเลือกชื่อ Agency</p>}
                </div>
                <div className="flex flex-row">
                  <div className="mb-5 w-1/2">
                    <label className="block flex mb-1 text-gray-600 font-semibold">สายเรือ
                      <div className="text-red-500">
                        *
                      </div></label>
                    <Controller
                      name="agent_boat"
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <input
                          placeholder='กรอก'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text" className={`
                                            ${errors.agent_boat ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`}/>
                      )}

                    />
                    {errors.agent_boat && <p className="text-red-500">กรุณากรอก</p>}
                  </div>
                  <div className="mb-5 w-1/2 ml-5">
                    <label className="block mb-1 text-gray-600 font-semibold">Tit</label>
                    <Controller
                      name="agentcy_tit"
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <input
                          placeholder='เลือก'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="text" className={`
                                            ${errors.agentcy_tit ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`}/>
                      )}

                    />
                    {errors.agentcy_tit && <p className="text-red-500">กรุณากรอก.</p>}
                  </div>

                </div>


                <div className="flex flex-row">
                  <div className="mb-5 w-1/2">
                    <label className="block flex mb-1 text-gray-600 font-semibold">ETD
                      <div className="text-red-500">
                        *
                      </div></label>
                    <Controller
                      name="agentcy_etd"
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <input
                          placeholder='กรอก'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date" className={`
                                            ${errors.agentcy_etd ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`}/>
                      )}

                    />
                    {errors.agentcy_etd && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div className="mb-5 w-1/2 ml-5">
                    <label className="block flex mb-1 text-gray-600 font-semibold">ETA
                      <div className="text-red-500">
                        *
                      </div></label>
                    <Controller
                      name="agentcy_eta"
                      control={control}
                      rules={{required: true, maxLength: 10}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <input
                          placeholder='เลือก'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          type="date" className={`
                                            ${errors.agentcy_eta ? 'border-red-500' : 'border-gray-200'}
                                            px-4 py-2 outline-none rounded-md w-full`}/>
                      )}

                    />
                    {errors.agentcy_eta && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                  </div>

                </div>


                <div className="flex flex-row">
                  <div className="mb-5 w-1/2">
                    <label className="block flex mb-1 text-gray-600 font-semibold">หมายเหตุ</label>
                    <Controller
                      name="agentcy_etc"
                      control={control}
                      rules={{required: false}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <textarea onChange={onChange} value={value} placeholder="กรอก"
                                  className={`${errors.agentcy_etc ? 'border-red-500' : 'border-gray-200'} px-4 py-2 outline-none rounded-md border border-gray-300 text-base`}/>
                      )}
                    />
                    {errors.agentcy_etc && <p className="text-red-500">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div className="mb-5 w-1/2 ml-5">
                    <label className="block flex mb-1 text-gray-600 font-semibold">เพิ่มรูปภาพ
                      <div className="text-red-500">
                        *
                      </div></label>
                    <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                  </div>

                </div>


                <hr className="mb-5"></hr>

                <div className="flex flex-row ">
                  <h3 className="flex-1 w-1/2 mb-5  justify-start text-2xl">ค่าใช้จ่าย</h3>

                  <div className="flex-1  w-1/2 justify-end text-right right-0">
                    <Button type="button" className="border-[#273A6F]  bg-[#273A6F] mr-5"
                            style={{
                              color: "#FFFFFF"
                            }}
                            onClick={() => {
                              AddRow()
                            }}
                    >
                      เพิ่ม
                    </Button>
                  </div>

                </div>
                <div className="flex p-4 flex-col box box--stacked">
                <div className="flex flex-row flex-wrap">
                  <Table className="border-b border-gray-100">
                    <Table.Thead>
                      <Table.Tr
                        style={{
                          background: "#FAFAFA",

                        }}
                        className="text-sm font-bold"
                      >
                        <Table.Td
                          className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                          หัวข้อ
                        </Table.Td>
                        <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">

                        </Table.Td>
                        <Table.Td
                          className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                          ค่าใช้จ่าย
                        </Table.Td>

                        <Table.Td
                          className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                          สกุลเงิน
                        </Table.Td>
                        <Table.Td className="py-4  truncate font-medium text-center border-t  border-slate-200/60 text-black">
                          ค่าใช้จ่าย
                        </Table.Td>
                        <Table.Td
                          className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                          ส่วนลด
                        </Table.Td>

                        <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                          ยอดใช้จ่ายจริง
                        </Table.Td>
                        <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black">

                        </Table.Td>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {ListPrice.map((data: any, key: number) => {

                      console.log('key',key)
                        const d_nettotal = formValues.type?.[key]?.d_nettotal || 0;
                        const d_net_balance = formValues.type?.[key]?.d_net_balance || 0;

                        // Automatically updates the d_nettotal whenever its dependencies (price, discount, currency) change


                        return (
                          <>
                            <Table.Tr className="text-sm" key={key}>


                              <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                                <Controller
                                  name={`type[${key}].d_type`}
                                  control={control}
                                  rules={{required: false}}
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                      <select
                                        onChange={onChange}
                                  className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  <option>เลือก</option>
                                  <option value="ต้นทาง">ต้นทาง</option>
                                  <option value="ปลายทาง">ปลายทาง</option>
                                </select>
                                    </>
                                    )} />

                              </Table.Td>
                              <Table.Td>
                                <Controller
                                  name={`type[${key}].d_type_text`}
                                  control={control}
                                  rules={{required: false}}
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                <input type="text"
                                       onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                                         onChange(e.target.value)
                                       }}
                                       className="px-4 py-2 outline-none rounded-md w-full"></input>
                                    </>
                                    )} />
                              </Table.Td>
                              <Table.Td>
                                <Controller
                                  name={`type[${key}].d_price`}
                                  control={control}

                                  rules={{required: false}}
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                      <input type="text"
                                             onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                                               onChange(e.target.value)
                                               setValue(`type[${key}].d_net_balance`, calculateNetTotal(Number(e.target.value), formValues.type?.[key]?.d_currency, formValues.type?.[key]?.d_discount));
                                               trigger()
                                             }}
                                             className="px-4 py-2 outline-none rounded-md w-full"></input>
                                    </>
                                  )} />
                              </Table.Td>

                              <Table.Td>
                                <Controller
                                  name={`type[${key}].d_currency`}
                                  control={control}
                                  rules={{required: false}}
                                  defaultValue={data.currency || "THB"}
                                  render={({field: {onChange, onBlur ,value }}) => (
                                    <>
                                <select
                                    onChange={(e:any)=>{
                                    onChange(e.target.value)
                                    setCurrency(e.target.value,key)
                                    setValue(`type[${key}].d_net_balance`, calculateNetTotal(formValues.type?.[key]?.d_price, e.target.value, formValues.type?.[key]?.d_discount));
                                    trigger()
                                  }}
                                  className=" text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  ">
                                  <option value="THB" selected>THB</option>
                                  <option value="RMB">RMB</option>
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                </select>
                              </>
                              )} />
                              </Table.Td>
                              <Table.Td>
                                <p className="text-black">{d_nettotal}</p>
                              </Table.Td>
                              <Table.Td>
                              <Controller
                                  name={`type[${key}].d_discount`}
                                  control={control}
                                  rules={{required: false}}
                                  render={({field: {onChange, onBlur, value}}) => (
                                    <>
                                <input type="text"
                                       onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                                         onChange(e.target.value)
                                         setValue(`type[${key}].d_net_balance`, calculateNetTotal(formValues.type?.[key]?.d_price, formValues.type?.[key]?.d_currency, Number(e.target.value)))
                                         trigger()
                                       }}
                                       className="px-4 py-2 outline-none rounded-md w-full"></input>
                                    </>
                                  )} />
                              </Table.Td>
                              <Table.Td>
                                <p className="text-black">{d_net_balance}</p>
                              </Table.Td>
                              <Table.Td>
                                <button type="button" className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg">
                                  <Lucide
                                    onClick={() => {
                                        SETListPrice(prevListPrice => prevListPrice.filter((_, i) => i !== key));

                                      const currentValues: any = getValues('type');

                                      console.log('currentValues',currentValues)

                                      const newValues = currentValues.filter((n:any, i: number) => i !== key);
                                      setValue('type', newValues);

                                      trigger()
                                    }}
                                    color="#FF5C5C"
                                    icon="Trash"
                                    className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                                  ></Lucide>
                                </button>
                              </Table.Td>

                            </Table.Tr>
                          </>
                        )
                      })
                      }
                    </Table.Tbody>
                  </Table>

                </div>
              </div>
              </div>

              <div className="flex items-center justify-end  rounded-b">
                <button
                  style={{
                    border: '1px solid #417CA0',
                    color: "#305D79",
                    marginRight: '5px'
                  }}
                  className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                  // onClick={() => setShowModal(false)}
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalAdddocument;
