"use client"
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3000/api', // Default to localhost if env var not set
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let session: Partial<any> | null;
    session = await getSession();
    if (session) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: any): AxiosResponse {
    if (response.status === 200) {
      if (response.data?.message == "Token Revoked") {
        //    toast.error(
        //         response?.message
        //            ? response.message
        //            : "ระบบเกิดข้อผิดพลาด กรุณาLoginใหม่อีกครั้ง",
        //        {
        //            position: "top-right",
        //            autoClose: 2000,
        //            hideProgressBar: false,
        //            closeOnClick: false,
        //            pauseOnHover: true,
        //            draggable: false,
        //            progress: undefined,
        //        }
        //    );
        // setTimeout(() => {
        // //   signOut({ callbackUrl: "/login" });
        // }, 2000);
      }
    }
    if (response.status == 500) {
      //   toast.error(
      //     response?.message
      //       ? response.message
      //       : "ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      //     {
      //       position: "top-right",
      //       autoClose: 3000,
      //       hideProgressBar: false,
      //       closeOnClick: false,
      //       pauseOnHover: true,
      //       draggable: false,
      //       progress: undefined,
      //     }
      //   );
    //   signOut({ callbackUrl: "/login" });
    }

    if (response.status == 401) {
        toast.error(
          response?.message
            ? response.message
            : "ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          }
        );
      signOut({ callbackUrl: "/login" });
    }

    if (response.status == 400) {
      console.log("test response.status", response.status);
    }

    return response;
  },
  error => {
    console.log("error222222", error);
    if (error.response?.status === 401) {
      toast.error(
        error.response?.message
          ? error.response.message
          : "ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        }
      );
    signOut({ callbackUrl: "/login" });
    } else {
      //   toast.error("ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      //     {
      //       position: "top-right",
      //       autoClose: 3000,
      //       hideProgressBar: false,
      //       closeOnClick: false,
      //       pauseOnHover: true,
      //       draggable: false,
      //       progress: undefined,
      //     }
      //   );
      if (error.response.status !== 400) {
        // signOut({ callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
