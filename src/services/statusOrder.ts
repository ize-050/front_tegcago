
import axios from '../../axios';



export const getCspurchase = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataCsStatus/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const getBookcabinet = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataBookcabinet/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}


export const getContain = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getContain/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const serviceCreateBookcabinet = async (data: any) => {
    return new Promise(async (resolve, reject) => {

        const d_purchase_id = data.d_purchase_id;
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createBookcabinet/${d_purchase_id}`;
        const formData = new FormData();
        if (data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('book_picture', data.files[i]);
            }
        }
        delete data.files
        for (const key in data) {
            formData.append(key, data[key]);
        }
        await axios.post(url,
            formData,
            {
                headers: {
                    Accept: 'multipart/form-data',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
            }).catch(err => {
                console.log("errrr",err)
                reject(err)
            })
    })
}

export const  serviceCreateReceive = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const d_purchase_id = data.d_purchase_id;
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createReceive/${d_purchase_id}`;
        const formData = new FormData();
        if (data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('receive_picture', data.files[i]);
            }
        }
        delete data.files
        for (const key in data) {
            formData.append(key, data[key]);
        }
        await axios.post(url,
            formData,
            {
                headers: {
                    Accept: 'multipart/form-data',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
    })
}

export const serviceCreateContain = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const d_purchase_id = data.d_purchase_id;
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createContain/${d_purchase_id}`;
        const formData = new FormData();
        
        const datas = data;

      
        if (data?.cabinet?.length > 0) {
            for (let i = 0; i < data.cabinet.length; i++) {
                formData.append('cabinet', data.cabinet[i]);
            }
            delete data.cabinet
        }

        if (data?.product?.length > 0) {
            for (let i = 0; i < data.product.length; i++) {
                formData.append('purchase_file', data.product[i]);
            }
            delete data.product
        }

        if (data?.close_cabinet?.length > 0) {
            for (let i = 0; i < data.close_cabinet.length; i++) {
                formData.append('close_cabinet', data.close_cabinet[i]);
            }
            delete data.close_cabinet
        }

        if (data?.etc?.length > 0) {
            for (let i = 0; i < data.close_cabinet.length; i++) {
                formData.append('etc', data.close_cabinet[i]);
            }
            delete data.etc
        }

        if(data?.items?.length > 0){
            formData.append('items', JSON.stringify(data.items));
            delete data.items
        }

       
        for (const key in data) {
            formData.append(key, data[key]);
        }
        await axios.post(url,
            formData,
            {
                headers: {
                    Accept: 'multipart/form-data',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
    })

}

export const  getReceive = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDataReceive/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}