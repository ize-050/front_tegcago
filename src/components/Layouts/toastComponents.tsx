
'use client'
import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useToastState } from "@/context/toast-context"; // Add this import
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
 import {utilData} from '@/stores/util'

const ToastComponent = () => {
const { toastData } = useAppSelector(utilData);
   useEffect(()=>{
    console.log('ttasdf')
    if(toastData.type ==='success'){
        toast.success(`${toastData.message}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            // transition: Bounce,
            });
    }
    if(toastData.type ==='error'){
            toast.error(`${toastData.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                // transition: Bounce,
                });
        }
    
   },[toastData]) 
      
    

    return (
        <>
       
        

            <ToastContainer />

            {/* Same as */}
           
        </>
    );
};

export default ToastComponent;
