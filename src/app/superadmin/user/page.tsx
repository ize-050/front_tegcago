import React, { Fragment } from "react";

import { getUser } from "@/services/user";
import Button from "@/components/Base/Button";
import { ArrowUpFromLine, CirclePlus, FormInput } from "lucide-react";


//component
// import TableComponent from "@/components/Superadmin/user/TableComponent";

export default async function UserPage() {
  // const user = await getUser();

  // console.log("user", user);


  return (
    <Fragment>
      <nav aria-label="Breadcrumb" className="p-5">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a
              href="#"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span className="ml-1">Home</span>
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <a href="#" className="ml-1 text-gray-500 hover:text-gray-700">
                Projects
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-500">/</span>
              <span className="ml-1 text-gray-700">Marketing</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="lg:flex md:flex ">
        <div className="flex-1 p-5">
          <p className="text-black text-xl font-bold">ข้อมูลผู้ใช้งานทั้งหมด</p>
        </div>
        <div className="justify-end p-5">
          <Button
            className="border-blue-500 mr-5"
            style={{
              color: "#305D79",
            }}
          >
            <ArrowUpFromLine
              color="#305D79"
              className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
            ></ArrowUpFromLine>
            Upload file
          </Button>
          <Button
            className="text-white  border-blue-800"
            style={{
              background: "#273A6F",
            }}
          >
            <CirclePlus
              color="#ffffff"
              className="inset-y-0 bg-secondary-400  mr-1  justify-center m-auto   w-5 h-5  text-slate-500"
            ></CirclePlus>
            สร้างข้อมูลผู้ใช้งาน
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-5">
        <div
          className="bg-white rounded-lg"
          style={{
            border: "1px solid #D2D6E1",
          }}
        >
          <div className="grid grid-cols-6 gap-4 items-center space-x-6  p-4">
            <div className="relative"></div>

            <div className="relative"></div>
          </div>
          {/* <TableComponent user={user} /> */}
        </div>
      </div>
    </Fragment>
  );
}
