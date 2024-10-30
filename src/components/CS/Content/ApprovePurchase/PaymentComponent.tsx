"use client";

import { Controller } from "react-hook-form";
//component

import ConfirmPayment from "./ConfirmPayment";
import UploadpaymentComponent from "./Modal/Uploadpayment";
import TablePaymentComponent from "./TablePaymentComponent";

//store
import { useAppSelector } from "@/stores/hooks";
import { purchaseData } from "@/stores/purchase";
import { useEffect, useState } from "react";
import purchase from "@/stores/purchase";
import EdituploadComponent from "@/components/Uploadimage/edit/EdituploadComponent";
import EditimageComponent from "./EditImagecomponent";
import ViewimageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";
import ViewImageComponent from "@/components/CS/Content/StatusPurchase/Image/ViewImageComponent";

const PaymentComponent = ({
  setValue,
  control,
}: {
  setValue: any;
  control: any;
}) => {
  const { purchase } = useAppSelector(purchaseData);
  const [condition, setCondition] = useState<any>([]);
  const [purchase_etc, setPurchase_etc] = useState<any>([]);
  const [purchase_file, setPurchase_file] = useState<any>([]);
  useEffect(() => {
    setValue("purchase_ref", purchase.d_purchase_ref);
    setValue("purchase_status", purchase.d_status);

    const condition: any = purchase.d_confirm_purchase.filter((item: any) => {
      return item.type_confirm === "condition";
    });
    setCondition(condition);

    console.log("condition", condition);

    const purchase_etc: any = purchase.d_confirm_purchase.filter(
      (item: any) => {
        return item.type_confirm === "purchase_etc";
      }
    );
    setPurchase_etc(purchase_etc);

    const purchase_file: any = purchase.d_confirm_purchase.filter(
      (item: any) => {
        return item.type_confirm === "purchase_file";
      }
    );
    console.log("purchase_file", purchase_file);
    setPurchase_file(purchase_file);
  }, [purchase]);
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
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              Ref: เลขที่ใบเสนอราคา
            </label>
            {purchase.d_purchase_ref}
          </div>

          <div className="flex flex-col w-1/2">
            {purchase_file.length > 0 && (
              <>
                <div className="flex">
                  {purchase_file[0].d_confirm_purchase_file?.map((images: any, index: number) => {
                    const isExcel =
                      images.file_name?.endsWith(".xlsx") ||
                      images.file_name?.endsWith(".xls") ||
                      images.file_name?.endsWith(".csv");
                    const isPdf = images.file_name?.endsWith(".pdf");
                    const isImage =
                      images.file_name?.endsWith(".jpg") ||
                      images.file_name?.endsWith(".png") ||
                      images.file_name?.endsWith(".jpeg") ||
                      images.file_name?.endsWith(".webp");
                    const url =
                      process.env.NEXT_PUBLIC_URL_API + images.file_path;

                    return (
                      <>
                        <ViewImageComponent
                          isExcel={isExcel}
                          isPdf={isPdf}
                          isImage={isImage}
                          url={url}
                          images={images}
                          index={index}
                        ></ViewImageComponent>
                      </>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>

        <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="flex flex-col w-1/2">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              เงื่อนไขการชำระเงิน
            </label>
          </div>

          <div className="flex flex-col w-1/2">
            {condition.length > 0  &&
              <>
              {condition[0].d_confirm_purchase_file?.map((images: any, index: number) => {
                    const isExcel =
                      images.file_name?.endsWith(".xlsx") ||
                      images.file_name?.endsWith(".xls") ||
                      images.file_name?.endsWith(".csv");
                    const isPdf = images.file_name?.endsWith(".pdf");
                    const isImage =
                      images.file_name?.endsWith(".jpg") ||
                      images.file_name?.endsWith(".png") ||
                      images.file_name?.endsWith(".jpeg") ||
                      images.file_name?.endsWith(".webp");
                    const url =
                      process.env.NEXT_PUBLIC_URL_API + images.file_path;

                    return (
                      <>
                        <ViewImageComponent
                          isExcel={isExcel}
                          isPdf={isPdf}
                          isImage={isImage}
                          url={url}
                          images={images}
                          index={index}
                        ></ViewImageComponent>
                      </>
                    );
                  })}
              </>
            }

          </div>
        </div>

        <hr className="mb-5 mt-5"></hr>

        <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
          <div className="flex flex-col w-1/2">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              หมายเหตุ
            </label>
          </div>

          <div className="flex flex-col w-1/2">
            {purchase_etc.length > 0  &&
              <>
              {purchase_etc[0].d_confirm_purchase_file?.map((images: any, index: number) => {
                    const isExcel =
                      images.file_name?.endsWith(".xlsx") ||
                      images.file_name?.endsWith(".xls") ||
                      images.file_name?.endsWith(".csv");
                    const isPdf = images.file_name?.endsWith(".pdf");
                    const isImage =
                      images.file_name?.endsWith(".jpg") ||
                      images.file_name?.endsWith(".png") ||
                      images.file_name?.endsWith(".jpeg") ||
                      images.file_name?.endsWith(".webp");
                    const url =
                      process.env.NEXT_PUBLIC_URL_API + images.file_path;

                    return (
                      <>
                        <ViewImageComponent
                          isExcel={isExcel}
                          isPdf={isPdf}
                          isImage={isImage}
                          url={url}
                          images={images}
                          index={index}
                        ></ViewImageComponent>
                      </>
                    );
                  })}
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
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            สถานะ
          </label>
          {purchase.d_status}
        </div>
      </div>
    </>
  );
};

export default PaymentComponent;
