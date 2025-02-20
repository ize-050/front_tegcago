import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";

export interface internalFinance {
 form :Partial<any>,
 purchaseFinanceDetail:any[],
 purchaseFinanceData:any
 formwithdrawal :any
 modalWithdrawal:boolean
}

const initialState: internalFinance = {
 form :{
 },
 purchaseFinanceDetail:[],
 purchaseFinanceData:{},
 modalWithdrawal:false,
 formwithdrawal :{
 }
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
        },
       setModalWithdrawal(state, action: PayloadAction<boolean>) {
            state.modalWithdrawal = action.payload
        },
        setFormWithdrawal(state, action: PayloadAction<any>) {
            state.formwithdrawal = {
                ...state.formwithdrawal,
                ...action.payload
            }
        }
    }
})

export const financeData = (state: RootState) => state.financeReducer;

export const {
  setFormFinance,
  setPurchaseFinanceDetail,
  setPurchaseFinanceData,
  setModalWithdrawal,
  setFormWithdrawal
  } = finance.actions;

export default finance.reducer;
