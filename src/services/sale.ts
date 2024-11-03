"use client"
import axios from '../../axios';



interface RequestData {
    id: string
    employeeId: string
}

export const applyEmployee = async (RequestData: RequestData) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/applyEmployee/${RequestData.id}`;

        await axios.put(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                employeeId: RequestData.employeeId
            }).then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
    })
}

export const acceptJob = async (id:string,data:any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/acceptJob/${id}`;
        await axios.put(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                is_active: data.is_active
            }).then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
            })
    })
}

export const Canceljob = async (id:string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/cancelJob/${id}`;
        await axios.delete(url, { headers: { Accept: 'application/json' } }).then(res => {
            if (res.status === 200) {
                resolve(res)
            }
        }).catch(err => {
            reject(err)
        })
    })
}