"use client";

import React, { useState } from "react";
import { Check, X, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import axios from "../../../../axios";
import Button from "@/components/Base/Button";
import { toast } from "react-toastify";

interface CommissionStatusButtonProps {
  commissionId: string;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

const CommissionStatusButton: React.FC<CommissionStatusButtonProps> = ({
  commissionId,
  currentStatus,
  onStatusUpdate
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Status options
  const statusOptions = [
    { value: "PENDING", label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
    { value: "APPROVED", label: "อนุมัติแล้ว", color: "bg-green-100 text-green-800" },
    { value: "PAID", label: "จ่ายแล้ว", color: "bg-blue-100 text-blue-800" }
  ];

  // Get current status display
  const getCurrentStatusDisplay = () => {
    const status = statusOptions.find(s => s.value === currentStatus);
    return status ? status.label : currentStatus;
  };

  // Get current status color
  const getCurrentStatusColor = () => {
    const status = statusOptions.find(s => s.value === currentStatus);
    return status ? status.color : "bg-gray-100 text-gray-800";
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      
      // Call API to update status
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer/commission/${commissionId}/status`,
        { status: newStatus }
      );
      
      if (response.data && response.data.success) {
        toast.success("อัปเดตสถานะสำเร็จ");
        onStatusUpdate(newStatus);
      } else {
        toast.error(response.data?.message || "ไม่สามารถอัปเดตสถานะได้");
      }
    } catch (error: any) {
      console.error("Error updating commission status:", error);
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${getCurrentStatusColor()}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        {getCurrentStatusDisplay()}
        <ChevronDown className="h-3 w-3 ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md border border-gray-200 py-1">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center ${
                status.value === currentStatus ? "font-medium" : ""
              }`}
              onClick={() => handleStatusChange(status.value)}
              disabled={loading}
            >
              {status.value === currentStatus && (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              )}
              <span className={status.value === currentStatus ? "ml-0" : "ml-6"}>
                {status.label}
              </span>
            </button>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
          <div className="animate-spin h-3 w-3 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default CommissionStatusButton;
