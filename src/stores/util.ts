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
    toastData: boolean;
    data:Partial<any>
}

const initialState : toast= {
   toastData:false,
  data :{}
};


export const utilStore = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setOpenToast: (state, action) => {
        console.log('acasd',action.payload);
      state.toastData = action.payload
    },
   
  },
});

export const utilData = (state: RootState) => state.utilReducer;

export const { setOpenToast } = utilStore.actions;

export default utilStore.reducer;
