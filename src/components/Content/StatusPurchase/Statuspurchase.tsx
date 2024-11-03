"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";

//service
import { getCspurchase } from "@/services/statusOrder";
import moment from "moment";

//modal
import ModalBookcabinet from "@/components/Content/StatusPurchase/Modalstatus/Bookcabinet";
import ModalReceive from "@/components/Content/StatusPurchase/Modalstatus/Receive";
import ModalContain from "@/components/Content/StatusPurchase/Modalstatus/Contain";
import ModalDocuments from "@/components/Content/StatusPurchase/Modalstatus/Document";
import ModalDepartureComponents from "@/components/Content/StatusPurchase/Modalstatus/Departure";
import ModalProveDepartureComponents from "@/components/Content/StatusPurchase/Modalstatus/ProveDeparture";
import ModalWaitRelease from "@/components/Content/StatusPurchase/Modalstatus/WaitRelease";
import ModalSuccessReleaseComponent from "@/components/Content/StatusPurchase/Modalstatus/SuccessRelease";
import ModalDestinationComponent from "@/components/Content/StatusPurchase/Modalstatus/Destination";
import ModalSentAlreadyComponent from "@/components/Content/StatusPurchase/Modalstatus/SentAlready";
import ModalReturnCabinet from "@/components/Content/StatusPurchase/Modalstatus/ModalReturnCabinet";
import ModalEtc from "@/components/Content/StatusPurchase/Modalstatus/Etc";

import { setDataAll } from "@/stores/statusOrder";
import purchase from '../../../stores/purchase';



const Statuspurchase = ({ purchase }: { purchase: any }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);

  const [modal, setModal] = useState<string>("");

  const fetchData = async (id: string) => {
    try {
      const data = await getCspurchase(id);
      setData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const setModalstatus = async (data: string) => {
    setModal(data);
  };

  useEffect(() => {
    console.log("purchase", purchase);
    fetchData(purchase?.id);
    fetchDatas();
  }, [purchase]);

  const fetchDatas = useCallback(async () => {
    const cs_purchase: any = await getCspurchase(purchase.id);

    if (cs_purchase) {
      dispatch(setDataAll(cs_purchase));
    }
  }, [status]);

  return (
    <Fragment>
      <div className="p-2 text-black">
        <h1 className="mb-5 p-5  text-2xl">ตรวจสอบสถานะการรับตู้</h1>

        <div className="flex  pl-20 flex-col relative">
          {data.map((item: any, index: number) => (
            <Fragment>
              <div className="absolute  ml-3 border-dashed border-gray-300 border-[1px] h-full  top-0"></div>
              <div className="flex items-center mb-6   ">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <img
                    src={`${process.env.URl_DOMAIN}/Mark.svg`}
                    alt="box"
                    className="z-10"
                  />
                </div>
                <a
                  href="#"
                  onClick={() => {
                    setModalstatus(item.status_key);
                  }}
                >
                  <div className="ml-4 bg-gray-200 p-2 hover:scale-110">
                    <h3 className="text-lg font-semibold">
                      {item.status_name}
                    </h3>
                    <p className="text-gray-500">
                      วันที่รับเรื่อง :{" "}
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </p>
                  </div>
                </a>
              </div>
            </Fragment>
          ))}

          {/* Timeline Items */}

          {/* Timeline Line */}
        </div>
      </div>
      {modal === "Bookcabinet" && (
        <ModalBookcabinet purchase={purchase} setModalstatus={setModalstatus} />
      )}
      {modal === "Receive" && (
        <ModalReceive
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalReceive>
      )}
      {modal === "Contain" && (
        <ModalContain
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalContain>
      )}
      {modal === "Document" && (
        <ModalDocuments
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalDocuments>
      )}
      {modal === "Leave" && (
          <ModalDepartureComponents
          purchase={purchase}
          setModalstatus={setModalstatus}
          ></ModalDepartureComponents>
      )}
      {modal === "Departure" && (
        <ModalProveDepartureComponents
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalProveDepartureComponents>
      )}
        {modal === "WaitRelease" && (
        <ModalWaitRelease
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalWaitRelease>
      )}
        {modal === "Released" && (
        <ModalSuccessReleaseComponent
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalSuccessReleaseComponent>
      )}
       {modal === "Destination" && (
        <ModalDestinationComponent
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalDestinationComponent>
      )}
       {modal === "SentSuccess" && (
        <ModalSentAlreadyComponent
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalSentAlreadyComponent>
      )}
      {modal ==="return_cabinet" &&(
        <ModalReturnCabinet
          purchase={purchase}
          setModalstatus={setModalstatus}
        >
        </ModalReturnCabinet>
      )}
      {modal === "Etc" && (
        <ModalEtc
          purchase={purchase}
          setModalstatus={setModalstatus}
        ></ModalEtc>
      )}
    </Fragment>
  );
};

export default Statuspurchase;
