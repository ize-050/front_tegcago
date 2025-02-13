import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menuSale: Array<Menu | string>;
  menuCs: Array<Menu | string>;
  menuSuperadmin: Array<Menu | string>;
  menuFinance: Array<Menu | string>;
}

const initialState: SideMenuState = {
  menuSale: [
    {
      icon: "Home",
      pathname: "/",
      title: "Dashboard",
    },
    {
      icon: "Users",
      pathname: "/customer",
      title: "ข้อมูลลูกค้าทั้งหมด",
    },
    {
      icon: "Book",
      pathname: "/purchase",
      title: "ข้อมูลรายการจอง",
    },
    {
      icon: "User",
      pathname: "/in_customer",
      title: "ข้อมูลลูกค้าที่ดูแล",
    },
    {
      icon: "Proportions",
      pathname: "/report",
      title: "รายงาน",
    },
  ],
  menuCs: [
    {
      icon: "Home",
      pathname: "/",
      title: "Dashboard",
    },
    {
      icon: "Book",
      pathname: "/cs/purchase",
      title: "รายการจาก Sale",
    },
    {
      icon: "Book",
      pathname: "/cs/allcs",
      title: "รายการสถานะการขนส่ง",
    },
  ],
  menuSuperadmin: [
    {
      icon: "Users",
      pathname: "/superadmin/user",
      title: "ข้อมูลพนักงาน",
    },
    {
      icon: "Proportions",
      pathname: "/report",
      title: "การจัดการทั่วไป",
      subMenu:[
        {
          icon: "Proportions",
          pathname: "/cs/system/dataagency",
          title: "จัดการข้อมูลAgency",
        },
        {
          icon: "Proportions",
          pathname: "/cs/system/datadocument",
          title: "จัดการประเภทนำเข้าเอกสาร",
        },
        {
          icon: "Proportions",
          pathname: "/cs/system/dataCurrency",
          title: "จัดการสกุลเงิน",
        },
      ]
    },
  ],
  menuFinance:[
    {
      icon: "Users",
      pathname: "/finance/work",
      title: "ข้อมูลงานบัญชี",
    },
     {
      icon: "Proportions",
      pathname: "/finance/data",
      title: "ข้อมูลงานบัญชี",
      subMenu:[
        {
          icon: "Proportions",
          pathname: "/finance/data/payment1",
          title: "บันทึกข้อมูลการเบิกเงินแผนกชิป",
        },
        {
          icon: "Proportions",
          pathname: "/finance/data/paymen2",
          title: "บันทึกข้อมูลการโอนเงิน",
        },
        {
          icon: "Proportions",
          pathname: "/cs/system/payme3",
          title: "บันทึกข้อมูลรายจ่ายฝั่งจีน",
        },
      ]
    },
  ]
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu;

export default sideMenuSlice.reducer;
