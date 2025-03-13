"use client";

import React from "react";
import TransferTypesSettings from "@/components/hr/settings/TransferTypesSettings";

const TransferTypesPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-5 mt-5">
        <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
          <h2 className="text-lg font-medium mr-auto">ตั้งค่าประเภทฝากสั่งฝากโอน</h2>
        </div>
        <div className="intro-y">
          <TransferTypesSettings />
        </div>
      </div>
    </>
  );
};

export default TransferTypesPage;
