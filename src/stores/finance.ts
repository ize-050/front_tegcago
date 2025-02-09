import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";

export interface internalFinance {
 form :Partial<any>
}

const initialState: internalFinance = {
 form :{

 },
 
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
        }
    }
})

export const financeData = (state: RootState) => state.financeReducer;

export const {
  setFormFinance,
  } = finance.actions;

export default finance.reducer;
