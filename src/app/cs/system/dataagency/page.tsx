"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


//service

import {
    getDataAgentcy
} from '@/services/system/agency'


//component

import Lucide from '@/components/Base/Lucide'
import ModalAgency from '@/components/CS/Agency/Modal/ModalAgentCy'


import Search from '@/components/CS/Agency/Search'
import Table from '@/components/CS/Agency/Table'
import { Button } from '@headlessui/react'
import { CirclePlus } from 'lucide-react'

//store

import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import {
    setCurrentPage,
    systemData,
    setAgencyData,
    setTotalPage,
    setOpenModal
} from '@/stores/system'
import { set } from 'lodash';

//lib


const DataAgency = () => {
    const router = useRouter()

    const {
        CurrentPage,
        modal
    } = useAppSelector(systemData)

    const dispatch = useAppDispatch()
    //function

    const getdata = async () => {
        console.log("get data")
        try {
            const response: {
                data: any[],
                TotalPage: number
            } = await getDataAgentcy(CurrentPage)

            console.log("response", response)
            dispatch(setAgencyData(response.data))
            dispatch(setTotalPage(response.TotalPage))
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    useEffect(() => {
        getdata()
    }, [])



    return (
        <>
            <nav aria-label="Breadcrumb" className="p-5">
                <ol className="flex items-center space-x-2">
                    <li className="flex items-center">
                        <a href="#" className="inline-flex items-center text-gray-500 hover:text-gray-700">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span className="ml-1">Home</span>
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="text-gray-500">/</span>
                            <a href="#" className="ml-1 text-gray-500 hover:text-gray-700">System</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="text-gray-500">/</span>
                            <span className="ml-1 text-gray-700">Agency</span>
                        </div>
                    </li>
                </ol>
            </nav>


            <div className="flex items-center justify-between p-5">
                <h1 className="text-2xl  text-black  font-semibold">รายการข้อมูลAgency</h1>
                <Button
                    onClick={() => {
                        dispatch(setOpenModal({ open: true, type: "create" }))
                    }}
                    className="flex items-center px-4 py-2 space-x-2 bg-[#273A6F]    text-white rounded-lg hover:bg-blue-600"
                >
                    <CirclePlus size={20} />
                    <span>เพิ่มข้อมูล</span>
                </Button>

            </div>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
                <div className="col-span-1">
                    <Search />
                </div>
                <div className="col-span-3">
                    <Table />
                </div>
                {modal?.open &&
                    <ModalAgency></ModalAgency>
                }

            </div>
        </>
    )


}

export default DataAgency