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
      icon: "Boxes",
      pathname: "/allcustomer",
      title: "ลูกค้าในระบบ",
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
      pathname: "/AllCs",
      title: "รายการสถานะการขนส่ง",
    },
    {
      icon: "Boxes",
      pathname: "/allcustomer",
      title: "ข้อมูลลูกค้า",
    },
    {
      icon: "Proportions",
      pathname: "/report",
      title: "การจัดการทั่วไป",
    },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu;

export default sideMenuSlice.reducer;
