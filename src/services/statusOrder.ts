
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
        
        Object.keys(data).forEach((key) => {
            console.log("key",data[key])
           for (let i = 0; i < data[key].length; i++) {
            formData.append(`${key}`, data[key][i].originalFile);
           }
         });

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