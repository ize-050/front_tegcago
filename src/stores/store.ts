"use client"
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
// import themeReducer from "./themeSlice";
import compactMenuReducer from "./compactMenuSlice";
import pageLoaderReducer from "./pageLoaderSlice";
import customerReducer from './customer';
import utilReducer from './util';
import purchaseRedurer from './purchase'
import documentReducer from './document'
import systemReducer from './system';
import statusOrderReducer from './statusOrder'

 const store = configureStore({
  reducer: {
    // darkMode: darkModeReducer,
    utilReducer:utilReducer,
    customerRedurer:customerReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    compactMenu: compactMenuReducer,
    pageLoader: pageLoaderReducer,
    purchaseRedurer:purchaseRedurer,
    documentReducer:documentReducer,
    systemReducer:systemReducer,
    statusOrderReducer:statusOrderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
