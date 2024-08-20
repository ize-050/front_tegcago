"use client"
import axios from '../../axios';



export const RequestFileTocs = async(data:any)=>{
    console.log("dateRequest11",data);
    return new Promise(async(resolve,reject) =>{
        const url = `${process.env.NEXT_PUBLIC_URL_API}/sale/updateDocument/${data.purchase_id}`;
        const formData = new FormData();
        delete data.purchase_id
        Object.keys(data).forEach((key) => {
                console.log("key",data[key])
               for (let i = 0; i < data[key].length; i++) {
                formData.append(`${key}`, data[key][i].originalFile);
               }
          });
        // if (data.files && data.files.length > 0) {
        //     console.log('dadada')
        //     data.files.forEach((image:any) => {
        //         if (image.status === 'added' || image.status === 'edited') {
        //           formData.append('d_image', image.originalFile, image.name);
        //         } else if (image.status === 'unchanged' && image.id) { 
        //           formData.append('existingImageIds[]', image.id.toString());
        //         }
        //       });
        //   }
        //  delete data.files
        // for (const key in data) {
        //     formData.append(key, data[key]);
        // }
        await axios.put(url,
            formData,   
            {
            headers: {
                Accept: 'multipart/formdata'
                
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


