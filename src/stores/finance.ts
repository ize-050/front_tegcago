import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";

export interface internalFinance {
 form :Partial<any>,
 purchaseFinanceDetail:any[],
 purchaseFinanceData:any
 formwithdrawal :any
 modalWithdrawal:boolean
 modalRecordMoney:boolean
 editRecord: {
   id: string | null;
   type: 'PAYMENT' | 'RECEIPT' | 'deposit' | 'payment' | 'other' | null;
   date?: string;
   invoiceNumber?: string;
   referenceNumber?: string;
   customerName?: string;
   productType?: string;
   productDetail?: string;
   amountRMB?: number;
   exchangeRate?: number;
   amountTHB?: number;
   transferFee?: number;
   exchangeRateFee?: number;
   totalAmountTHB?: number;
   transferDate?: string;
   transferSlipUrl?: string;
   recipientBank?: string;
   notes?: string;
 }
}

const initialState: internalFinance = {
 form :{
 },
 purchaseFinanceDetail:[],
 purchaseFinanceData:{},
 modalWithdrawal:false,
 modalRecordMoney:false,
 formwithdrawal :{
 },
 editRecord: {
   id: null,
   type: null
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
        },
        setModalRecordMoney(state, action: PayloadAction<boolean>) {
            state.modalRecordMoney = action.payload
        },
        setEditRecord(state, action: PayloadAction<any>) {
            state.editRecord = action.payload ? action.payload : {
                id: null,
                type: null
            };
        }
    }
})

export const financeData = (state: RootState) => state.financeReducer;

export const {
  setFormFinance,
  setPurchaseFinanceDetail,
  setPurchaseFinanceData,
  setModalWithdrawal,
  setFormWithdrawal,
  setModalRecordMoney,
  setEditRecord
  } = finance.actions;

export default finance.reducer;
