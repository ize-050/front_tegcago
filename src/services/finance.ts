
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
