"use client"

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import Chart from 'react-apexcharts'

const DashboardComponent = () => {

    const [chartOptions, setChartOptions] = useState<any>({});

    const [series, setSeries] = useState<any>([]);

    useEffect(() => {
        setChartOptions({
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            },
            series: [
                {
                    name: "series-1",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
            ]
        })


        setSeries({
            options: {
                chart: {
                    id: "donut-chart",
                },
                labels: ["Team A", "Team B", "Team C"]
            },
            series: [30, 55, 41], 
        })
    }, [])


    return (
        <>
            <div className="flex  flex-row ">
                <div className="
           basis-1/4
            mr-5
            max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-row">
                        <h5 className="mb-2 text-xl flex-1 justify-start font-bold tracking-tight text-gray-900 dark:text-white">ลูกค้าทั้งหมด</h5>

                        <div className=" justify-end">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M0 30V44C0 52.8366 7.16344 60 16 60H30H44C52.8366 60 60 52.8366 60 44V30V16C60 7.16344 52.8366 0 44 0H30H16C7.16344 0 0 7.16344 0 16V30Z" fill="#8280FF" />
                                <path opacity="0.587821" fill-rule="evenodd" clip-rule="evenodd" d="M20.666 23.3333C20.666 26.2789 23.0538 28.6667 25.9993 28.6667C28.9449 28.6667 31.3327 26.2789 31.3327 23.3333C31.3327 20.3878 28.9449 18 25.9993 18C23.0538 18 20.666 20.3878 20.666 23.3333ZM34 28.6667C34 30.8759 35.7909 32.6667 38 32.6667C40.2091 32.6667 42 30.8759 42 28.6667C42 26.4576 40.2091 24.6667 38 24.6667C35.7909 24.6667 34 26.4576 34 28.6667Z" fill="#8280FF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M25.9778 31.333C19.6826 31.333 14.5177 34.5684 14.0009 40.9319C13.9727 41.2786 14.6356 41.9997 14.97 41.9997H36.9956C37.9972 41.9997 38.0128 41.1936 37.9972 40.933C37.6065 34.3906 32.3616 31.333 25.9778 31.333ZM45.2742 41.9997H40.1337V41.9995C40.1337 38.9983 39.1421 36.2287 37.4688 34.0005C42.0103 34.0504 45.7185 36.3468 45.9976 41.1997C46.0088 41.3951 45.9976 41.9997 45.2742 41.9997Z" fill="#8280FF" />
                            </svg>
                        </div>
                    </div>
                    <p className="font-semibold text-xl">
                        1,345
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Up from yesterday</p>

                </div>

                <div className="
           basis-1/4
            mr-5
            max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-row">
                        <h5 className="mb-2 text-xl flex-1 justify-start font-bold tracking-tight text-gray-900 dark:text-white">จำนวนการบันทึก</h5>

                        <div className=" justify-end">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M0 30V37C0 49.7025 10.2975 60 23 60H30H37C49.7025 60 60 49.7025 60 37V30V23C60 10.2975 49.7025 0 37 0H30H23C10.2975 0 0 10.2975 0 23V30Z" fill="#FF9066" />
                                <path opacity="0.78" fill-rule="evenodd" clip-rule="evenodd" d="M28.6319 23.8093C28.6519 23.5488 28.8692 23.3477 29.1304 23.3477H29.5482C29.8051 23.3477 30.0202 23.5423 30.0458 23.7979L30.6674 30.0143L35.0821 32.537C35.2379 32.626 35.3341 32.7917 35.3341 32.9712V33.3597C35.3341 33.6894 35.0206 33.9288 34.7025 33.8421L28.3994 32.123C28.168 32.0599 28.014 31.8414 28.0324 31.6023L28.6319 23.8093Z" fill="#FF9066" />
                                <path opacity="0.901274" fill-rule="evenodd" clip-rule="evenodd" d="M22.7224 14.9846C22.4583 14.6698 21.9483 14.7903 21.853 15.19L20.2195 22.0381C20.1419 22.3638 20.3999 22.6723 20.7342 22.6533L27.7789 22.2541C28.1898 22.2308 28.3982 21.7488 28.1337 21.4335L26.332 19.2864C27.4968 18.8885 28.7318 18.6806 30 18.6806C36.2592 18.6806 41.3333 23.7547 41.3333 30.014C41.3333 36.2732 36.2592 41.3473 30 41.3473C23.7408 41.3473 18.6667 36.2732 18.6667 30.014C18.6667 28.9632 18.809 27.934 19.0864 26.9449L16.5188 26.2247C16.1808 27.4299 16 28.7008 16 30.014C16 37.7459 22.268 44.014 30 44.014C37.732 44.014 44 37.7459 44 30.014C44 22.282 37.732 16.014 30 16.014C28.0553 16.014 26.2032 16.4105 24.5201 17.1271L22.7224 14.9846Z" fill="#FF9066" />
                            </svg>

                        </div>
                    </div>
                    <p className="font-semibold text-xl">
                        1,345
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Up from yesterday</p>

                </div>

                <div className="
            basis-1/4
            mr-5
            max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-row">
                        <h5 className="mb-2 text-xl flex-1 justify-start font-bold tracking-tight text-gray-900 dark:text-white">ปิดการขาย</h5>

                        <div className=" justify-end">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M0 30V44C0 52.8366 7.16344 60 16 60H30H44C52.8366 60 60 52.8366 60 44V30V16C60 7.16344 52.8366 0 44 0H30H16C7.16344 0 0 7.16344 0 16V30Z" fill="#87B5FF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M30.5004 17.0996C27.0764 17.0996 24.3004 19.8757 24.3004 23.2996V24.8496H22.7504C21.9599 24.8496 21.2965 25.4433 21.2097 26.2291L19.6597 40.1791C19.6116 40.6162 19.7511 41.0548 20.0456 41.3834C20.3401 41.712 20.7602 41.8996 21.2004 41.8996H39.8004C40.2406 41.8996 40.6606 41.712 40.9551 41.3834C41.2496 41.0548 41.3891 40.6162 41.3411 40.1791L39.7911 26.2291C39.7043 25.4433 39.0409 24.8496 38.2504 24.8496H36.7004V23.2996C36.7004 19.8757 33.9243 17.0996 30.5004 17.0996ZM33.6004 24.8496V23.2996C33.6004 21.5869 32.2131 20.1996 30.5004 20.1996C28.7876 20.1996 27.4004 21.5869 27.4004 23.2996V24.8496H33.6004ZM24.3004 29.4996C24.3004 28.644 24.9948 27.9496 25.8504 27.9496C26.706 27.9496 27.4004 28.644 27.4004 29.4996C27.4004 30.3552 26.706 31.0496 25.8504 31.0496C24.9948 31.0496 24.3004 30.3552 24.3004 29.4996ZM35.1504 27.9496C34.2948 27.9496 33.6004 28.644 33.6004 29.4996C33.6004 30.3552 34.2948 31.0496 35.1504 31.0496C36.006 31.0496 36.7004 30.3552 36.7004 29.4996C36.7004 28.644 36.006 27.9496 35.1504 27.9496Z" fill="#5093FF" />
                            </svg>

                        </div>
                    </div>
                    <p className="font-semibold text-xl">
                        1,345
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Up from yesterday</p>

                </div>

                <div className="
            basis-1/4
            mr-5
            max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-row">
                        <h5 className="mb-2 text-xl flex-1 justify-start font-bold tracking-tight text-gray-900 dark:text-white">ยอดรวมทั้งหมด</h5>

                        <div className=" justify-end">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.11111 24.8889H26.4444C27.3036 24.8889 28 25.5853 28 26.4444C28 27.3036 27.3036 28 26.4444 28H1.55556C0.696446 28 0 27.3036 0 26.4444V1.55556C0 0.696446 0.696446 0 1.55556 0C2.41467 0 3.11111 0.696446 3.11111 1.55556V24.8889Z" fill="#4AD991" />
                                <path opacity="0.5" d="M8.91305 18.175C8.32547 18.8017 7.34106 18.8335 6.71431 18.2459C6.08756 17.6583 6.0558 16.6739 6.64338 16.0472L12.4767 9.82494C13.045 9.21879 13.9893 9.16623 14.6213 9.70555L19.2253 13.6343L25.224 6.03606C25.7563 5.36176 26.7345 5.24668 27.4088 5.77903C28.0831 6.31137 28.1982 7.28955 27.6658 7.96385L20.6658 16.8305C20.1191 17.5231 19.1063 17.6227 18.4351 17.0499L13.7311 13.0358L8.91305 18.175Z" fill="#4AD991" />
                            </svg>


                        </div>
                    </div>
                    <p className="font-semibold text-xl">
                        1,345
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Up from yesterday</p>

                </div>
            </div>

            <br></br>

            <div className="flex  flex-row ">
                <div className="
            basis-3/4
            mr-5
             p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                    {chartOptions.series && chartOptions.series.length > 0 && (
                        <Chart
                            options={chartOptions}
                            series={chartOptions.series}
                            type="bar"
                            width="500"
                        />
                    )}
                </div>
                <div className="
            basis-1/4
            mr-5
             p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <p className="text-1xl font-semibold">Tash ทั้งหมด</p>
                <p className="text-sm">จำนวน Task ทั้งหมด</p>
                    {series.series && series.series.length > 0 && (
                        <Chart
                            options={series}
                            series={series.series}
                          
                            type="donut"
                            width="500"
                        />
                    )}
                </div>
            </div>


        </>
    )
}


export default DashboardComponent