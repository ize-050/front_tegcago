import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import {
  changeStatusToid,
  submitAddcustomer,
  ChangeUpdateCustomer,
} from "@/services/customer";
import { setOpenToast } from "@/stores/util";
import { useAppDispatch } from "./hooks";
import {useRouter} from "next/navigation";
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  totalData: number;
  ignore?: boolean;
}

export interface internalCustomer {
  customer: [];
  customerGroup:any[];
  customer_detail: Partial<any>;
  ModalCreate: boolean;
  formAddcustomer: boolean;
  formEditcustomer:boolean;
  totalData: number;
}

const initialState: internalCustomer = {
  customer: [],
  customerGroup:[],
  customer_detail: {},
  ModalCreate: false,
  formAddcustomer: false,
  formEditcustomer: false,
  totalData: 0,
};

export const updateCustomerStatus = createAsyncThunk(
  "customer/setStatus", // A unique identifier for this thunk
  async (action: any, { dispatch, getState }) => {
    try {
      const response: any = await changeStatusToid(action);
      if (response.status === 200) {
        await dispatch(setOpenToast(true));
        await dispatch(setOpenToast(false));
      } else {
      }
    } catch (error) {
      throw error;
    }
  }
);

export const submitChangeUpdateCustomer = createAsyncThunk(
  "customer/submitChangeUpdateCustomer", // A unique identifier for this thunk
  async (action: any, { dispatch, getState }) => {
    try {
      const request: Partial<any> = {
        data: action,
        customer_id: action.id,
      };
      const response: any = await ChangeUpdateCustomer(action);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "บันทึกข้อมูลลูกค้าสำเร็จ",
          })
        );
        
      }
     
    } catch (error) {
      throw error;
    }
   
  }
);

export const submitFormAddcustomer = createAsyncThunk(
  "customer/submitFormAddcustomer", // A unique identifier for this thunk
  async (action: any, { dispatch, getState }: any) => {
    try {
      console.log("action", action);
      const response: any = await submitAddcustomer(action);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "สร้างข้อมูลลูกค้าสำเร็จ",
          })
        );
        await dispatch(setFormAddCustomer(false));
        await dispatch(resetFormAddcustomer(true));

        //  await  dispatch(setOpenToast(false));
      } else {
        await dispatch(
          setOpenToast({
            type: "error",
            message: "กรุณาลองใหม่อีกครั้ง",
          })
        );

        await dispatch(setFormAddCustomer(false));
      }
    } catch (error) {
      await dispatch(
        setOpenToast({
          type: "error",
          message: "กรุณาลองใหม่อีกครั้ง",
        })
      );

      await dispatch(setFormAddCustomer(false));
    }
  }
);

export const customer = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerData: (state, action) => {
      state.customer = action.payload.users.customer;
      state.totalData = action.payload.users.total;
    },
    setFormAddCustomer: (state, action) => {
      state.ModalCreate = action.payload;
    },
    resetFormAddcustomer: (state, action) => {
      state.formAddcustomer = action.payload;
    },
    setCustomerDetail: (state, action) => {
      state.customer_detail = action.payload;
    },
    setCustomerGroup: (state, action) => {
      state.customerGroup = action.payload
    },
    ChangeFormEdit:(state,action)=>{
      console.log('action',action)
      state.formEditcustomer = action.payload
    },
    resetStore: (state) => {

      state.customer = [];
      state.customer_detail = {};
      state.ModalCreate = false;
      state.formAddcustomer = false;
      state.formEditcustomer = false;
      state.totalData = 0;
    }
  },
});

export const customerData = (state: RootState) => state.customerRedurer;

export const {
  setCustomerGroup,
  setCustomerData,
  setFormAddCustomer,
  resetFormAddcustomer,
  setCustomerDetail,
  ChangeFormEdit,
  resetStore
} = customer.actions;

export default customer.reducer;
