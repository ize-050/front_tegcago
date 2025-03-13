"use client";

import React from "react";
import TransferTableComponent from "@/components/hr/transfer/TableComponent";

const TransferPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-5 mt-5">
        <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        </div>
        <div className="intro-y">
          <TransferTableComponent />
        </div>
      </div>
    </>
  );
};

export default TransferPage;
