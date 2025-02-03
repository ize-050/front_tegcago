import axios from "axios";

export const getEmployee = async () => {
 
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee`)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
 
};
