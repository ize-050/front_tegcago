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
          {moment(data?.created_at).format("DD/MM/YYYY HH:mm")}
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
            {/*{data?.d_product?.d_product_image.map((image:Partial<any>, index:number) => (*/}
            {/*   */}
            {/*    <div key={index} className="relative rounded-lg w-32 h-32 m-2 ">*/}
            {/*        <Image*/}
            {/*            src={image.url}*/}
            {/*            alt="preview"*/}
            {/*            fill // Fill the container*/}
            {/*            className="object-cover rounded"*/}
            {/*        />*/}
            {/*     */}
            {/*        <div className="absolute bottom-1 right-0 flex gap-2">*/}
            {/*      */}
            {/*            <button*/}
            {/*                onClick={() => {*/}
            {/*                     dispatch(setModalImage(true))*/}
            {/*                }}*/}
            {/*                type="button"*/}
            {/*                className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1">*/}
            {/*                <Lucide*/}
            {/*                    color="#6C9AB5"*/}
            {/*                    icon="Eye"*/}
            {/*                    className="inset-y-0 bg-secondary-400   justify-center m-auto   w-5 h-5  text-slate-500"*/}
            {/*                ></Lucide>*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    */}
            {/*))}*/}

            {data?.d_product?.d_product_image.map(
               (images: any, index: number) => {
                const isExcel =
                  images.name?.endsWith(".xlsx") ||
                  images.name?.endsWith(".xls") ||
                  images.name?.endsWith(".csv");
                const isPdf = images.name?.endsWith(".pdf");
                const isImage = data.name?.endsWith('.jpg') || data.name?.endsWith('.png') || data.name?.endsWith('.jpeg') || data.name?.endsWith('.webp');;
                const url = images.url;
                return (
                  <Fragment key={index}>
                    <div className="relative w-32 h-32 m-2 basis-1/4 overflow-hidden">
                      {isPdf && (
                        <>
                          <div className="relative w-full h-full   overflow-hidden">
                            <object
                              data={url}
                              type="application/pdf"
                              height={"100%"}
                              width={"100%"}
                            >
                              <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">
                                  PDF Viewer not available
                                </p>
                              </div>
                            </object>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-lg font-medium">
                                PDF
                              </span>
                            </div>

                            <div className="absolute bottom-1 right-0 flex gap-2">
                              <button
                                onClick={() => {
                                  window.open(images.url);
                                }}
                                type="button"
                                className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                              >
                                <Lucide
                                  color="#6C9AB5"
                                  icon="Eye"
                                  className="w-5 h-5 m-auto"
                                />
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {isImage && (
                        <>
                          <div className="relative w-full h-full   overflow-hidden">
                            <Image
                              src={url}
                              alt={`Preview ${index}`}
                              fill
                              className="w-full h-full object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-lg font-medium">
                                image
                              </span>
                            </div>
                            <div className="absolute bottom-1 right-0 flex gap-2">
                              <button
                                onClick={() => {
                                  dispatch(setModalImage(true));
                                  setSelectedImageIndex(index);
                                }} // Consider passing the  image (url, index, etc.)
                                type="button"
                                className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                              >
                                <Lucide
                                  color="#6C9AB5"
                                  icon="Eye"
                                  className="w-5 h-5 m-auto"
                                />
                              </button>
                            </div>
                            {/* Pass data or URL to the ModalPreviewImage component */}
                            {/* <ModalPreviewImage ... /> */}
                          </div>
                          {modalImage && selectIndex === index && (
                            <ModalPreviewImage
                              isOpen={modalImage}
                              onClose={() => dispatch(setModalImage(false))}
                              startIndex={index}
                              images={data?.d_product?.d_product_image}
                            />
                          )}
                        </>
                      )}

                      {isExcel && (
                        <div>
                          <div className="relative w-full h-32  border-2   overflow-hidden">
                            <Lucide
                              icon="Sheet"
                              className="absolute top-10 left-6 w-8 h-8 mx-auto text-green-500"
                            />
                            <h3 className="text-sm font-semibold mb-2">
                              {images.name}
                            </h3>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-lg font-medium">
                                Excel
                              </span>
                            </div>
                            <div className="absolute bottom-1 right-0 flex gap-2">
                              <button
                                onClick={() => {
                                  window.open(images.url);
                                }}
                                type="button"
                                className="hover:bg-blue-300 bg-[#C8D9E3] w-6 h-6 rounded-lg mr-1"
                              >
                                <Lucide
                                  color="#6C9AB5"
                                  icon="Eye"
                                  className="w-5 h-5 m-auto"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Fragment>
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
