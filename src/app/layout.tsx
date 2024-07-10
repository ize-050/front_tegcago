"use client"
import type { Metadata } from "next";

import "./globals.css";
import store from '../stores/store';
import { Provider } from 'react-redux';

import Layout from '../components/Layouts/Layout'

import  ToastCompoent from "@/components/Layouts/toastComponents"

import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    {
      path: "./Athiti/Athiti-Regular.ttf",
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-athiti'
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${myFont.variable}`}>
      <Provider store={store}>
   
        <body className={"theme-16"}>
      
          
          <Layout >

            {children}
          </Layout>
          <ToastCompoent/>  


        </body>
      </Provider>

    </html>
  );
}
