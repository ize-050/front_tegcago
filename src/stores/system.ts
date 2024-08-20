import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";



export interface Internal {
    AgencyData :any[],
    CurrentPage: number,
    TotalPage:number,
    searchedVal?:string
    modal:Partial<any>,
    detail:Partial<any>
}



const initialState : Internal= {
    AgencyData:[],
    CurrentPage:1,
    TotalPage:1,
    searchedVal:"",
    detail:{},
    modal:{
        open:false,
        type:""
    },
};


export const systemReducer = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setAgencyData: (state, action) => {
      state.AgencyData = action.payload
    },
    setCurrentPage:(state,action) =>{
      state.CurrentPage = action.payload
    },
    setTotalPage:(state,action) =>{
       state.TotalPage = action.payload 
    },
    setSearchText: (state, action) => {
        state.searchedVal = action.payload;
    },
    setOpenModal:(state,action) =>{
        state.modal = action.payload
    },
    setDetail : (state, action) =>{
        state.detail = action.payload
    }

  },
});

export const systemData = (state: RootState) => state.systemReducer;

export const { setAgencyData,
    setCurrentPage,
    setTotalPage,
    setSearchText,
    setOpenModal,
    setDetail
 } = systemReducer.actions;

export default systemReducer.reducer;
