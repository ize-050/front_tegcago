"use client"

import { Controller } from "react-hook-form";
//component
import UploadImageComponent from "../../Uploadimage/UpdateImageComponent";
import ConfirmPayment from "./ConfirmPayment";
import UploadpaymentComponent from "./Modal/Uploadpayment";
import TablePaymentComponent from "./TablePaymentComponent";


//store
import { useAppSelector } from "@/stores/hooks";
import { purchaseData } from "@/stores/purchase";
import { useEffect, useState } from "react";
import { set } from "lodash";
import purchase from '../../../stores/purchase';
import EdituploadComponent from "@/components/Uploadimage/edit/EdituploadComponent";
import EditimageComponent from "./EditImagecomponent";


const PaymentComponent = ({
  setValue,
  control
}: {
  setValue: any,
  control: any
}) => {
  const { purchase } = useAppSelector(purchaseData)
  const [condition, setCondition] = useState<any>([])
  const [purchase_etc, setPurchase_etc] = useState<any>([])
  const [purchase_file, setPurchase_file] = useState<any>([])
  useEffect(() => {

    setValue("purchase_ref", purchase.d_purchase_ref)
    setValue("purchase_status", purchase.d_status)

    const condition: any = purchase.d_confirm_purchase.filter((item: any) => {
      return item.type_confirm === "condition"
    })
    setCondition(condition)

    console.log("condition", condition)

    const purchase_etc: any = purchase.d_confirm_purchase.filter((item: any) => {
      return item.type_confirm === "purchase_etc"
    })
    setPurchase_etc(purchase_etc)

    const purchase_file: any = purchase.d_confirm_purchase.filter((item: any) => {
      return item.type_confirm === "purchase_file"
    })
    setPurchase_file(purchase_file)
  }, [purchase])
  return (
    <>
      <div className="p-5 ">
        <div className="flex-1 w-50">
          <h1 className="mb-5  text-2xl font-semibold">ข้อมูล บัญชีการเงิน</h1>
        </div>
      </div>


      <div className="p-5">
        <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="flex flex-col w-1/2">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">Ref: เลขที่ใบเสนอราคา</label>
            <Controller
              name={`purchase_ref`}
              control={control}
              defaultValue={purchase.d_purchase_ref}
              rules={{ required: false }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <input
                    value={value}
                    onChange={onChange}
                    type="text" className="border border-gray-200 p-2 rounded-md"
                    placeholder="Ref: 00000000000" />
                </>
              )} />


          </div>

          <div className="flex flex-col w-1/2">

            {purchase_file.length > 0 ?
              <>
                <EditimageComponent setValue={setValue} control={control}
                  image={purchase_file.length > 0 ? purchase_file[0].d_confirm_purchase_file : ""}
                ></EditimageComponent>

              </>
              :
              <>
                <UploadpaymentComponent name={"purchase_file"} setValue={setValue} control={control}></UploadpaymentComponent>
              </>
            }
          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>

        <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="flex flex-col w-1/2">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">เงื่อนไขการชำระเงิน</label>

          </div>

          <div className="flex flex-col w-1/2">
            {condition.length > 0 ?
              <>
                <EditimageComponent setValue={setValue} control={control}
                  image={condition.length > 0 ? condition[0].d_confirm_purchase_file : ""}
                ></EditimageComponent>

              </>
              :
              <>
                <UploadpaymentComponent name={"condition"} setValue={setValue} control={control}></UploadpaymentComponent>
              </>
            }


          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>

        <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="flex flex-col w-1/2">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">หมายเหตุ</label>

          </div>

          <div className="flex flex-col w-1/2">
            {purchase_etc.length > 0 ?
              <>
                <EditimageComponent setValue={setValue} control={control}
                  image={purchase_etc.length > 0 ? purchase_etc[0].d_confirm_purchase_file : ""}
                ></EditimageComponent>

              </>
              :
              <>
                <UploadpaymentComponent name={"purchase_etc"} setValue={setValue} control={control}></UploadpaymentComponent>
              </>
            }
          </div>
        </div>
      </div>

      <hr className="mb-5 mt-5"></hr>


      <div className="p-5 flex flex-col">
        <div className="flex">
          <div className="flex-1 w-50">
            <h1 className="mb-5  text-2xl font-semibold">การชำระเงิน</h1>
          </div>

        </div>

          <TablePaymentComponent></TablePaymentComponent>

      </div>



      <hr className="mb-5 mt-5 "></hr>

      <ConfirmPayment setValue={setValue} control={control}></ConfirmPayment>
      <div className="p-5 flex flex-col">
        <div className="flex flex-col w-1/3">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">สถานะ</label>
          <Controller
            name={`purchase_status`}
            control={control}
            defaultValue={purchase.d_status}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <select
                  onChange={onChange}
                  value={value}
                  className="border border-gray-200 p-2 rounded-md"
                >
                  <option value="">เลือก</option>
                  <option value="ปิดการขาย">ปิดการขาย</option>
                  <option value="ค้างชำระเงิน">ค้างชำระเงิน</option>
                </select>
              </>
            )} />
        </div>
      </div>
    </>
  )
}

export default PaymentComponent;