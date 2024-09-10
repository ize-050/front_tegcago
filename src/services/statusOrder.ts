
import { get } from 'lodash';
import axios from '../../axios';
import App from 'next/app';



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


    export const createDocumentStatus =async (data:any)=>{
        return new Promise(async (resolve, reject) => {
            const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createDocumentStatus/${data.d_purchase_id}`;
            const formData = new FormData();
            const files: any = {
                document_file_invoice: data?.document_file_invoice,
                document_packinglist: data?.document_packinglist,
                document_file_packing: data?.document_file_packing,
                document_FE: data?.document_FE,
                document_file_etc: data?.document_file_etc,
                document_approve: data?.document_approve,
                file_draft_invoice: data?.file_draft_invoice,
                document_BL: data?.document_BL,
                document_file_master_BL: data?.document_file_master_BL,
            };
            [
                'document_file_invoice',
                'document_packinglist',
                'document_file_packing',
                'document_FE',
                'document_file_etc',
                'document_approve',
                'file_draft_invoice',
                'document_BL',
              ].forEach((key) => delete data[key]);

            Object.keys(files).forEach((key: string) => {
                // ตรวจสอบว่า value ของคีย์นั้นเป็น array หรือไม่
                if (Array.isArray(files[key]) && files[key].length > 0) {
                appendFilesToFormData(formData, key, files[key]);
                }
            });
            Object.keys(data).forEach((key: string) => {
                formData.append(key, data[key]);
              });
          
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

export const  getDocumentStatus = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDocumentStatus/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const CreateDeparture = async (data:any)=>{
    return new Promise(async(resolve,reject)=>{
        const id = data.d_purchase_id;
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createDeparture/${id}`;
        await axios.post(url,
            data,
            {
                headers: {
                    Application: 'application/json',
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

export const getDeparture = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getDeparture/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const CreateWaitrelease = async (data:any)=>{
    return new Promise(async(resolve,reject)=>{
        const id = data.d_purchase_id;
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createWaitrelease/${id}`;
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
                resolve(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const getWaitrelease = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getWaitrelease/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export const createSuccessRelease = async(data:any)=>{
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/createSuccessRelease/${data.d_purchase_id}`;
        const formData = new FormData();
        const files: any = {
            file_do: data?.file_do,
            file_card: data?.file_card,
            file_return_document: data?.file_return_document,
        };
        [
            'file_do',
            'file_card',
            'file_return_document',
          ].forEach((key) => delete data[key]);

        Object.keys(files).forEach((key: string) => {
            // ตรวจสอบว่า value ของคีย์นั้นเป็น array หรือไม่
            if (Array.isArray(files[key]) && files[key].length > 0) {
            appendFilesToFormData(formData, key, files[key]);
            }
        });
        Object.keys(data).forEach((key: string) => {
            formData.append(key, data[key]);
          });
      
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

export const getSuccessRelease = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs_status/getSuccessRelease/${id}`;
        await axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

const appendFilesToFormData = (formData: FormData, key: string, files: string[]): void => {
    files.forEach((filePath: string) => {
      formData.append(`${key}`, filePath);
    });
  };