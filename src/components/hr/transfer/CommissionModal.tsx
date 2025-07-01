"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import axios from "../../../../axios";

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: string;
  transferType: string;
  salespersonId: string | null;
}

interface TransferType {
  id: string;
  type_name: string;
  commission_rate: number;
  is_active: boolean;
}

const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  onClose,
  transferId,
  transferType,
  salespersonId
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transferTypeData, setTransferTypeData] = useState<TransferType | null>(null);
  const [commission, setCommission] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [existingCommission, setExistingCommission] = useState<any>(null);

  // Fetch transfer type data and check for existing commission
  useEffect(() => {
    if (isOpen && transferId) {
      fetchTransferTypeData();
      checkExistingCommission();
    }
  }, [isOpen, transferType, transferId]);

  const checkExistingCommission = async () => {
    try {
      setLoading(true);
      
      // Check if commission already exists for this transfer
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/${transferId}`
      );
      
      if (response.data && response.data.success && response.data.data) {
        setExistingCommission(response.data.data);
        setCommission(response.data.data.amount);
        setError("ค่าคอมมิชชั่นได้ถูกบันทึกไปแล้ว คุณสามารถแก้ไขได้");
      } else {
        setExistingCommission(null);
      }
    } catch (error) {
      console.error("Error checking existing commission:", error);
      setExistingCommission(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransferTypeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert transferType to the appropriate value for API
      let typeValue = "";
      if (transferType === "ฝากโอน") {
        typeValue = "DEPOSIT";
      } else if (transferType === "ฝากสั่ง") {
        typeValue = "PURCHASE";
      } else if (transferType === "ฝากเติม") {
        typeValue = "TOPUP";
      } else {
        typeValue = transferType;
      }
      
      // Fetch transfer type settings
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types`
      );
      
      if (response.data && response.data.success) {
        // Find the matching transfer type
        const types = response.data.data;
        const matchingType = types.find((type: TransferType) => {
          // Match by type name
          if (typeValue === "DEPOSIT" && type.type_name.includes("ฝากโอน")) {
            return true;
          } else if (typeValue === "PURCHASE" && type.type_name.includes("ฝากสั่ง")) {
            return true;
          } else if (typeValue === "TOPUP" && type.type_name.includes("ฝากเติม")) {
            return true;
          }
          return false;
        });
        
        if (matchingType) {
          setTransferTypeData(matchingType);
          // Set commission based on the commission rate if no existing commission
          if (!existingCommission) {
            setCommission(matchingType.commission_rate);
          }
        } else {
          if (!existingCommission) {
            setError("ไม่พบข้อมูลประเภทการฝากสั่งฝากโอน");
          }
        }
      } else {
        if (!existingCommission) {
          setError("ไม่สามารถดึงข้อมูลประเภทการฝากสั่งฝากโอนได้");
        }
      }
    } catch (error) {
      console.error("Error fetching transfer type data:", error);
      if (!existingCommission) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle commission input change
  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCommission(parseFloat(value) || 0);
  };

  // Save commission
  const handleSaveCommission = async () => {
    if (!salespersonId) {
      setError("ไม่พบข้อมูลพนักงานขาย");
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Call API to save commission
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission`,
        {
          transferId,
          salespersonId,
          commission
        }
      );
      
      if (response.data && response.data.success) {
        const actionText = existingCommission ? "อัปเดต" : "บันทึก";
        setSuccess(`${actionText}ค่าคอมมิชชั่นสำเร็จ`);
        
        // Update existing commission data
        setExistingCommission(response.data.data);
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || "ไม่สามารถบันทึกค่าคอมมิชชั่นได้");
      }
    } catch (error: any) {
      console.error("Error saving commission:", error);
      setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">คำนวณค่าคอมมิชชั่น</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {success && (
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-600">{success}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทการฝากสั่งฝากโอน
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    {transferType || "-"}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อัตราค่าคอมมิชชั่น
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    {transferTypeData ? formatCurrency(transferTypeData.commission_rate) : "-"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    อัตราค่าคอมมิชชั่นตามประเภทที่ตั้งค่าไว้
                  </p>
                </div>
                
                {existingCommission && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      สถานะค่าคอมมิชชั่น
                    </label>
                    <div className={`p-2 rounded border ${
                      existingCommission.status === "PENDING" 
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800" 
                        : existingCommission.status === "APPROVED" 
                        ? "bg-green-50 border-green-200 text-green-800"
                        : existingCommission.status === "PAID"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      {existingCommission.status === "PENDING" ? "รอดำเนินการ" :
                       existingCommission.status === "APPROVED" ? "อนุมัติแล้ว" :
                       existingCommission.status === "PAID" ? "จ่ายแล้ว" : 
                       existingCommission.status}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ค่าคอมมิชชั่น
                  </label>
                  <FormInput
                    type="text"
                    value={commission.toString()}
                    onChange={handleCommissionChange}
                    className="w-full"
                    disabled={existingCommission && existingCommission.status !== "PENDING"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ค่าคอมมิชชั่นที่จะบันทึก (บาท)
                    {existingCommission && existingCommission.status !== "PENDING" && 
                     " - ไม่สามารถแก้ไขได้เนื่องจากสถานะไม่ใช่ 'รอดำเนินการ'"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-4 border-t space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCommission}
            disabled={loading || saving || (existingCommission && existingCommission.status !== "PENDING")}
            className="flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังบันทึก...
              </>
            ) : existingCommission ? (
              "อัปเดตค่าคอมมิชชั่น"
            ) : (
              "บันทึกค่าคอมมิชชั่น"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommissionModal;
