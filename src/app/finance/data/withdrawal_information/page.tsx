"use client"
import React, { Fragment, useEffect, useState } from "react";

import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";


//router
import { useRouter } from "next/navigation";



//component withdrawal
import TableComponent from "@/components/finance/data/withdrawal_information/TableComponent";
import Button from "@/components/Base/Button";

//store
import { financeData, setModalWithdrawal } from "@/stores/finance";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import ModalWithdrawalInformation from "@/components/finance/data/withdrawal_information/ModalComponent";


//service
import { getWidhdrawalInformation } from "@/services/finance";

export default function WorkPage() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [datawidhdrawalInformation, setwidhdrawalInformation] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const {  modalWithdrawal, formwithdrawal  } = useAppSelector(financeData);

  const getData = async () => {
    try {
      const data_params = {
        page: 1,
        limit: 10
        // No search or date filters by default
      }

      const response: any = await getWidhdrawalInformation(data_params);
      console.log("API Response:", response);
      
      // Make sure we're setting the data in the correct format expected by TableComponent
      setwidhdrawalInformation({
        widhdrawalInformation: response.widhdrawalInformation || response,
        total: response.total || (response.widhdrawalInformation?.length || 0)
      });
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  useEffect(() => {
    // Always fetch data on load and when refreshKey changes
    getData()
  }, [refreshKey]) // Add refreshKey as dependency

  const handleAdd = () => {
      dispatch(setModalWithdrawal(true))
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1) // Increment refreshKey to trigger useEffect
  }

  return (
    <Fragment>


      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
            ข้อมูลการเบิกเงินแผนกชิป
          </p>
        </div>

      </div>

      <div className="container mx-auto px-5 ">
        <div
          className="bg-white  rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >

          <div className="flex justify-end items-center p-5">
            <Button
              onClick={() => {
                handleAdd()
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >เพิ่มรายการ</Button>
          </div>
          
              
          <TableComponent 
            datawidhdrawalInformation={datawidhdrawalInformation} 
            onRefresh={handleRefresh} 
          />

          {modalWithdrawal && (
            <ModalWithdrawalInformation onSuccess={handleRefresh} />
          )}
        </div>
      </div>


    </Fragment>
  );
}
