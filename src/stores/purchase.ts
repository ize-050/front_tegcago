import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { icons } from "@/components/Base/Lucide";
import {
  sentPrepurchase,
  sendSubmitAddAgency,
  UpdateAgencytoSale,
  SentRequestFile,
  sentEditPrepurchase,
  Submitaddpayment
} from "@/services/purchase";
import { setOpenToast } from "@/stores/util";
import { useAppDispatch } from "./hooks";
import {useRouter} from "next/navigation";
import { set } from "lodash";




export interface internalCustomer {
    purchase: Partial<any>;
    modalImage :boolean;
    purchaseAll : any[];
    totalData: number;
    modelAdddo: boolean;
    modalDocument:boolean;
    modalAgentcy:boolean;
    modalUploadpurchase:boolean;
    modalViewAgentCy:boolean,
    formEditPrepurchase:boolean;
    agentcy:any[]
    document:any[];
    modalEditAgentCy:boolean,
    AgentCyDetail:Partial<any>
}

const initialState: internalCustomer = {
    purchaseAll:[],
    purchase:{},
    modalImage:false,
    modalDocument:false,
    totalData:0,
    modelAdddo: false,
    modalUploadpurchase:false,
    modalViewAgentCy:false,
    modalAgentcy:false,
    agentcy:[],
    modalEditAgentCy:false,
    document:[],
    formEditPrepurchase:false,
    AgentCyDetail:{}
};


export const submitAddpayment = createAsyncThunk(
  "purchase/submitAddpayment",
  async (action: any, { dispatch, getState }) => {
    try {
      const data = action;
      console.log('dataaction',action)
      const response: any = await Submitaddpayment(data);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "บันทึกข้อมูลสำเร็จ",
          })
        )
      
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }

    } catch (error) {
      throw error;
    }

  }
);



export const sentrequestFile = createAsyncThunk(
  "purchase/sentrequestFile",
  async (action: any, { dispatch, getState }) => {
    try {
      let dataRequest = action;

      let purchase_id = dataRequest.d_purchase_id;
      
      delete dataRequest.d_purchase_id;

      console.log('purchase_id',purchase_id)

      const response: any = await SentRequestFile(purchase_id, dataRequest);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "ส่งคำร้องเอกสารสำเร็จ",
          })
        );
        return response
      }
    } catch (error) {
      throw error;
    }

  }
);

export const updateAgencytoSale = createAsyncThunk(
  "purchase/updateAgencytoSale",
  async (action: any, { dispatch, getState }) => {
    try {
      const response: any = await UpdateAgencytoSale(action);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "ส่งเอกสารให้ Sale สำเร็จ",
          })
        );

      }

    } catch (error) {
      throw error;
    }

  }
);


export const setSubmitAddAgency = createAsyncThunk(
  "purchase/setSubmitAddAgency",
  async (action: any, { dispatch, getState }) => {
    try {
      const data = action;
      console.log('dataaction',action)
      const response: any = await sendSubmitAddAgency(data);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "บันทึกข้อมูลสำเร็จ",
          })
        );

      }

    } catch (error) {
      throw error;
    }

  }
);


export const  submitEditPrePurchase = createAsyncThunk(
  "purchase/submitEditPrePurchase",
  async (action: any, { dispatch, getState }) => {
    try {
      const response: any = await sentEditPrepurchase(action);
      if (response.status === 200) {
        await dispatch(
          setOpenToast({
            type: "success",
            message: "บันทึกข้อมูลสำเร็จ",
          })
        );
        return response
      }
    } catch (error) {
      throw error;
    }

  });

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
              message: "บันทึกข้อมูลสำเร็จ",
            })
          );

          return response;
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
    setAllPurchase: (state, action) => {
      state.purchaseAll = action.payload.purchase;
      state.totalData = action.payload.total;
    },
    setPurchaseData: (state, action) => {
        state.purchase = action.payload
    },
    changeFormeditPurchase: (state, action) => {
      state.formEditPrepurchase = action.payload;
    },
    resetStore: (state) => {
    },
    setModalImage: (state, action) => {
        state.modalImage = action.payload
    },
    setModalAdddo: (state, action) => { //modal cs เพิ่มไฟลมา
        state.modelAdddo = action.payload
    },
    openModaldocument: (state, action) => { //modal sale เพิ่มไฟลมา
        state.modalDocument = action.payload
    },
    setDocument: (state, action) => {
        state.document = action.payload
    },
    setModalAgentcy: (state, action) => {
        state.modalAgentcy = action.payload
    },
    setAgentcy:(state, action) => {
        state.agentcy = action.payload
    },
    setModalViewAgentCy:(state, action) => {
        state.modalViewAgentCy = action.payload
    },
    setAgentCyDetail:(state, action) => {
        state.AgentCyDetail = action.payload
    },
    setModalUploadPurchase:(state, action) => {
      state.modalUploadpurchase = action.payload
    },
    setModalEditAgentCy:(state, action) => {
      state.modalEditAgentCy = action.payload
    }
  },
});

export const purchaseData = (state: RootState) => state.purchaseRedurer;

export const {
  setAllPurchase,
  setPurchaseData,
  changeFormeditPurchase,
  setModalImage,
  setModalAdddo,
  openModaldocument,
  setDocument,
  setModalAgentcy,
  setModalViewAgentCy,
  setAgentcy,
  setAgentCyDetail,
  setModalUploadPurchase,
  setModalEditAgentCy
  } = purchase.actions;

export default purchase.reducer;
