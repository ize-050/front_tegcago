import axios from "axios";

export const getUser = async () => {
    return new Promise((resolve, reject) => {   
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            reject(err);
        });
    });
}


export const getUserById = async (id: string) => {
    return new Promise((resolve, reject) => {   
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            reject(err);
        });
    });
}



export const createUser = async (data: any) => {
    return new Promise((resolve, reject) => {   
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, data)
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            reject(err);
        });
    });
}


export const updateUser = async (id: string, data: any) => {
    return new Promise((resolve, reject) => {   
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, data)
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

