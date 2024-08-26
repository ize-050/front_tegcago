import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";


//interface
import { tab, TabStatus } from "@/utils/statusOrder"

//service
import { serviceCreateBookcabinet ,serviceCreateReceive ,serviceCreateContain } from "@/services/statusOrder"


interface TapPurchase {
    tabStaus: TabStatus[];
    tab:any
    status :Partial<any>
    dataCspurchase: any[];
}

const initialState: TapPurchase = {
    tabStaus: tab,
    tab:{},
    status:{
       
    },
    dataCspurchase:[],
};

export const createBookcabinet = createAsyncThunk(
    "cs_purchase/createBookcabinet",
    async (action: any, { dispatch, getState }) => {
        try {
            let dataRequest = action;
            const response: any = await serviceCreateBookcabinet(dataRequest);
            return response;
        } catch (error) {
            throw error;
        }

    }
);

export const createReceive = createAsyncThunk(
    "cs_purchase/createReceive",
    async (action: any, { dispatch, getState }) => {
        try {
            let dataRequest = action;
            const response: any = await serviceCreateReceive(dataRequest);
            return response;
        } catch (error) {
            throw error;
        }

    }
);

export const createContain= createAsyncThunk(
    "cs_purchase/createContainer",
    async (action: any, { dispatch, getState }) => {
        try {
            let dataRequest = action;
            const response: any = await serviceCreateContain(dataRequest);
            return response;
        } catch (error) {
            throw error;
        }
    }
);





export const statusOrderReducer = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setStoreTabActive: (state, action: PayloadAction<any>) => {
            state.tabStaus = state.tabStaus.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        active: true
                    }
                } else {
                    return {
                        ...item,
                        active: false
                    }
                }
            })
            state.tab ={
                ...state.tab,
                ...action.payload
            }
        },
        setForm: (state, action: PayloadAction<any>) => {
            console.log("action.payload", action.payload)
            state.status = {
                ...action.payload
            }
        },
        setEditForm: (state, action: PayloadAction<string>) => {
           
            state.status = {
                ...state.status,
                type: action.payload
            }
        },
        setDataAll: (state, action: PayloadAction<any>) => {
            state.dataCspurchase = action.payload
        }
    },
});

export const statusOrderData = (state: RootState) => state.statusOrderReducer;

export const {
    setStoreTabActive,
    setEditForm,
    setDataAll,
    setForm
} = statusOrderReducer.actions;

export default statusOrderReducer.reducer;
