'use client'
import { useState, useEffect, createRef, useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { signIn, useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'
import {setOpenToast} from '@/stores/util'
import { useAppDispatch} from '@/stores/hooks';

interface Login {
    email: string
    password: string
}

const Login = () => {
    const session :any =  useSession()
    console.log('session',session)

    useEffect(() => {

        if (session.status  === "authenticated") {
             router.push(`/`);
        }
    }, [session]);

    const dispatch = useAppDispatch()
    const router = useRouter()
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<Login> =async (data) => {
        
        try {
            const result = await signIn('credentials', {
              ...data, // Pass the email and password from your form
              redirect: false, // Prevent automatic redirect after successful login
            });
      
            if (result?.error) {
                const data =  {
                    type :'error',
                    message :'Email หรือ Password ผิดพลาด'
                }
                dispatch(setOpenToast(data))
            } else {

              router.push("/")
            }
          } catch (error) {
            console.error('An error occurred during sign-in:', error);
            const data =  {
                type :'error',
                message :'ระบบเกิดข้อผิดพลาด กรุณาแจ้ง Admin'
            }
            dispatch(setOpenToast(data))
            // Handle unexpected errors
          }
        };
        
    return (
        <>
            <div className="h-screen 
             from-blue-600 to-indigo-600 flex justify-center items-center w-full"
                style={{
                    background: "linear-gradient(0.44deg, #213269 -60.38%, #1D3154 50%)"
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border-b-2 border-stone-300 mb-3">
                        <img src="/logo.png" className="mx-auto mb-10"></img>
                    </div>
                    <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">

                        {/* <h1 className="text-center text-2xl font-semibold text-gray-600 mb-3">เข้าสู่ระบบ</h1> */}
                        <div className="text-center">
                            Welcome to TegCargo System,
                            <br></br>
                            Please Login to your Account.
                        </div>
                        <div className="space-y-4">

                            <div>
                                <label className="block mb-1 text-gray-600 font-semibold">Email</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <input
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            type="text" className={`
                                            ${errors.email ? 'border-red-500' : 'bg-indigo-50'}
                                            bg-indigo-50 px-4 py-2 outline-none rounded-md w-full text-black`} />
                                    )}

                                />
                                {errors.email && <p className="text-red-500">กรุณากรอกข้อมูลEmail.</p>}

                            </div>
                            <div>
                                <label className="block mb-1 text-gray-600 font-semibold">Password</label>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <input
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            
                                            type="password" className={`
                                                ${errors.email ? 'border-red-500' : 'bg-indigo-50'}
                                                bg-indigo-50 px-4 py-2 outline-none rounded-md w-full text-black`} />
                                    )}

                                />
                                 {errors.password && <p className="text-red-500">กรุณากรอกข้อมูลพาสเวิส.</p>}

                            </div>
                        </div>
                        <button type="submit" className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">เข้าสู่ระบบ</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login