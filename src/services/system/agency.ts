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

export const getDataAgentcy = async (page: number): Promise<IAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/agency/getDataAgency`;
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

export const createAgency = async (data:Partial<any>):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/agency/create`;
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

export const editAgency =async (data:Partial<any>,id:string):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/agency/edit/${id}`;
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


export const DeleteAgency =async (id:string):Promise<ICreateAgency> => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/system/agency/delete/${id}`;
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