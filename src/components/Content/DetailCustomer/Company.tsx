import React, { useEffect, useState } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"

const CompanyComponent = ({ control, errors }: any) => {

    return (
        <>
            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ผู้ตัดสินใจ</label>
                    <Controller
                        name="cd_consider"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ประเภทสินค้านำเข้า-ส่งออก</label>
                    <Controller
                        name="cd_typeinout"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />

                </div>
            </div>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ประเภทลูกค้า</label>
                    <Controller
                        name="cd_custype"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ประเภทใช้บริการ</label>
                    <Controller
                        name="cd_cusservice"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                </div>
            </div>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ช่องทางการจัดจำหน่าย</label>
                    <Controller
                        name="cd_channels"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>
                <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">อายุบริษัท</label>
                        <Controller
                            name="cd_num"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                       
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ทุนบริษัท</label>
                        <Controller
                            name="cd_capital"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                     
                    </div>

                </div>
            </div>


            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">จำนวนกรรมการบริษัท</label>
                        <Controller
                            name="cd_emp"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                      
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ผู้ถือหุ้น</label>
                        <Controller
                            name="cd_shareholders"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                        
                    </div>

                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ที่ตั้งสำนักงาน</label>
                    <Controller
                        name="cd_address"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>
            </div>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">จำนวนสาขา</label>
                    <Controller
                        name="cd_num_saka"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">สิ่งที่กังวล/ให้ความสำคัญ</label>
                    <Controller
                        name="cd_priority"
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <textarea onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                        )}

                    />
                    {/* {errors.cd_company && <p className="text-red-500">กรุณากรอกชื่อบริษัท (ถ้ามี).</p>} */}
                </div>
            </div>

            <div className="flex  flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-5">

                <div className="flex w-2/4  md:flex-row md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700  text-sm font-semibold">ความถี่ในการนำเข้า</label>
                        <Controller
                            name="cd_frequency"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col">
                        <label className="block mb-2 text-lg text-gray-700 font-semibold text-sm">ขึ้นทะเบียนผู้นำเข้า</label>
                        <Controller
                            name="cd_leader"
                            control={control}
                            rules={{ required: false }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input type="text" onChange={onChange} value={value} placeholder="กรอก" className="px-4 py-2 outline-none rounded-md border border-gray-300 text-base" />
                            )}

                        />
                    
                    </div>

                </div>


            </div>

            

        </>
    )
}


export default CompanyComponent