"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { Plus, Trash2, Save } from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Table from "@/components/Base/Table";

interface CommissionRank {
  id?: string;
  min_amount: number;
  max_amount: number;
  percentage: number;
}

const CommissionRankSettings: React.FC = () => {
  const [ranks, setRanks] = useState<CommissionRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hr/commission-ranks");
      setRanks(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching commission ranks:", error);
      setError("ไม่สามารถดึงข้อมูลอันดับค่าคอมมิชชั่นได้");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRank = () => {
    // Find the highest max_amount to set as the new min_amount
    const highestMax = ranks.reduce((max, rank) => 
      rank.max_amount > max ? rank.max_amount : max, 0);
    
    const newRank: CommissionRank = {
      min_amount: highestMax + 1,
      max_amount: highestMax + 20000,
      percentage: 0
    };
    
    setRanks([...ranks, newRank]);
  };

  const handleRemoveRank = (index: number) => {
    const updatedRanks = [...ranks];
    updatedRanks.splice(index, 1);
    setRanks(updatedRanks);
  };

  const handleRankChange = (index: number, field: keyof CommissionRank, value: string) => {
    const updatedRanks = [...ranks];
    
    // Convert string value to number for numeric fields
    const numValue = field !== 'id' ? parseFloat(value) : value;
    
    // Update the field with proper type handling
    if (field !== 'id') {
      updatedRanks[index] = {
        ...updatedRanks[index],
        [field]: parseFloat(value)
      };
    } else {
      updatedRanks[index] = {
        ...updatedRanks[index],
        [field]: value
      };
    }
    
    // Only validate min_amount to ensure it's less than max_amount
    // For max_amount, we allow any value the user enters
    if (field === 'min_amount') {
      const minAmount = parseFloat(value);
      const maxAmount = updatedRanks[index].max_amount;
      
      if (!isNaN(minAmount) && minAmount >= maxAmount) {
        updatedRanks[index].max_amount = minAmount + 1;
      }
    }
    
    setRanks(updatedRanks);
  };

  const handleSaveRanks = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Validate ranks before saving
      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        if (rank.min_amount >= rank.max_amount) {
          setError(`อันดับที่ ${i + 1} มีช่วงเงินไม่ถูกต้อง (ค่าต่ำสุดต้องน้อยกว่าค่าสูงสุด)`);
          setSaving(false);
          return;
        }
        
        if (i > 0 && rank.min_amount <= ranks[i - 1].max_amount) {
          setError(`อันดับที่ ${i + 1} มีช่วงเงินซ้อนทับกับอันดับก่อนหน้า`);
          setSaving(false);
          return;
        }
      }
      
      await axios.post("/hr/commission-ranks", { ranks });
      setSuccess("บันทึกข้อมูลอันดับค่าคอมมิชชั่นสำเร็จ");
      fetchRanks(); // Refresh data
    } catch (error) {
      console.error("Error saving commission ranks:", error);
      setError("ไม่สามารถบันทึกข้อมูลอันดับค่าคอมมิชชั่นได้");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">ตั้งค่าอันดับค่าคอมมิชชั่น</h2>
          <Button 
            onClick={handleAddRank}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มลำดับใหม่
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
        ) : ranks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">ยังไม่มีข้อมูลอันดับค่าคอมมิชชั่น</p>
            <Button onClick={handleAddRank}>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มอันดับใหม่
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">ลำดับ</Table.Th>
                  <Table.Th className="whitespace-nowrap">ช่วงกำไร (ต่ำสุด)</Table.Th>
                  <Table.Th className="whitespace-nowrap">ช่วงกำไร (สูงสุด)</Table.Th>
                  <Table.Th className="whitespace-nowrap">เปอร์เซ็นต์ (%)</Table.Th>
                  <Table.Th className="whitespace-nowrap">ตัวอย่างการคำนวณ</Table.Th>
                  <Table.Th className="whitespace-nowrap text-right">จัดการ</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ranks.map((rank, index) => {
                  const exampleAmount = (rank.min_amount + rank.max_amount) / 2;
                  const exampleCommission = (exampleAmount * rank.percentage) / 100;
                  
                  return (
                    <Table.Tr key={index}>
                      <Table.Td>{index + 1}</Table.Td>
                      <Table.Td>
                        <FormInput
                          type="number"
                          value={rank.min_amount.toString()}
                          onChange={(e) => handleRankChange(index, 'min_amount', e.target.value)}
                          className="w-32"
                        />
                      </Table.Td>
                      <Table.Td>
                        <FormInput
                          type="number"
                          value={rank.max_amount.toString()}
                          onChange={(e) => handleRankChange(index, 'max_amount', e.target.value)}
                          className="w-32"
                        />
                      </Table.Td>
                      <Table.Td>
                        <FormInput
                          type="number"
                          value={rank.percentage.toString()}
                          onChange={(e) => handleRankChange(index, 'percentage', e.target.value)}
                          className="w-20"
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className="text-sm">
                          <p>กำไร: {formatCurrency(exampleAmount)}</p>
                          <p>คอมมิชชั่น: {formatCurrency(exampleCommission)}</p>
                        </div>
                      </Table.Td>
                      <Table.Td className="text-right">
                        <Button 
                          size="sm"
                          onClick={() => handleRemoveRank(index)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        )}

        <div className="mt-5 flex justify-end space-x-2">
          <Button 
            onClick={handleSaveRanks} 
            disabled={saving || ranks.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommissionRankSettings;
