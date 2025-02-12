import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";

export interface internalFinance {
 form :Partial<any>,
 purchaseFinanceDetail:any[],
 purchaseFinanceData:any
}

const initialState: internalFinance = {
 form :{
 },
 purchaseFinanceDetail:[],
 purchaseFinanceData:{}

};


export const finance = createSlice({
    name: "finance",
    initialState,
    reducers: {
        setFormFinance(state, action: PayloadAction<Partial<any>>) {
            state.form = {
                ...state.form,
                ...action.payload
            }
        },
        setPurchaseFinanceDetail(state, action: PayloadAction<any[]>) {
            state.purchaseFinanceDetail = action.payload
        },
        setPurchaseFinanceData(state, action: any) {  
            state.purchaseFinanceData = action.payload
        }
    }
})

export const financeData = (state: RootState) => state.financeReducer;

export const {
  setFormFinance,
  setPurchaseFinanceDetail,
  setPurchaseFinanceData
  } = finance.actions;

export default finance.reducer;
