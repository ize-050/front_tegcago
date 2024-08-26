"use client";
import Lucide from '@/components/Base/Lucide'
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import React, { useState, useEffect } from 'react'


//store

import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import {
setSearchText
} from '@/stores/system'




const Search = () => {


    const dispatch = useAppDispatch()
    const [searchedVal, setSearchedVal] = useState("")
    const [currentData, setCurrentData] = useState([])

    useEffect(() => {
        dispatch(setSearchText(searchedVal))
    }, [searchedVal])

    return (
        <>
            <div className="grid grid-cols-2 gap-4 items-center space-x-6  p-4">
                <div className="relative">
                    <Lucide
                        icon="Search"
                        className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                    />
                    <FormInput
                        type="text"
                        placeholder="Search"
                        className="pl-9 sm:w-34 rounded-[0.5rem] text-black"
                        onChange={(e) => setSearchedVal(e.target.value)}
                    />
                </div>


                {/* <select
              id="deliver"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected>ส่งมอบงาน</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
            </select> */}
            </div>
        </>
    )


}

export default Search