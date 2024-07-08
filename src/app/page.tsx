"use client";
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
import { Transition } from "react-transition-group";
import Breadcrumb from "../components/Base/Breadcrumb";
import { useState, useEffect, createRef } from "react";
import { selectSideMenu } from "../stores/sideMenuSlice";
import {
  selectCompactMenu,
  setCompactMenu as setCompactMenuStore,
} from "../stores/compactMenuSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../components/Base/Lucide";

import clsx from "clsx";
import SimpleBar from "simplebar";
import { Menu, Popover } from "../components/Base/Headless";
import QuickSearch from "../components/QuickSearch";
import SwitchAccount from "../components/SwitchAccount";
import NotificationsPanel from "../components/NotificationsPanel";
import ActivitiesPanel from "../components/ActivitiesPanel";

import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";

import products from "../fakers/products";
import Button from "../components/Base/Button";
import { formatCurrency } from "@/utils/helper";
import Table from "../components/Base/Table";

import _ from "lodash";
function Main() {
  return (
    <>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-6 gap-4 items-center space-x-6  p-4">
        <div className="relative">
          <Lucide
            icon="Search"
            className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
          />
          <FormInput
            type="text"
            placeholder="Search products..."
            className="pl-9 sm:w-34 rounded-[0.5rem]"
          />
        </div>

        <div className="relative">
          <select
            id="status"
            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          >
            <option selected>Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <select
          id="tag"
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        >
          <option selected>Tag ติดตาม</option>
          <option value="tag1">Tag 1</option>
          <option value="tag2">Tag 2</option>
        </select>

        <select
          id="deliver"
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        >
          <option selected>ส่งมอบงาน</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="grid grid-cols-12 gap-y-10 gap-x-6">


        <div className="col-span-12">
          <div className="mt-1">
            <div className="flex flex-col box box--stacked">
              <div className="overflow-auto xl:overflow-visible">
                <Table className="border-b border-slate-200/60">
                  <Table.Thead>
                    <Table.Tr style={{
                      background:"#FAFAFA"
                    }}>
                  
                      <Table.Td className="py-4 font-medium border-t 0 border-slate-200/60 text-slate-500">
                        No
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t  border-slate-200/60 text-slate-500">
                        วันที่สร้าง
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t  border-slate-200/60 text-slate-500">
                        ชื่อบริษัท/ร้านค้า/เพจ
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t  border-slate-200/60 text-slate-500">
                        ชื่อลูกค้า
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t  border-slate-200/60 text-slate-500">
                        Status
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t  border-slate-200/60 text-slate-500">
                        Tag ติดตาม
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-slate-500">
                        เบอร์โทรศัพท์
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-slate-500">
                        Line ID
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-slate-500">
                        การติดต่อ
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-slate-500">
                        Website
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t   border-slate-200/60 text-slate-500">
                        ส่งมอบงาน
                      </Table.Td>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>

               
                  </Table.Tbody>
                </Table>
              </div>
              <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                  <Pagination.Link>
                    <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                  </Pagination.Link>
                  <Pagination.Link>
                    <Lucide icon="ChevronLeft" className="w-4 h-4" />
                  </Pagination.Link>
                  <Pagination.Link>...</Pagination.Link>
                  <Pagination.Link>1</Pagination.Link>
                  <Pagination.Link active>2</Pagination.Link>
                  <Pagination.Link>3</Pagination.Link>
                  <Pagination.Link>...</Pagination.Link>
                  <Pagination.Link>
                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                  </Pagination.Link>
                  <Pagination.Link>
                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                  </Pagination.Link>
                </Pagination>
                <FormSelect className="sm:w-20 rounded-[0.5rem]">
                  <option>10</option>
                  <option>25</option>
                  <option>35</option>
                  <option>50</option>
                </FormSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Main;
