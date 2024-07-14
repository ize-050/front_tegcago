import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import { changeStatusToid, submitAddcustomer } from "@/services/customer";
import { setOpenToast } from "@/stores/util";
import { useAppDispatch } from "./hooks";
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  totalData:number
  ignore?: boolean;
}

export interface internalCustomer {
  customer: [];
  customer_detail:Partial<any>
  ModalCreate: boolean;
  formAddcustomer :boolean
  totalData :number
}

const initialState: internalCustomer = {
  customer: [],
  customer_detail:{},
  ModalCreate: false,
  formAddcustomer :false,
  totalData:0
};

export const updateCustomerStatus = createAsyncThunk(
  "customer/setStatus", // A unique identifier for this thunk
  async (action: any, { dispatch, getState }) => {
    try {
      console.log("action", action);
      const response: any = await changeStatusToid(action);
      if (response.status === 200) {
        await dispatch(setOpenToast(true));
        await dispatch(setOpenToast(false));
      } else {
      }
    } catch (error) {}
  }
);

export const submitFormAddcustomer = createAsyncThunk(
  "customer/submitFormAddcustomer", // A unique identifier for this thunk
  async (action: any, { dispatch, getState }:any) => {
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
        await  dispatch(setFormAddCustomer(false));
        await  dispatch(resetFormAddcustomer(true));
      
        //  await  dispatch(setOpenToast(false));
      } else {
        await dispatch(
          setOpenToast({
            type: "error",
            message: "กรุณาลองใหม่อีกครั้ง",
          })
        );

        await  dispatch(setFormAddCustomer(false));
      }
    } catch (error) {
      await dispatch(
        setOpenToast({
          type: "error",
          message: "กรุณาลองใหม่อีกครั้ง",
        })
      );

      await  dispatch(setFormAddCustomer(false));
    }
  }
);

export const customer = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerData: (state, action) => {
      state.customer = action.payload.users.customer;
      state.totalData  =  action.payload.users.total;
    },
    setFormAddCustomer: (state, action) => {
      state.ModalCreate = action.payload;
    },
    resetFormAddcustomer:(state,action) =>{
      state.formAddcustomer = action.payload;
    },
    setCustomerDetail:(state, action) => {
      state.customer_detail = action.payload;
    }
  },
});

export const customerData = (state: RootState) => state.customerRedurer;

export const { setCustomerData, setFormAddCustomer ,resetFormAddcustomer , setCustomerDetail } = customer.actions;

export default customer.reducer;
