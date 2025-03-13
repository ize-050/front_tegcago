"use client";

import React from "react";
import CommissionRankSettings from "@/components/hr/settings/CommissionRankSettings";

const CommissionRanksPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่าอันดับค่าคอมมิชชั่น</h1>
      <CommissionRankSettings />
    </div>
  );
};

export default CommissionRanksPage;
