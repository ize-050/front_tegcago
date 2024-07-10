import axios from 'axios';




export const getCustomer = async() =>{
    return  new Promise(async(resolve,reject) =>{

        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/getCustomer`;

        const data =  await axios.get(url,{
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjZhZGNiMS01MmI2LTRjMjYtYTQ0YS03ODBkMWM0YzIyZGQiLCJpYXQiOjE3MjA2Mjg5MTMsImV4cCI6MTcyMDcxNTMxM30.0iczWCxwa34LqANuyDrEPTiXjL5V5s-KlzJRPLDRDRg'
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
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjZhZGNiMS01MmI2LTRjMjYtYTQ0YS03ODBkMWM0YzIyZGQiLCJpYXQiOjE3MjA2Mjg5MTMsImV4cCI6MTcyMDcxNTMxM30.0iczWCxwa34LqANuyDrEPTiXjL5V5s-KlzJRPLDRDRg'
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


