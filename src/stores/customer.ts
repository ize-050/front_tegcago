import { createSlice,PayloadAction,createAsyncThunk} from "@reduxjs/toolkit";
import { RootState,AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import {changeStatusToid} from  '@/services/customer'
import {setOpenToast} from '@/stores/util'
import  {useAppDispatch} from './hooks';
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface internalCustomer {
    customer: [];
}

const initialState : internalCustomer= {
  customer:[],
};

export const updateCustomerStatus = createAsyncThunk(
  'customer/setStatus', // A unique identifier for this thunk
  async (action:any, { dispatch, getState }) => {
    try {
      console.log('action',action)
      const response :any = await changeStatusToid(action);
      if (response.status === 200) {
       await  dispatch(setOpenToast(true));
       await  dispatch(setOpenToast(false));
      } else {
      }
    } catch (error) {
    }
  }
);


export const customer = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerData: (state, action) => {
      state.customer = action.payload.users;
    },
    // setStatus :(state,action) =>{
    //    changeStatusToid(action.payload).then((res:any)=>{
    //       // if(res.status ==200){
    //         const dispatch: AppDispatch = useAppDispatch(); 
    //         dispatch(setOpenToast(true));
    //       // }
    //    })
    // }
  },
});

export const customerData = (state: RootState) => state.customerRedurer;

export const { setCustomerData } = customer.actions;

export default customer.reducer;
