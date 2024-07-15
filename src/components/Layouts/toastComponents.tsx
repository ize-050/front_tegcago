
'use client'
import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useToastState } from "@/context/toast-context"; // Add this import
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { utilData } from '@/stores/util'

const ToastComponent = () => {
    const { toastData } = useAppSelector(utilData);
    useEffect(() => {
        console.log('ttasdf')
        if (toastData.type === 'success') {
            toast.success((t) => (
                <>
                    {/* <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow dark:text-gray-400" role="alert"> */}
                    <div className="flex ">
                        <div 
                        style={{background:"#10A697"}}
                        className="flex inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-800  rounded-lg dark:bg-green-800 dark:text-green-200">
                            <svg className="w-5 h-5  text-white"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="sr-only bg-white">Check icon</span>
                        </div>
                        <div className="m-1 text-sm  font-extrabold">{toastData.message}</div>
                        </div>
                    {/* </div> */}
                </>
            ),
                {
                    icon: false,
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    // theme: "colored",
                    // transition: Bounce,
                },
            );
        }
        if (toastData.type === 'error') {
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

    }, [toastData])



    return (
        <>



            <ToastContainer />

            {/* Same as */}

        </>
    );
};

export default ToastComponent;
