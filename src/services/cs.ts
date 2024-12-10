
import axios from '../../axios';

export const getAllcs = async (currentPage: number, status: string, tag: string) => {
    return new Promise(async (resolve, reject) => {

        const url = `${process.env.NEXT_PUBLIC_URL_API}/cs/getAllCs`;

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
