import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";
import {changeStatusToid} from  '@/services/customer'
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface toast {
    toastData: Partial<any>;
    data:Partial<any>;
    tab: string;
}

const initialState : toast= {
   toastData:{
    type :'',
    message :'',
   },
   data :{},
   tab: '',
};


export const utilStore = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setOpenToast: (state, action) => {
      state.toastData = action.payload
    },
    setActiveTab: (state, action) => {
      state.tab = action.payload
    }
   
  },
});

export const utilData = (state: RootState) => state.utilReducer;

export const { setOpenToast ,setActiveTab } = utilStore.actions;

export default utilStore.reducer;
