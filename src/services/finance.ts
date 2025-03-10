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
        const data_params = {
           ...params
        }
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                params: data_params
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}

export const exportWithdrawalInformationToExcel = async (params: Partial<any>) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/export-withdrawal-excel`;
        const data_params = {
            ...params
        }
        
        try {
            // Use window.open to trigger the download
            const queryString = new URLSearchParams(data_params).toString();
            const downloadUrl = `${url}?${queryString}`;
            window.open(downloadUrl, '_blank');
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

export const getCustomerAccounts = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/customer-accounts`;
        
        await axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                resolve(res.data.data);
            }
        }).catch(err => {
            console.error("Error fetching customer accounts:", err);
            reject(err);
        });
    });
}

export const getCompanyAccounts = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/finance/company-accounts`;
        
        await axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                resolve(res.data.data);
            }
        }).catch(err => {
            console.error("Error fetching company accounts:", err);
            reject(err);
        });
    });
}