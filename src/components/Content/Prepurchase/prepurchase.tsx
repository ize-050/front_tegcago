"use client";
import React, { Fragment, useEffect, useState } from "react";
import Lucide from "@/components/Base/Lucide";
import { useForm } from "react-hook-form";
//interface

//component
import AddPurchase from "./add/FormAddPurchase";
import UploadImageComponent from "../../Uploadimage/UpdateImageComponent";

//view
import ViewPurchaseComponents from "@/components/Content/Prepurchase/viewPurchase";
//edit
import FormEditPrepurchase from "./edit/Formedit";

import { useRouter } from "next/router";

//store
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

import {
  changeFormeditPurchase,
  openModaldocument,
  purchaseData,
} from "@/stores/purchase";

//lib
import { Button } from "@headlessui/react";
import Swal from "sweetalert2";
import ModalDocument from "./ModalDocument";

const PrePurchase = () => {
  const dispatch = useAppDispatch();
  const methods = useForm();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;

  const { purchase, formEditPrepurchase, modalDocument } =
    useAppSelector(purchaseData);

  const Modalrequestfile = (value: boolean) => {
    if (purchase.d_document.length > 0) {
      dispatch(openModaldocument(value));
    } else {
      Swal.fire({
        icon: "error",
        title: "ไม่มีเอกสาร",
        text: "ไม่มีเอกสารเพิ่มเติม",
      });
    }
  };

  //function
  const changeEdit = (value: boolean) => {
    dispatch(changeFormeditPurchase(value));
  };

  return (
    <div className="p-5 mx-auto  text-black">
      <div className="flex">
        <div className="flex-1 w-50">
          <h1 className="mb-5  text-2xl">ข้อมูล Estimate : ตีราคา</h1>
        </div>

        <div className="flex-1 w-50 justify-end right-0 flex space-x-4">
          <Button
            onClick={() => changeEdit(true)}
            // onClick={() => changeEdit(!formEditcustomer)}
            style={{
              background: "#C8D9E3",
              color: "#417CA0",
              width: "119px",
              height: "36px",
            }}
            className="flex hover:bg-blue-700   mr-1"
          >
            <Lucide
              color="#6C9AB5"
              icon="Pencil"
              className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
            ></Lucide>
            <p
              className="text-[#417CA0]
                  text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"
            >
              แก้ไขข้อมูล
            </p>
          </Button>

          <Button
            onClick={() => Modalrequestfile(true)}
            style={{
              background: "#C8D9E3",
              color: "#417CA0",
              width: "119px",
              height: "36px",
            }}
            className="flex hover:bg-blue-700  "
          >
            <Lucide
              color="#6C9AB5"
              icon="File"
              className="inset-y-0 bg-secondary-400   justify-center m-auto mr-1  text-slate-500"
            ></Lucide>
            <p
              className="text-[#417CA0]
              text-14px tracking-[0.1em] text-center uppercase mx-auto mt-1"
            >
              เอกสารเพิ่ม
            </p>
          </Button>
        </div>
      </div>

      {!formEditPrepurchase && <ViewPurchaseComponents purchase={purchase} />}
      {formEditPrepurchase && <FormEditPrepurchase purchase={purchase} />}

      {modalDocument && (
        <ModalDocument
          document={purchase.d_document}
          purchase_id={purchase.id}
          input_etc={purchase.input_etc}
        ></ModalDocument>
      )}
    </div>
  );
};

export default PrePurchase;
