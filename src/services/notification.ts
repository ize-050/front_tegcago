import axios from '../../axios';


export const GetNotification = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/notification/getNotification`;
        await axios
            .get(
                url,
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
};


export const ReadNotification = async (id :string) =>{
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/notification/updateNotification/${id}`;
        await axios
            .put(
                url,
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
    })
}

export const  ReadAllNotification = async () =>{
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.NEXT_PUBLIC_URL_API}/notification/ReadAllNotifications`;
        await axios
            .put(
                url,
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
    })
}