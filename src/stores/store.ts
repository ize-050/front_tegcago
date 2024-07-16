"use client"
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import themeReducer from "./themeSlice";
import compactMenuReducer from "./compactMenuSlice";
import pageLoaderReducer from "./pageLoaderSlice";
import customerReducer from './customer';
import utilReducer from './util';
import purchaseRedurer from './purchase'

 const store = configureStore({
  reducer: {
    // darkMode: darkModeReducer,
    utilReducer:utilReducer,
    customerRedurer:customerReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    compactMenu: compactMenuReducer,
    pageLoader: pageLoaderReducer,
    purchaseRedurer:purchaseRedurer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
