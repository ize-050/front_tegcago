"use client";
import { Fragment, useCallback, useEffect, useState } from 'react';
import { GetNotification, ReadNotification, ReadAllNotification } from '@/services/notification';

import moment from 'moment';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { update } from 'lodash';
import Lucide from '../Base/Lucide';

const NotificationComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countNotification, setCountNotification] = useState<number>();

    const [NotificationData, setNotificationData] = useState<any>([])
    const router = useRouter()
    function setIsDropdownOpenHandler() {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const getNotificationAll = useCallback(async () => {
        try {
            let notification: any = await GetNotification()
            console.log("getNotification", notification)
            setNotificationData(notification)
            setCountNotification(notification.length)
        }
        catch (err) {
            console.log("getNotificationError", err)
        }

    }, [NotificationData])

    const updateNotification = async (id: string) => {
        try {
            const notification = await ReadNotification(id)
            console.log("getNotification", notification)
            await getNotificationAll()
        }
        catch (err) {
            console.log("readNotificationError", err)
        }

    }

    const clearNotification = async () => {
        try {
            const notification = await ReadAllNotification()

            await getNotificationAll()
        }
        catch (err) {
            console.log("readAllerror", err)
        }
    }

    useEffect(() => {
        getNotificationAll()
    }, [])



    return (
        <>
            <div className="relative font-[sans-serif] w-max mx-auto">
                <button type="button" id="dropdownToggle"
                    className="w-12 h-12 relative flex items-center justify-center rounded-full text-black border-none outline-none "
                    onClick={() => setIsDropdownOpenHandler()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" className="cursor-pointer fill-[#000]"
                        viewBox="0 0 371.263 371.263">
                        <path
                            d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                            data-original="#000000"></path>
                    </svg>
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{countNotification}</span>
                </button>

                <div id="dropdownMenu" className={`absolute block right-0 shadow-lg bg-white py-4 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto mt-2 ${isDropdownOpen ? "" : "hidden"
                    }`}>
                    <div className="flex flex-row items-center justify-between px-4 mb-4 border-b-2  border-blue-200">
                        <p className="text-xs  text-blue-600 cursor-pointer mb-2  mr-5">
                            <button type="button" className="flex items-center justify-center text-xs text-blue-600 cursor-pointer"
                                onClick={() => {
                                    clearNotification();
                                }}
                            >
                                <Lucide icon="Trash" className="w-4" />
                                Clear all

                            </button>
                        </p>

                    </div>

                    <ul className="divide-y overflow-scroll max-h-50">
                        {NotificationData.map((item: any, index: number) => (
                            <Fragment key={index}>

                                <li
                                    onClick={async () => {
                                        await updateNotification(item.id)
                                        router.push(`/${item.link_to}`)
                                        setIsDropdownOpen(false)

                                    }}
                                    className='p-4 flex items-center hover:bg-gray-50 cursor-pointer'>
                                    {/* <img src="https://readymadeui.com/profile_2.webp" className="w-12 h-12 rounded-full shrink-0" /> */}

                                    <div className="flex-1 w-full"> {/* Added flex-1 to push the button down */}
                                        <h3 className="text-sm text-[#333] font-semibold">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-2">{item.message}</p>
                                        <p className="text-xs text-blue-600 leading-3 mt-2">{moment(item.createdAt).format('YYYY/MM/DD HH:mm:ss')}</p>
                                    </div>

                                    <div className="self-end"> {/* Align the button to the right within the li */}
                                    </div>
                                </li>
                            </Fragment>
                        ))}



                    </ul>
                    {/* <p className="text-xs px-4 mt-6 mb-4 inline-block text-blue-600 cursor-pointer">View all Notifications</p> */}
                </div>
            </div>
        </>
    )
}

export default NotificationComponent