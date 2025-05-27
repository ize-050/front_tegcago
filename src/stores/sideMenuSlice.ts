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
  menuHr: Array<Menu | string>;
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
          pathname: "/finance/data/withdrawal_information",
          title: "บันทึกการเบิกเงินShipping",
        },
        {
          icon: "Proportions",
          pathname: "/finance/data/record_money",
          title: "บันทึกข้อมูลฝากสั่งและชำระ",
        },
        {
          icon: "Proportions",
          pathname: "/finance/data/record_chinese",
          title: "บันทึกรับ-จ่ายฝั่งจีน คาร์โก้",
        },
      ]
    },
    {
      icon: "Pencil",
      pathname: "/finance/setting",
      title: "ตั้งค่า",
      subMenu:[
        {
          icon: "Pencil",
          pathname: "/finance/setting/finance_company",
          title: "ตั้งค่าบัญชีผู้รับเงิน",
        },
        {
          icon: "Pencil",
          pathname: "/finance/setting/finance_customer",
          title: "ตั้งค่าบัญชี",
        },
      ]
    },
  ],
  menuHr:[
    {
      icon: "Earth",
      pathname: "/hr/dashboard",
      title: "แดชบอร์ด",
    },
    {
      icon: "Users",
      pathname: "/hr/work",
      title: "ข้อมูลงานจองตู้",
    },
    {
      icon: "SendToBack",
      pathname: "/hr/transfer",
      title: "ข้อมูลฝากสั่งฝากโอน",
    },
    {
      icon: "Settings",
      pathname: "/hr/settings",
      title: "ตั้งค่า",
      subMenu: [
        {
          icon: "BarChart",
          pathname: "/hr/settings/commission-ranks",
          title: "ตั้งค่าอัตราคอมมิชชั่น",
        },
        {
          icon: "Users",
          pathname: "/hr/settings/commission-roles",
          title: "ตั้งค่าคอมมิชชั่นตามบทบาท",
        },
        {
          icon: "Repeat",
          pathname: "/hr/settings/transfer-types",
          title: "ตั้งค่าประเภทฝากสั่งฝากโอน",
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
