"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Base/Button";
import { X, Save, Loader2, DollarSign } from "lucide-react";
import axios from '../../../../axios';
import { toast } from "react-toastify";

interface Commission {
  id: string;
  transfer_id: string;
  employee_id: string;
  amount: number;
  status: string;
  employee?: {
    id: string;
    fullname: string;
    email: string;
  };
}

interface EditCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  commissionId: string;
  onSuccess: () => void;
}

const EditCommissionModal: React.FC<EditCommissionModalProps> = ({
  isOpen,
  onClose,
  commissionId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commission, setCommission] = useState<Commission | null>(null);
  const [newAmount, setNewAmount] = useState<string>("");

  // Load commission data
  useEffect(() => {
    if (isOpen && commissionId) {
      loadCommissionData();
    }
  }, [isOpen, commissionId]);

  const loadCommissionData = async () => {
    try {
      setLoading(true);
     
      // Get commission by commission ID
      const response = await axios.get(
        `/hr/transfer/commission/commission/${commissionId}`,

      );

      if (response.data.success) {
        const commissionData = response.data.data;
        setCommission(commissionData);
        setNewAmount(commissionData.amount?.toString() || "");
      }
    } catch (error: any) {
      console.error("Error loading commission data:", error);
      toast.error("ไม่สามารถโหลดข้อมูลค่าคอมมิชชั่นได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(newAmount) || 0;
    
    if (amountValue < 0) {
      toast.error("ค่าคอมมิชชั่นต้องมีค่าไม่น้อยกว่า 0");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `/hr/transfer/commission/${commissionId}/amount`,
        { amount: amountValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("อัปเดตค่าคอมมิชชั่นเรียบร้อยแล้ว");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating commission:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถอัปเดตค่าคอมมิชชั่นได้");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  // Helper function to get numeric value for calculations
  const getNumericValue = (value: string): number => {
    return parseFloat(value) || 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            แก้ไขค่าคอมมิชชั่น
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={saving}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">กำลังโหลดข้อมูล...</span>
          </div>
        ) : commission ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Commission Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">ข้อมูลคอมมิชชั่น</h3>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">พนักงาน:</span>
                  <span className="font-medium">{commission.employee?.fullname || 'ไม่ระบุ'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">ค่าคอมปัจจุบัน:</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(commission.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    commission.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    commission.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {commission.status === 'PAID' ? 'จ่ายแล้ว' :
                     commission.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                     'รออนุมัติ'}
                  </span>
                </div>
              </div>
            </div>

            {/* New Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค่าคอมมิชชั่นใหม่ (บาท) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                ค่าคอมมิชชั่นใหม่: {formatCurrency(getNumericValue(newAmount))}
              </p>
            </div>

            {/* Change Summary */}
            {getNumericValue(newAmount) !== commission.amount && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>การเปลี่ยนแปลง:</strong><br />
                  จาก {formatCurrency(commission.amount)} → {formatCurrency(getNumericValue(newAmount))}<br />
                  <span className={getNumericValue(newAmount) > commission.amount ? 'text-green-600' : 'text-red-600'}>
                    {getNumericValue(newAmount) > commission.amount ? '+' : ''}{formatCurrency(getNumericValue(newAmount) - commission.amount)}
                  </span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onClose}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-1" />
                ยกเลิก
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={saving || getNumericValue(newAmount) === commission.amount}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <p className="text-gray-500 text-center">ไม่พบข้อมูลค่าคอมมิชชั่น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCommissionModal;
