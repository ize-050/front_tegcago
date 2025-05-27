import React from "react";
import RoleCommissionSettings from "@/components/hr/settings/RoleCommissionSettings";

const CommissionRolesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่าเปอร์เซ็นต์ค่าคอมมิชชั่นตามบทบาท</h1>
      <RoleCommissionSettings />
    </div>
  );
};

export default CommissionRolesPage;
