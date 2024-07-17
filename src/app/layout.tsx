"use client"
import type { Metadata } from "next";

import "./globals.css";
import store from '../stores/store';
import { Provider } from 'react-redux';

import Layout from '../components/Layouts/Layout'
import { usePathname,redirect,useRouter } from 'next/navigation';
import ToastCompoent from "@/components/Layouts/toastComponents"
import localFont from 'next/font/local';
import { useEffect ,Suspense} from "react";
import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import  NextAuthProvider from "./session"
import ProgressBar from "./ProgressBar";

import Loading from "./loading";

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
  const pathname = usePathname();

  const router = useRouter()


 
  const isLoginPage = pathname === '/login';
  return (
    <NextAuthProvider>
    <html lang="en" className={`${myFont.variable}`}>
      <Provider store={store}>
     
    
        <body className={"theme-16"}>
        <ProgressBar />
          {!isLoginPage && (
            <>
            
              <Layout >
                {children}
              </Layout>

           
            </>
          )}
          {isLoginPage &&(
            <>
              {children}
            </>
          )}
         
          <ToastCompoent />
        </body>
     
      </Provider>
    </html>
    </NextAuthProvider>
  );
}
