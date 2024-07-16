import axios from '../../axios';




export const getPurchaseById = async(id:string) =>{
    return  new Promise(async(resolve,reject) =>{

        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getEstimate/${id}`;

       await axios.get(url,
            {
            headers: {
                Accept: 'application/json',
               
            },
        }).then(res=>{
            if(res.status ===200){
                resolve(res.data.data)
            }
        }).catch(err=>{
            reject(err)
        })
    })
}


export const sentPrepurchase = async(data:any)=>{

    const customer_id = data.customer_id
    // delete data.customer_id //ลบข้อมูลcustomer_id ทิ้ง
    // const Request ={
    //     ...data
    // }

    return new Promise(async(resolve,reject) =>{
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/submitEstimate/${customer_id}`;
        const formData = new FormData();
        for (const key in data) {
            console.log('key',key)
            formData.append(key, data[key]);
          }

        await axios.post(url,
            formData,
            {
            headers: {
                Accept: 'multipart/form-data',
            },
        }).then(res=>{
            if(res.status ===200){
                resolve(res)
            }
        }).catch(err=>{
            reject(err)
        })
    })
}




