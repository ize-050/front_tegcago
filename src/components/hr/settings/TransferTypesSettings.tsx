"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Save,
  X,
  AlertCircle
} from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import { toast } from "react-toastify";

interface TransferType {
  id: string;
  type_name: string;
  commission_rate: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

const TransferTypesSettings: React.FC = () => {
  // State for data
  const [transferTypes, setTransferTypes] = useState<TransferType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentTransferType, setCurrentTransferType] = useState<TransferType | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    type_name: "",
    commission_rate: "0",
    is_active: true
  });

  // Fetch transfer types
  const fetchTransferTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types`
      );

      if (response.data && response.data.success) {
        setTransferTypes(response.data.data || []);
      } else {
        setError("ไม่สามารถโหลดข้อมูลประเภทฝากสั่งฝากโอนได้");
      }
    } catch (error) {
      console.error("Error fetching transfer types:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchTransferTypes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else if (name === "commission_rate") {
      // Allow only numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Open modal for adding a new transfer type
  const handleAddNew = () => {
    setFormData({
      type_name: "",
      commission_rate: "0",
      is_active: true
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  // Open modal for editing a transfer type
  const handleEdit = (transferType: TransferType) => {
    setFormData({
      type_name: transferType.type_name,
      commission_rate: transferType.commission_rate.toString(),
      is_active: transferType.is_active
    });
    setCurrentTransferType(transferType);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveStatus(null);
      
      // Validate form
      if (!formData.type_name.trim()) {
        setSaveError("กรุณาระบุชื่อประเภท");
        return;
      }

      // Prepare data for API
      const apiData = {
        type_name: formData.type_name.trim(),
        commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : 0,
        is_active: formData.is_active
      };

      let response;
      
      if (modalMode === "add") {
        // Create new transfer type
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types`,
          apiData
        );
        
        if (response.data && response.data.success) {
          setSaveStatus("เพิ่มประเภทฝากสั่งฝากโอนสำเร็จ");
        }
      } else {
        // Update existing transfer type
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types/${currentTransferType?.id}`,
          apiData
        );
        
        if (response.data && response.data.success) {
          setSaveStatus("อัปเดตประเภทฝากสั่งฝากโอนสำเร็จ");
        }
      }

      // Close modal and refresh data after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        fetchTransferTypes();
      }, 1500);
    } catch (error) {
      console.error("Error saving transfer type:", error);
      setSaveError("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("คุณต้องการลบประเภทฝากสั่งฝากโอนนี้ใช่หรือไม่?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL_API}/hr/transfer-types/${id}`
      );

      if (response.data && response.data.success) {
        toast.success("ลบประเภทฝากสั่งฝากโอนสำเร็จ");
        fetchTransferTypes();
      } else {
        toast.error("ไม่สามารถลบประเภทฝากสั่งฝากโอนได้");
      }
    } catch (error) {
      console.error("Error deleting transfer type:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ตั้งค่าประเภทฝากสั่งฝากโอน</h2>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มประเภทใหม่
            </Button>
            <Button
              variant="secondary"
              onClick={fetchTransferTypes}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              รีเฟรช
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-12 text-center">ลำดับ</Table.Th>
                <Table.Th>ประเภท</Table.Th>
                <Table.Th className="w-40">เรทค่าคอม</Table.Th>
                <Table.Th className="w-28">สถานะ</Table.Th>
                <Table.Th className="w-32 text-center">จัดการ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : error ? (
                <Table.Tr>
                  <Table.Td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                      <span className="text-red-500">{error}</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : transferTypes.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-gray-500">ไม่พบข้อมูลประเภทฝากสั่งฝากโอน</span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                transferTypes.map((item, index) => (
                  <Table.Tr 
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Table.Td className="text-center">{index + 1}</Table.Td>
                    <Table.Td className="font-medium">{item.type_name}</Table.Td>
                    <Table.Td>{formatCurrency(item.commission_rate)}</Table.Td>
                    <Table.Td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="p-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {modalMode === "add" ? "เพิ่มประเภทฝากสั่งฝากโอนใหม่" : "แก้ไขประเภทฝากสั่งฝากโอน"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อประเภท</label>
                  <FormInput
                    type="text"
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleInputChange}
                    placeholder="ระบุชื่อประเภท เช่น ฝากโอน, ฝากสั่งซื้อ, ฝากเติม"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เรทค่าคอม</label>
                  <FormInput
                    type="text"
                    name="commission_rate"
                    value={formData.commission_rate}
                    onChange={handleInputChange}
                    placeholder="ระบุเรทค่าคอม"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    อัตราค่าคอมมิชชั่น (บาท)
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FormInput
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">เปิดใช้งาน</label>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-5">
                {saveError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md mb-2">
                    {saveError}
                  </div>
                )}
                {saveStatus && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-md mb-2">
                    {saveStatus}
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={isSaving}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className={isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferTypesSettings;
