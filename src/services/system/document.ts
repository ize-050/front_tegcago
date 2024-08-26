import axios from '../../../axios';

interface IAgency {
    data:any[],
    TotalPage:number
}


interface ICreateAgency {
    message:string,
    statusCode:number
}

interface IdeleteeAgency {
    message:string,
    statusCode:number
}

export const getDataDocument = async (page: number): Promise<IAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/document/getDocument`;
        await axios
            .get<IAgency>(
                url,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    params: {
                        page: page
                    }
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const createCurrency = async (data:Partial<any>):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/currency/create`;
        await axios
            .post<ICreateAgency>(
                url,
                data,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const editCurrency =async (data:Partial<any>,id:string):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/currency/edit/${id}`;
        await axios
            .put<ICreateAgency>(
                url,
                data,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}


export const DeleteCurrency =async (id:string):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/currency/delete/${id}`;
        await axios
            .delete<IdeleteeAgency>(
                url,
                {
                    headers: {
                        Accept: "application/json",
                    }
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });

}