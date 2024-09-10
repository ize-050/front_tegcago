"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { Button } from "@headlessui/react";

//store

import { submitAddpayment } from "@/stores/purchase";
import { set } from "lodash";
import { useRouter } from "next/navigation";

//service

import { getDataCurrency } from "@/services/system/currency";
const PaymentComponent = (props: any) => {
  const [currency, getSetCurrency] = useState<any>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    trigger,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "type",
  });

  const formValues = useWatch({ control });

  const [ListPrice, SETListPrice] = useState<any[]>([
    {
      List: "",
      Listname: "",
      price: "6500",
      currency: "THB",
      discount: 0,
      total_price: "",
    },
  ]);

  useEffect(() => {
    if (props?.payment?.length > 0) {
      const data = props.payment.map((item: any, num: number) => {
        let data: any = {
          List: item.payment_type,
          Listname: item.payment_name,
          price: item.payment_price,
          currency: item.payment_currency,
          discount: item.payment_discount,
          total_price: item.payment_net_balance,
        };
        setValue(`type[${num}].d_type_text`, item.payment_name);
        setValue(`type[${num}].d_nettotal`, item.payment_total_price);
        setValue(`type[${num}].d_net_balance`, item.payment_net_balance);
        setValue(`type[${num}].d_currency`, item.payment_currency);
        setValue(`type[${num}].d_discount`, item.payment_discount);
        setValue(`type[${num}].d_price`, item.payment_price);
        setValue(`type[${num}].d_type`, item.payment_type);

        return data;
      });

      console.log("data", data);
      SETListPrice(data);
    }
  }, [props]);

  const SubmitPayment = (request: any) => {
    try {
      const RequestData = {
        ...request,
        purchase_id: props.id,
      };
      dispatch(submitAddpayment(RequestData));

      router.push("/cs/purchase");
    } catch (err: any) {
      throw err;
    }
  };

  const AddRow = () => {
    SETListPrice((prevListPrice) => [
      ...prevListPrice,
      {
        List: "",
        Listname: "",
        price: "",
        currency: "",
        discount: 0,
        total_price: "",
      },
    ]);
    append({
      d_type: "",
      d_type_text: "",
      d_price: "",
      d_currency: "",
      d_nettotal: 0,
      d_discount: "",
      d_net_balance: 0,
    });
  };

  const masterCurrenty = async () => {
    try {
      const currency: any = await getDataCurrency(1);
      getSetCurrency(currency.data);
    } catch (err: any) {
      console.log("errorGetcurrenty", err);
    }
  };

  useEffect(() => {
    masterCurrenty();

    if (props?.payment?.length < 1) {
      setValue(`type[0].d_nettotal`, 0);
      setValue(`type[0].d_net_balance`, 0);
      setValue(`type[0].d_currency`, "");
      setValue(`type[0].d_discount`, "");
      setValue(`type[0].d_price`, "");
      setValue(`type[0].d_type`, "");
      setValue(`type[0].d_type_text`, "");
    }
  }, [props]);

  const setCurrency = (e: any, index: number) => {
    const currencyFilter = currency.find((data: any) => {
      return data.currency_name === e;
    });
    setValue(`type[${index}].d_nettotal`, currencyFilter.rate_money);
  };

  function calculateNetTotal(
    price: number,
    currency_d: string,
    discount: number
  ): number {
    console.log("currency", currency);
    const exchangeRates = currency.find((data: any) => {
      return data.currency_name === currency_d;
    });
    const adjustedPrice = Number(price) + Number(exchangeRates.rate_money);
    const discountAmount = discount;
    const netTotal = adjustedPrice - discountAmount;
    return netTotal;
  }

  return (
    <>
      <div className="flex flex-row p-5">
        <h3 className="flex-1 w-1/2   justify-start text-2xl">ค่าใช้จ่าย</h3>

        <div className="flex-1  w-1/2 justify-end text-right right-0">
          <Button
            type="button"
            className="border-[#273A6F]  bg-[#273A6F] mr-5"
            style={{
              color: "#FFFFFF",
            }}
            onClick={() => {
              AddRow();
            }}
          >
            เพิ่มค่าใช้จ่าย
          </Button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap p-2">
        <Table className="border-b border-gray-100">
          <Table.Thead>
            <Table.Tr
              style={{
                background: "#FAFAFA",
              }}
              className="text-sm font-bold"
            >
              <Table.Td className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                หัวข้อ
              </Table.Td>
              <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black"></Table.Td>
              <Table.Td className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                ค่าใช้จ่าย
              </Table.Td>

              <Table.Td className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                สกุลเงิน
              </Table.Td>
              <Table.Td className="py-4  truncate font-medium text-center border-t  border-slate-200/60 text-black">
                ค่าใช้จ่าย
              </Table.Td>
              <Table.Td className="py-4 font-medium  truncate text-center border-t   border-slate-200/60 text-black">
                ส่วนลด
              </Table.Td>

              <Table.Td className="py-4  truncate font-medium text-center border-t   border-slate-200/60 text-black">
                ยอดใช้จ่ายจริง
              </Table.Td>
              <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-black"></Table.Td>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {ListPrice.map((data: any, key: number) => {
              console.log("key", key);
              const d_nettotal = formValues.type?.[key]?.d_nettotal || 0;
              const d_net_balance = formValues.type?.[key]?.d_net_balance || 0;
              const d_type = formValues.type?.[key]?.d_type || "";

              // Automatically updates the d_nettotal whenever its dependencies (price, discount, currency) change

              return (
                <>
                  <Table.Tr className="text-sm text-black" key={key}>
                    <Table.Td className="text-center    border-slate-200/60  text-gray-900">
                      <Controller
                        name={`type[${key}].d_type`}
                        defaultValue={data?.List}
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <select
                              value={value}
                              onChange={onChange}
                              className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option>เลือก</option>
                              <option value="ต้นทาง">ต้นทาง</option>
                              <option value="ปลายทาง">ปลายทาง</option>
                            </select>
                          </>
                        )}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Controller
                        name={`type[${key}].d_type_text`}
                        control={control}
                        defaultValue={data?.Listname}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <input
                              type="text"
                              value={value}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                onChange(e.target.value);
                              }}
                              className="px-4 py-2 outline-none rounded-md w-full"
                            ></input>
                          </>
                        )}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Controller
                        name={`type[${key}].d_price`}
                        control={control}
                        defaultValue={data?.price}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <input
                              type="text"
                              value={value}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                onChange(e.target.value);
                                setValue(
                                  `type[${key}].d_net_balance`,
                                  calculateNetTotal(
                                    Number(e.target.value),
                                    formValues.type?.[key]?.d_currency,
                                    formValues.type?.[key]?.d_discount
                                  )
                                );
                                trigger();
                              }}
                              className="px-4 py-2 outline-none rounded-md w-full"
                            ></input>
                          </>
                        )}
                      />
                    </Table.Td>

                    <Table.Td>
                      <Controller
                        name={`type[${key}].d_currency`}
                        control={control}
                        rules={{ required: false }}
                        defaultValue={data?.currency || "THB"}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <select
                              value={value}
                              onChange={(e: any) => {
                                onChange(e.target.value);
                                setCurrency(e.target.value, key);
                                setValue(
                                  `type[${key}].d_net_balance`,
                                  calculateNetTotal(
                                    formValues.type?.[key]?.d_price,
                                    e.target.value,
                                    formValues.type?.[key]?.d_discount
                                  )
                                );
                                trigger();
                              }}
                              className=" text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  "
                            >
                              <option value=""> กรุณาเลือก </option>
                              {currency.map((data: any, key: number) => {
                                return (
                                  <option value={data.currency_name}>
                                    {data.currency_name}
                                  </option>
                                );
                              })}
                            </select>
                          </>
                        )}
                      />
                    </Table.Td>
                    <Table.Td>
                      <p className="text-black">{d_nettotal}</p>
                    </Table.Td>
                    <Table.Td>
                      <Controller
                        name={`type[${key}].d_discount`}
                        control={control}
                        defaultValue={data?.discount}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <input
                              type="text"
                              value={value}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                onChange(e.target.value);
                                setValue(
                                  `type[${key}].d_net_balance`,
                                  calculateNetTotal(
                                    formValues.type?.[key]?.d_price,
                                    formValues.type?.[key]?.d_currency,
                                    Number(e.target.value)
                                  )
                                );
                                trigger();
                              }}
                              className="px-4 py-2 outline-none rounded-md w-full"
                            ></input>
                          </>
                        )}
                      />
                    </Table.Td>
                    <Table.Td>
                      <p className="text-black">{d_net_balance}</p>
                    </Table.Td>
                    <Table.Td>
                      <button
                        type="button"
                        className="bg-red-300 hover:bg-red-700 w-8 h-8 rounded-lg"
                      >
                        <Lucide
                          onClick={() => {
                            SETListPrice((prevListPrice) =>
                              prevListPrice.filter((_, i) => i !== key)
                            );

                            const currentValues: any = getValues("type");

                            console.log("currentValues", currentValues);

                            const newValues = currentValues.filter(
                              (n: any, i: number) => i !== key
                            );
                            setValue("type", newValues);

                            trigger();
                          }}
                          color="#FF5C5C"
                          icon="Trash"
                          className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"
                        ></Lucide>
                      </button>
                    </Table.Td>
                  </Table.Tr>
                </>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
      <br></br>
      <div className="flex items-center justify-end  rounded-b">
        <button
          style={{
            border: "1px solid #417CA0",
            color: "#305D79",
            marginRight: "5px",
          }}
          className="border-secondary-500  bg-white   font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          // onClick={() => router.push('/cs/purchase')}
        >
          ยกเลิก
        </button>
        <button
          className="bg-blue-950 text-white  font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleSubmit((data) => {
            SubmitPayment(data);
          })}
        >
          บันทึกค่าใช้จ่าย
        </button>
      </div>
    </>
  );
};

export default PaymentComponent;
