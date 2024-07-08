import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface CompactMenuState {
  value: boolean;
}
const getCompactMenu = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("compactMenu") === "true";
  }
  return true; // default value when localStorage is not available
};

const initialState: CompactMenuState = {
  value: typeof window !== "undefined" ? getCompactMenu() : true,
};

export const compactMenuSlice = createSlice({
  name: "compactMenu",
  initialState,
  reducers: {
    setCompactMenu: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCompactMenu } = compactMenuSlice.actions;

export const selectCompactMenu = (state: RootState) => {


  return state.compactMenu.value;
};

export default compactMenuSlice.reducer;
