"use client";
import React, { Fragment, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import Image from "next/image";
import { customerData } from "@/stores/customer";

import { purchaseData, setModalImage } from "@/stores/purchase";

//interface

//lib
import moment from "moment";

import { Route } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import ModalPreviewImageView from "./ModelviewImage";
import ModalPreviewImage from "@/components/Content/Prepurchase/upload/ModalPreview";
import ViewImageComponent from "../StatusPurchase/Image/ViewImageComponent";

const CsViewPrePurchase = () => {
  const { modalImage } = useAppSelector(purchaseData);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>();
  const { purchase } = useAppSelector(purchaseData);

  const [selectIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    setData(purchase);
  }, [purchase]);

  return (
    <>
      <div className=" flex  flex-col  md:flex-row  mt-5">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            เลขตีราคา
          </label>
          <p>{data?.book_number}</p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            ชื่อเซลล์
          </label>
          {data?.d_purchase_emp?.length > 0 && (
            <p>{data?.d_purchase_emp[0].user?.fullname}</p>
          )}

          {/*<p>{customer_detail.customer_emp[0].user.fullname}</p>*/}
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            วันที่/เวลา
          </label>
          {data?.createdAt && (
            <>
              <p>{moment(data?.createdAt).format("DD/MM/YYYY HH:mm")}</p>
            </>
          )}
          {/*<p>{customer_detail.cus_sex}</p>*/}
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 mb-5">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm">
            invoice & Packinglist No.
          </label>
          <p>{data?.customer_number}</p>
        </div>
      </div>

      <hr className="mb-5"></hr>
      <h1 className="mb-5  text-2xl">ข้อมูลขนส่ง</h1>
      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            Route
          </label>
          <p>{data?.d_route}</p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            ขนส่ง
          </label>
          <p>{data?.d_transport}</p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            Term
          </label>
          <p>{data?.d_term}</p>
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            กลุ่มประเภทงาน
          </label>
          <p>{data?.d_group_work}</p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="block mb-2  text-gray-700  text-sm font-semibold">
            วันที่โหลดตู้
          </label>
          <p>{data?.date_cabinet}</p>
        </div>
      </div>

      <hr className="mb-5 mt-5"></hr>
      <h1 className="mb-5  text-2xl">ข้อมูลสินค้า</h1>
      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            ชื่อสินค้า
          </label>
          <p>{data?.d_product?.d_product_name}</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            รูปภาพ
          </label>
          <div className="flex flex-row">
          {data?.d_product?.d_product_image.map(
               (images: any, index: number) => {
                const isExcel =
                  images.name?.endsWith(".xlsx") ||
                  images.name?.endsWith(".xls") ||
                  images.name?.endsWith(".csv");
                const isPdf = images.name?.endsWith(".pdf");
                const isImage = images.name?.endsWith('.jpg') || images.name?.endsWith('.png') || images.name?.endsWith('.jpeg') || images.name?.endsWith('.webp');;
                const url = images.url;
                return (
                  <>
                  <ViewImageComponent 
                  
                  url={url}
                   isExcel={isExcel}
                   isPdf={isPdf}
                   isImage={isImage}
                   images={images}
                   index={index}
                   key={index}
                   
                  />
                  </>
                );
              }
            )}
          </div>
        </div>
      </div>

      <hr className="mb-5 mt-5"></hr>
      <h2 className="mb-5  text-2xl">ข้อมูลการขนส่ง</h2>
      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2 text-gray-500  text-sm font-semibold">
            Port ต้นทาง
          </label>
          <p>{data?.d_origin}</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2 text-gray-500  text-sm font-semibold">
            Port ปลายทาง
          </label>
          <p>{data?.d_destination}</p>
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-2/4 flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              ขนาดตู้
            </label>
            <p>{data?.d_size_cabinet}</p>
          </div>
          <div className="w-full md:w-2/4  flex flex-col">
            <label className="block mb-2  text-gray-500  text-sm font-semibold">
              น้ำหนัก
            </label>
            <p>{data?.d_weight}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2  flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            บริการหัวรถลาก
          </label>
          <p>{data?.d_truck}</p>
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            ที่อยู่ต้นทาง
          </label>
          <p>{data?.d_address_origin}</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            ที่อยู่ปลายทาง{" "}
          </label>
          <p>{data?.d_address_destination}</p>
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5">
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            Linkmap ต้นทาง
          </label>
          <p>{data?.link_d_origin}</p>
        </div>
        {/* <MapProvider>
          <MapComponent />
        </MapProvider> */}
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            Linkmap ปลายทาง
          </label>
          <p>{data?.link_d_destination}</p>
        </div>
      </div>

      <div className=" flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            Refund Tax ต้นทาง
          </label>
          <p>{data?.d_refund_tag}</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2  text-gray-500  text-sm font-semibold">
            หมายเหตุ{" "}
          </label>

          <p>{data?.d_etc}</p>
        </div>
      </div>

      
      {/*<ModalPreviewImageView isOpen={modalImage} onClose={() => dispatch(setModalImage(false))} images={data?.d_product?.d_product_image} />      */}
    </>
  );
};

export default CsViewPrePurchase;
