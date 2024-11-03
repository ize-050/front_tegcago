"use client";
import React, { Fragment, useState, useCallback, useEffect, use } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setOpenModal, systemData } from '@/stores/system';

import {
    statusOrderData
    , setStoreTabActive,
    setDataAll
} from '@/stores/statusOrder';
import { Button } from '@headlessui/react';

import { purchaseData } from '@/stores/purchase';


//componentStatus
import Bookcabinet from './Tab/Bookcabinet';
import ReceiveComponent from './Tab/Receive'
import ContainComponent from './Tab/Contain';
import DocumentComponent from './Tab/Document';
import ProveDepartureComponent from './Tab/ProveDeparture';
import DepartureComponent from './Tab/Departure';
import ReleaseComponent from './Tab/Release'
import SuccessReleaseComponent from './Tab/SuccessRelease'
import DestinationComponent from './Tab/Destination';
import SentAlready from './Tab/SentAlready'
import ReturnComponent from './Tab/Return'
import EtcComponent from './Tab/Etc'


// service

import { getCspurchase } from '@/services/statusOrder';



const GroupTab = () => {

    const dispatch = useAppDispatch()
    const { tabStaus, status ,tab } = useAppSelector(statusOrderData)


    const { purchase } = useAppSelector(purchaseData)


    const setTabActive = useCallback(async(item: any) => {
        console.log(item)

        await dispatch(setStoreTabActive(item))
        
    }, [tabStaus])


    useEffect(() => {

    
        dispatch(setStoreTabActive({
            id: "1",
            tabName: "จองตู้",
            tabKey: "bookcabinet",
            action: "จองตู้",
        }))

    }, [])

    const fetchData = useCallback(async () => {
        const cs_purchase:any = await  getCspurchase(purchase.id)
        
        if(cs_purchase){
            dispatch(setDataAll(cs_purchase))
        }
    },[status])

    useEffect(() => {

        fetchData()

    },[purchase])

    return (
        <>
            <div className="p-5 flex text-black">
                <div className="flex-1 w-50">
                    <h1 className="text-2xl font-semibold">อัพเดดสถานะการจอง</h1>
                </div>
            </div>
            <div className="md:flex">
                <ul className="w-1/4 relative  p-2 text-sm font-medium text-gray-500 dark:text-gray-400 ">
                    {tabStaus.map((item, index) => (
                        <Fragment key={index}>
                            <li className={`hover:bg-[#475884]
                            ${item.active ? 'bg-[#475884] text-white' : 'bg-white'}
                            cursor-pointer  
                            hover:text-white flex items-center space-x-2`}
                            onClick={() => {
                                setTabActive(item)
                            }}
                            >
                                <span
                                    className="px-10 py-2  rounded-lg"
                                  
                                >{item.tabName}</span>
                            </li>
                        </Fragment>
                    ))}

              
                    <div className="absolute  ml-3  border-[#D6D6D6] border-[1px] h-full right-0 top-0">

                    </div>
             
                </ul>

            
                <div className="pl-5 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                    {tab?.id === "1" && <Bookcabinet purchase={purchase}></Bookcabinet>}
                    {tab?.id === "2" && <ReceiveComponent purchase={purchase}></ReceiveComponent>}
                    {tab?.id === "3" && <ContainComponent purchase={purchase}></ContainComponent>}
                    {tab?.id === "4" && <DocumentComponent purchase={purchase}></DocumentComponent>}
                    {tab?.id === "5" && <ProveDepartureComponent purchase={purchase}></ProveDepartureComponent>}
                    {tab?.id === "6" && <DepartureComponent purchase={purchase}></DepartureComponent>}
                    {tab?.id === "7" && <ReleaseComponent purchase={purchase}></ReleaseComponent>}
                    {tab?.id === "8" && <SuccessReleaseComponent purchase={purchase}></SuccessReleaseComponent>}
                    {tab?.id === "9" && <DestinationComponent purchase={purchase}></DestinationComponent>}
                    {tab?.id === "10" && <SentAlready purchase={purchase}></SentAlready>}
                    {tab?.id === "11" && <ReturnComponent purchase={purchase}></ReturnComponent>}
                    {tab?.id === "12" && <EtcComponent purchase={purchase}></EtcComponent>}
                </div>
            </div>


        </>
    )

}


export default GroupTab;