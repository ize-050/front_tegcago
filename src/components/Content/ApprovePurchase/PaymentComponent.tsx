"use client"

//component
import UploadImageComponent from "../../Uploadimage/UpdateImageComponent";
import ConfirmPayment from "./ConfirmPayment";



const PaymentComponent =({
    setValue,
    control
}:{
    setValue:any,
    control:any
}) =>{
    return(
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
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                </div>
            </div>

            <hr className="mb-5 mt-5"></hr>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2  text-gray-500  text-sm font-semibold">เงื่อนไขการชำระเงิน</label>
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                </div>
            </div>

            <hr className="mb-5 mt-5"></hr>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2  text-gray-500  text-sm font-semibold">หมายเหตุ</label>
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>
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

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2  text-gray-500  text-sm font-semibold">Ref: เลขที่ใบเสนอราคา</label>
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                </div>
            </div>

          

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2  text-gray-500  text-sm font-semibold">เงื่อนไขการชำระเงิน</label>
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>

                </div>
            </div>

           

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-5 ">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2  text-gray-500  text-sm font-semibold">หมายเหตุ</label>
                   
                </div>

                <div className="flex flex-col w-1/2">
                  <UploadImageComponent setValue={setValue} control={control}></UploadImageComponent>
                </div>
            </div>


        </div>


        <hr className="mb-5 mt-5 "></hr> 

        <ConfirmPayment setValue={setValue} control={control}></ConfirmPayment>
        </>
    )
}

export default PaymentComponent;