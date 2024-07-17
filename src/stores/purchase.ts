import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import {
    sentPrepurchase
} from "@/services/purchase";
import { setOpenToast } from "@/stores/util";
import { useAppDispatch } from "./hooks";
import {useRouter} from "next/navigation";



export interface internalCustomer {
    purchase: Partial<any>;
    modalImage :boolean;
}

const initialState: internalCustomer = {
    purchase:{},
    modalImage:false
};

export const submitPrePurchase = createAsyncThunk(
    "purchase/submitPrePurchase", // A unique identifier for this thunk
    async (action: any, { dispatch, getState }) => {
      try {
        const request: Partial<any> = {
          data: action,
          customer_id: action.customer_id,
        };
        const response: any = await sentPrepurchase(action);
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


export const purchase = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setPurchaseData: (state, action) => {
        state.purchase = action.payload
    },
    resetStore: (state) => {

    },
    setModalImage: (state, action) => {
        state.modalImage = action.payload
    },
  },
});

export const purchaseData = (state: RootState) => state.purchaseRedurer;

export const {
  setPurchaseData,
  setModalImage
  } = purchase.actions;

export default purchase.reducer;
