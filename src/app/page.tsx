
"use client"
import { useEffect } from "react";
import dynamic from 'next/dynamic'

const DashboardComponent = dynamic(() => import('@/components/dashboard/Dashboard'), { ssr: false })

const Main = () => {


    return (
        <>
            <div className="container mx-auto p-5">
                <div className="flex-1 w-50">
                    <h1 className="mb-5  font-semibold text-2xl">Dashboard</h1>
                </div>
                <DashboardComponent />
            </div>
        </>
    )
}

export default Main