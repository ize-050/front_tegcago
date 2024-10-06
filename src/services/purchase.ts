"use client"
import axios from '../../axios';




export const getPurchaseById = async (id: string) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getEstimate/${id}`;

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


export const getPurchase = async (currentPage: number, status: string, tag: string) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/getPurchase`;

        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    page: currentPage,
                    status: status,
                    tag: tag,
                    limit: 10
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


export const getAllPurchase = async (currentPage: number, status: string, tag: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getAllEstimate`;
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    page: currentPage,
                    status: status,
                    tag: tag,
                    limit: 10
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

export const cancelPurchase = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/cancelEstimate/${id}`;
        await axios.put(url,
            {
                headers: {
                    Accept: 'application/json',
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


export const getCheckBooking = () => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getCheckBooking`;
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data)
                }
            }).catch(err => {
                reject(err)
            })
    })

}

export const Submitaddpayment = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/submitAddpayment/${data.purchase_id}`;

        delete data.purchase_id
        await axios.post(url,
            data,
            {
                headers: {
                    Accept: 'application/json',
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


export const sendSubmitAddAgency = async (data: any) => {

    const purchase_id = data.purchase_id

    console.log('dataformdata', data)

    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/SubmitAddAgency/${purchase_id}`;
        let formData = new FormData();
        if (data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('d_image', data.files[i]);
            }
        }

        if (data.type.length > 0) {
            for (const typeItem of data.type) { // Use for...of loop for better readability
                try {
                    formData.append('type[]', JSON.stringify(typeItem)); // Append as JSON string
                } catch (error) {
                    // Handle the error (e.g., log it, show a message to the user)
                    console.error('Error appending type item to FormData:', error);
                }
            }
        }
        delete data.type
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


export const sentPrepurchase = async (data: any) => {

    const customer_id = data.customer_id
    // delete data.customer_id //ลบข้อมูลcustomer_id ทิ้ง
    // const Request ={
    //     ...data
    // }
 

    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/submitEstimate/${customer_id}`;
        const formData = new FormData();
        if (data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('d_image', data.files[i]);
            }
        }
        delete data.files
        for (const key in data) {
            formData.append(key, data[key]);
        }
        if(data.d_refund_tag ==""){
            formData.append('d_refund_tag', "");
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


export const sentEditPrepurchase = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/updatePreEstimate/${data.id}`;
        const formData = new FormData();
        if (data.files && data.files.length > 0) {
            data.files.forEach((image: any) => {
                if (image.status === 'added' || image.status === 'edited') {
                    formData.append('d_image', image.originalFile, image.name);
                } else if (image.status === 'unchanged' && image.id) {
                    formData.append('existingImageIds[]', image.id.toString());
                }
            });
        }
        delete data.files
        for (const key in data) {
            formData.append(key, data[key]);
        }
        delete data.id
        await axios.put(url,
            formData,
            {
                headers: {
                    Accept: 'application/json',
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


export const updateTriggleStatus = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/updateTriggleStatus/${id}`;
        await axios.put(url,

            {
                headers: {
                    Accept: 'application/json',
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


export const getDocumentByid = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/getDocumentByid/${id}`;
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data)
                }
            }).catch(err => {
                reject(err)
            })
    })
}



export const GetAgentCy = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/getAgentCy`;
        await axios.get(url,
            {
                headers: {
                    Accept: 'application/json',
                },
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data)
                }
            }).catch(err => {
                reject(err)
            })
    })

}

export const UpdateAgencytoSale = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/updateAgencytoSale`;
        await axios.post(url,
            data,
            {
                headers: {
                    Accept: 'application/json',
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



//cs

export const getPurchaseDetail = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/getPurchaseDetail/${id}`;
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


export const SentRequestFile = async (id: string, data: any) => { //ยิ่นคำร้องไฟลเอกสาร
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/SentRequestFile/${id}`;
        await axios.post(url,
            data,
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



export const submitAddorderPurchase = async (data: any) => {

    const d_purchase_id = data.d_purchase_id


    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/submitAddorderPurchase/${d_purchase_id}`;
        const formData = new FormData();
        if (data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('files', data.files[i]);
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


export const updatestatusPurchase = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/updatestatusPurchase/${id}`;
        await axios.put(url,
            {
                headers: {
                    Accept: 'application/json',
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


export const Submitpayment = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/submitpayment/${data.d_purchase_id}`;
        const formData = new FormData();

        console.log('data', data)
        const type = data.type.filter((item: any) => {
            return item.change === true
        })
  
        formData.append('type[]', JSON.stringify(type));
        for (let i = 0; i < type.length; i++) {
                formData.append('type_images', type[i]?.image);
        }

        if (data?.purchase_etc?.length > 0) {
            for (let i = 0; i < data.purchase_etc.length; i++) {
                formData.append('purchase_etc', data.purchase_etc[i]);
            }
            delete data.purchase_etc
        }

        if (data?.purchase_file?.length > 0) {
            for (let i = 0; i < data.purchase_file.length; i++) {
                formData.append('purchase_file', data.purchase_file[i]);
            }
            delete data.purchase_file
        }

        if (data?.condition?.length > 0) {
            for (let i = 0; i < data.condition.length; i++) {
                formData.append('condition', data.condition[i]);
            }
            delete data.condition
        }

        delete data.type


        for (const key in data) {
            formData.append(key, data[key]);
        }


        await axios.post(url,
            formData,
            {
                headers: {
                    Accept: 'application/json',
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