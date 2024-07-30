"use client";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import {Clock} from "lucide-react";
import CSEditprepurchase from "@/components/CS/Content/Prepurchase/Editprepurchase";
import CsPurchaseComponent from "@/components/CS/Content/Purchase/purchase";
import ModalAdddocument from "@/components/CS/Content/Modal/ModalAdddocument";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";

import {purchaseData, setAgentcy, setDocument, setModalAdddo, setPurchaseData} from "@/stores/purchase";
import { useEffect, useState} from "react";

import {setOpenToast} from "@/stores/util";
import {GetAgentCy, getDocumentByid, getPurchaseDetail, updateTriggleStatus} from "@/services/purchase";
import Swal from "sweetalert2";


const GroupPurchase =({id}:any)=>{
  const dispatch = useAppDispatch();

  const { purchase,modelAdddo } = useAppSelector(purchaseData)

  const [activeTab, setActiveTab] = useState('Prepurchase');


  const handleTabClick = (tabName: any) => {
    if (tabName === 'purchase') {
      if (purchase?.d_purchase_status[0].status_name == 'CS กำลังดำเนินการ') {
        setActiveTab(tabName);
      } else {
        dispatch(setOpenToast({
          type: 'info',
          message: 'ไม่สามารถเข้าถึงข้อมูลได้ กรุณาตีราคาให้สำเร็จก่อน'
        }))
      }
    } else {
      setActiveTab(tabName);
    }
  }



  const getPurchase = async (id:string) => {
    const purchases = await getPurchaseDetail(id)
    dispatch(setPurchaseData(purchases))
  }



  const getAgentCy =async()=>{
    try{
      let agentcy :any = await GetAgentCy()
      dispatch(setAgentcy(agentcy))
    }
    catch(err:any){
      console.log('sdff',err);
      throw new Error(err)
    }
  }

  useEffect(() => {
     getPurchase(id)
    GetdocumentPurchase(id)
    getAgentCy()

  }, [id])




  const GetdocumentPurchase = async (purchase_id:string)=>{
    try{
      let document :any = await getDocumentByid(purchase_id)
      dispatch(setDocument(document.document))
    }
    catch(err:any){
      throw new Error(err)
    }
  }

  const ClickAddpurchase =() =>{
    Swal.fire({
      title: "ต้องการรับงานใบนี้?",
      text: "ยืนยันข้อมูล",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText:"ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data: any = await updateTriggleStatus(id)
          if (data.status === 200) {
            dispatch(setOpenToast({
              type: 'success',
              message: 'รับงานสำเร็จ'
            }))

          } else {
            dispatch(setOpenToast({
              type: 'error',
              message: 'รับงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
            }))

          }
        } catch (error) {

          // Handle unexpected errors (e.g., network issues)
          console.error('Error updating trigger status:', error);
          dispatch(setOpenToast({type: 'error', message: 'เกิดข้อผิดพลาดในการรับงาน'})); // Generic error message
        } finally {
          await  getPurchase(id)
        }
      }
    });
  }


  const OpenModalDocument  = () =>{
    dispatch(setModalAdddo(true))
  }

  return(
    <>
      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">
            รายละเอียด
          </p>
        </div>
        <div className="justify-end p-5">
          {purchase?.d_emp_look == "" ?
            <Button className="border-[#273A6F]  bg-[#273A6F] mr-5"
                    style={{
                      color: "#FFFFFF"
                    }}
                    onClick={() => {
                      ClickAddpurchase()
                    }}
            >
              รับใบงานนี้ :
            </Button>
            :
            <>
              <Button className="border-[#273A6F]  bg-[#273A6F] mr-5"
                      style={{
                        color: "#FFFFFF"
                      }}
                      onClick={() => {
                        OpenModalDocument()
                      }}
              >
                <Lucide icon={"FilePlus"}
                        className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"></Lucide>
                ร้องขอเอกสารเพิ่ม :
              </Button>

              <Button className="border-[#273A6F]  bg-[#417CA0] mr-5"
                      style={{
                        color: "#FFFFFF"
                      }}
                      onClick={() => {
                        OpenModalDocument()
                      }}
              >
                <Lucide icon={"FilePlus"}
                        className="inset-y-0 bg-secondary-400  color-[#417CA0] mr-1  justify-center m-auto   w-5 h-5  text-slate-500"></Lucide>
                เอกสารที่ขอเพิ่ม :
              </Button>
            </>
          }

          <Button className="text-[#417CA0]  border-[#417CA0] bg-[#FFFFFF]

                    hover:bg-blue-200 hover:text-white"
                  style={{
                    background: "#fffff"
                  }}
          >
            <Clock
              color="#417CA0"
              className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
            ></Clock>
            Activity Log
          </Button>
        </div>
      </div>


      <div className="container mx-auto px-5 ">
        <div
          className="bg-white  rounded-lg "
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <div
            className="text-sm flex flex-wrap  justify-between  font-medium text-center text-gray-500 border-b border-gray-200">
            <ul className="flex  flex-wrap  -mb-px">
              <li className="me-2">
                <a
                  onClick={() => handleTabClick('Prepurchase')}
                  href="#"
                  className={`
                                 flex inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'Prepurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >ตีราคา
                  {purchase?.d_status === "Prepurchase" ?
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14.0606 9.06055L14.0606 9.06061L14.0666 9.05436C14.3399 8.77145 14.4911 8.39255 14.4877 7.99925C14.4842 7.60596 14.3265 7.22974 14.0484 6.95163C13.7703 6.67352 13.394 6.51576 13.0007 6.51234C12.6074 6.50893 12.2285 6.66012 11.9456 6.93336L11.9456 6.9333L11.9394 6.93945L9 9.87889L8.06055 8.93945L8.06061 8.93939L8.05436 8.93336C7.77145 8.66012 7.39255 8.50893 6.99925 8.51235C6.60596 8.51576 6.22974 8.67352 5.95163 8.95163C5.67352 9.22974 5.51576 9.60596 5.51234 9.99925C5.50893 10.3926 5.66012 10.7715 5.93336 11.0544L5.9333 11.0544L5.93945 11.0606L7.93945 13.0606L7.9395 13.0606C8.22079 13.3418 8.60225 13.4998 9 13.4998C9.39775 13.4998 9.77921 13.3418 10.0605 13.0606L10.0606 13.0606L14.0606 9.06055ZM15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5C8.01088 17.5 6.10322 16.7098 4.6967 15.3033C3.29018 13.8968 2.5 11.9891 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033Z"
                        fill="#10A697" stroke="#10A697"/>
                    </svg>
                    : ''}
                </a>
              </li>
              <li className="me-2">
                <a href="#"
                   onClick={() => handleTabClick('purchase')}
                   className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'purchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >ใบเสนอราคา</a>
              </li>
              <li className="me-2">
                <a href="#"
                   className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'ActivePurchase' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >อนุมัติราคา</a>
              </li>
              <li>
                <a
                  className={`
                                 inline-block p-4 border-b-2 text-black rounded-t-lg 
                                 ${activeTab === 'ข้อมูลลูกค้า' ? 'border-[#417CA0] text-[#417CA0]' : 'border-transparent'} 
                                 hover:text-gray-600 hover:border-gray-300
                               `}
                >อัพเดดสถานะ</a>
              </li>

            </ul>


            <p className="inline-block p-4  text-black rounded-t-lg  justify-end  text-black">
              <button
                className={`badge ${purchase?.color}   w-25 text-white   p-1 rounded-md`}
              >
                {purchase?.d_status}
              </button>
            </p>

          </div>

          {activeTab === "Prepurchase" ?

             <CSEditprepurchase></CSEditprepurchase>
            :
            activeTab === "purchase" && purchase?.d_purchase_status[0].status_name === 'CS กำลังดำเนินการ' ?
              <CsPurchaseComponent></CsPurchaseComponent>
              : null
          }

        </div>
        {modelAdddo ?
          <ModalAdddocument></ModalAdddocument> :null
        }
      </div>

    </>
  )
}

export default GroupPurchase