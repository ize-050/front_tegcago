import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import {
    RequestFileTocs
} from "@/services/document";
import { setOpenToast } from "@/stores/util";
import { useAppDispatch } from "./hooks";
import { useRouter } from "next/navigation";
import { set } from "lodash";



export interface internalCustomer {
    document: any[];
    modalWatchDocument?: boolean;
}

const initialState: internalCustomer = {
    document: [],
    modalWatchDocument: false,
};




export const sentrequestFile = createAsyncThunk(
    "purchase/documentRequestfile",
    async (action: any, { dispatch, getState }) => {
        try {
            let dataRequest = action;
            console.log("dataRequest",dataRequest);
            const response: any = await RequestFileTocs(dataRequest);
            if (response.status === 200) {
                await dispatch(
                    setOpenToast({
                        type: "success",
                        message: "ส่งเอกสำเร็จ",
                    })
                );
                return response
            }

            return true;
        } catch (error) {
            throw error;
        }

    }
);






export const document = createSlice({
    name: "document",
    initialState,
    reducers: {
        setRequestFile: (state, action) => {
            state.document = action.payload;
        },
        setModalWatchDocument: (state, action) => {
            state.modalWatchDocument = action.payload;
        }

    },
});

export const documentData = (state: RootState) => state.documentReducer;

export const {
    setRequestFile,
    setModalWatchDocument
    
} = document.actions;

export default document.reducer;
