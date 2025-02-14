
import axios from '../../axios';

export const getPurchase = async (params:Partial<any>) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/getPurchase`;
        const data_params ={
           ...params
        }
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    ...data_params,
                }
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}

export const getPurchaseByid = async (id:string) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/getPurchaseById/${id}`;
        
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}


export const getWorkByid = async (id:string) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/getWorkByid/${id}`;
        
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}


export const getWidhdrawalInformation = async (params:Partial<any>) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/getWidhdrawalInformation`;
        const data_params ={
           ...params
        }
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    ...data_params,
                }
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}