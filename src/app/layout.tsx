"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import store from '../stores/store';
import { Provider } from 'react-redux';

import Layout from '../components/Layouts/Layout'

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        
      <body className={"theme-16"}>
        
        <Layout >
        {children}
        </Layout>

        
        
        </body>
      </Provider>

    </html>
  );
}
