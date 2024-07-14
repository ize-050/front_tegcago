import axios from '../../axios';




export const getCustomer = async(currentPage:number,status:string,tag:string) =>{
    return  new Promise(async(resolve,reject) =>{

        
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getCustomer`;

        const data =  await axios.get(url,
            {
            headers: {
                Accept: 'application/json',
               
            },
            params:{
                page :currentPage,
                status:status,
                tag:tag,
                limit :10
            }
        }).then(res=>{
            if(res.status ===200){
                resolve(res.data.data)
            }
        }).catch(err=>{
            reject(err)
        })
    })
}


export const submitAddcustomer = async (data:Partial<any>) =>{ //บันทึกcustomer เบื้องต้น
    return  new Promise(async(resolve,reject) =>{
        console.log('dataCustomer',data)
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/createCustomer`;
        axios.post(url,{
            ...data
        },{
            headers: {
                ContentType: 'application/json',
                Accept: 'application/json',
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

export const changeStatusToid = async(data:Partial<any>) =>{ //ปรับสถานะลูกค้า
   
    return  new Promise(async(resolve,reject) =>{
        console.log('dataata',data)
        const status = data.status
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/changetagStatus/`;
        axios.put(url + data.id,{
           status
        },{
            headers: {
                Accept: 'application/json',
              
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



