"use client";

import React, { Fragment, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";

//service
import { getCspurchase } from "@/services/statusOrder";
import moment from "moment";

const Statuspurchase = ({ purchase }: { purchase: any }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);

  const fetchData = async (id: string) => {
    try {
      const data = await getCspurchase(id);
      setData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    console.log("purchase", purchase);
    fetchData(purchase?.id);
  }, [purchase]);

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
                <div className="ml-4 bg-gray-200 p-2">
                  <h3 className="text-lg font-semibold">{item.status_name}</h3>
                  <p className="text-gray-500">
                    วันที่รับเรื่อง :{" "}
                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </p>
                </div>
              </div>
            </Fragment>
          ))}

          {/* Timeline Items */}

          {/* Timeline Line */}
        </div>
      </div>
    </Fragment>
  );
};

export default Statuspurchase;
