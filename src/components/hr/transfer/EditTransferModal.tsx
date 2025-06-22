"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Base/Button";
import { X, Save, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface TransferData {
  id: string;
  type: string;
  date: string;
  documentNumber: string;
  customerId?: string;
  salespersonId: string;
  amountRMB?: number;
  transferDate?: string;
  customerDeposit?: {
    priceDifference?: number;
    exchangeRate?: number;
    fee?: number;
    amount?: number;
    vat?: number;
    totalWithVat?: number;
    totalDepositAmount?: number;
    receivingAccount?: string;
    notes?: string;
    transferSlipUrl?: string;
    deposit_purpose?: string;
  };
  exchange?: {
    productDetails?: string;
    orderStatus?: string;
    topupPlatform?: string;
    topupAccount?: string;
    exchangeRateProfit?: number;
    incomePerTransaction?: number;
    priceDifference?: number;
    exchangeRate?: number;
    fee?: number;
    amount?: number;
    receivingAccount?: string;
    notes?: string;
    transferSlipUrl?: string;
  };
}

interface EditTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: string;
  onSuccess: () => void;
}

const EditTransferModal: React.FC<EditTransferModalProps> = ({
  isOpen,
  onClose,
  transferId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [salesEmployees, setSalesEmployees] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    documentNumber: "",
    salespersonId: "",
    amountRMB: 0,
    transferDate: "",
    // Customer deposit fields
    priceDifference: 0,
    exchangeRate: 0,
    fee: 0,
    amount: 0,
    vat: 0,
    totalWithVat: 0,
    totalDepositAmount: 0,
    receivingAccount: "",
    notes: "",
    deposit_purpose: "",
    // Exchange fields
    productDetails: "",
    orderStatus: "",
    topupPlatform: "",
    topupAccount: "",
    exchangeRateProfit: 0,
    incomePerTransaction: 0,
  });

  // Load transfer data and sales employees
  useEffect(() => {
    if (isOpen && transferId) {
      loadTransferData();
      loadSalesEmployees();
    }
  }, [isOpen, transferId]);

  const loadTransferData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/transfer/${transferId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setTransferData(data);
        
        // Populate form data
        setFormData({
          type: data.type || "",
          date: data.date ? data.date.split('T')[0] : "",
          documentNumber: data.documentNumber || "",
          salespersonId: data.salespersonId || "",
          amountRMB: data.amountRMB || 0,
          transferDate: data.transferDate ? data.transferDate.split('T')[0] : "",
          // Customer deposit fields
          priceDifference: data.customerDeposit?.priceDifference || 0,
          exchangeRate: data.customerDeposit?.exchangeRate || data.exchange?.exchangeRate || 0,
          fee: data.customerDeposit?.fee || data.exchange?.fee || 0,
          amount: data.customerDeposit?.amount || data.exchange?.amount || 0,
          vat: data.customerDeposit?.vat || 0,
          totalWithVat: data.customerDeposit?.totalWithVat || 0,
          totalDepositAmount: data.customerDeposit?.totalDepositAmount || 0,
          receivingAccount: data.customerDeposit?.receivingAccount || data.exchange?.receivingAccount || "",
          notes: data.customerDeposit?.notes || data.exchange?.notes || "",
          deposit_purpose: data.customerDeposit?.deposit_purpose || "",
          // Exchange fields
          productDetails: data.exchange?.productDetails || "",
          orderStatus: data.exchange?.orderStatus || "",
          topupPlatform: data.exchange?.topupPlatform || "",
          topupAccount: data.exchange?.topupAccount || "",
          exchangeRateProfit: data.exchange?.exchangeRateProfit || 0,
          incomePerTransaction: data.exchange?.incomePerTransaction || 0,
        });
      }
    } catch (error) {
      console.error("Error loading transfer data:", error);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const loadSalesEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/transfer/salesupport/employees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSalesEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error loading sales employees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/hr/transfer/${transferId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating transfer:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCustomerDeposit = transferData?.customerDeposit;
  const isExchange = transferData?.exchange;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">แก้ไขข้อมูล Transfer</h2>
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
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทธุรกรรม *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">เลือกประเภท</option>
                  <option value="CUSTOMER_DEPOSIT">ลูกค้าฝากชำระ</option>
                  <option value="EXCHANGE">แลกเปลี่ยน</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  พนักงานขาย *
                </label>
                <select
                  value={formData.salespersonId}
                  onChange={(e) => handleInputChange('salespersonId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">เลือกพนักงาน</option>
                  {salesEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullname}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่ *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เลขที่เอกสาร
                </label>
                <input
                  type="text"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จำนวนเงิน RMB
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amountRMB}
                  onChange={(e) => handleInputChange('amountRMB', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่โอน
                </label>
                <input
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => handleInputChange('transferDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Customer Deposit Fields */}
            {isCustomerDeposit && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-4">ข้อมูลลูกค้าฝากชำระ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ส่วนต่างต่อรองราคา
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceDifference}
                      onChange={(e) => handleInputChange('priceDifference', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อัตราแลกเปลี่ยน
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.exchangeRate}
                      onChange={(e) => handleInputChange('exchangeRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ค่าธรรมเนียม
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fee}
                      onChange={(e) => handleInputChange('fee', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      บัญชีผู้รับ
                    </label>
                    <input
                      type="text"
                      value={formData.receivingAccount}
                      onChange={(e) => handleInputChange('receivingAccount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วัตถุประสงค์การฝาก
                    </label>
                    <input
                      type="text"
                      value={formData.deposit_purpose}
                      onChange={(e) => handleInputChange('deposit_purpose', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Exchange Fields */}
            {isExchange && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-4">ข้อมูลแลกเปลี่ยน</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รายละเอียดสินค้า
                    </label>
                    <input
                      type="text"
                      value={formData.productDetails}
                      onChange={(e) => handleInputChange('productDetails', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      สถานะคำสั่งซื้อ
                    </label>
                    <input
                      type="text"
                      value={formData.orderStatus}
                      onChange={(e) => handleInputChange('orderStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      แพลตฟอร์มเติมเงิน
                    </label>
                    <input
                      type="text"
                      value={formData.topupPlatform}
                      onChange={(e) => handleInputChange('topupPlatform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      บัญชีเติมเงิน
                    </label>
                    <input
                      type="text"
                      value={formData.topupAccount}
                      onChange={(e) => handleInputChange('topupAccount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หมายเหตุ
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                บันทึก
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTransferModal;
