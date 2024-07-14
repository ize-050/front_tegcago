import axios from "axios";

interface Login {
  email: string;
  password: string;
}

export const LoginService = async (request: Login) => {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API}/user/login`;

    await axios
      .post(
        url,
        {
          email:request.email,
          password:request.password
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
