"use client";
import React, { useEffect, useState } from 'react';

import { useForm, Controller, SubmitHandler } from "react-hook-form"


const SocialMedia = ({ control, errors }: any) => {
    return (
        <>
            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Website</label>
                    <Controller
                        name="cus_website"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ID Line</label>
                    <Controller
                        name="cus_line"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {errors.cus_line && <p className="text-red-500">กรุณากรอก ID LINE</p>}
                </div>
            </div>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">Facebook</label>
                    <Controller
                        name="cus_facebook"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">Wechat</label>
                    <Controller
                        name="cus_wechat"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />

                </div>
            </div>
        </>
    )
}



export default SocialMedia