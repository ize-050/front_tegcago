"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { Plus, Trash2, Save, Filter } from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";

interface CommissionRank {
  id?: string;
  work_type: string;
  min_amount: number;
  max_amount: number;
  percentage: number;
}

const CommissionRankSettings: React.FC = () => {
  const [ranks, setRanks] = useState<CommissionRank[]>([]);
  const [filteredRanks, setFilteredRanks] = useState<CommissionRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedWorkType, setSelectedWorkType] = useState<string>("");

  // ประเภทงานทั้งหมด
  const workTypes = [
    "ALL IN",
    "เคลียร์ฝั่งไทย",
    "เคลียร์ฝั่งจีน",
    "GREEN",
    "FOB",
    "EXW",
    "CIF",
    "CUSTOMER CLEAR"
  ];

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hr/commission-ranks");
      const ranksData = response.data || [];
      setRanks(ranksData);
      setFilteredRanks(ranksData);
      setError(null);
    } catch (error) {
      console.error("Error fetching commission ranks:", error);
      setError("ไม่สามารถดึงข้อมูลอันดับค่าคอมมิชชั่นได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟิลเตอร์ข้อมูลตามประเภทงาน
  useEffect(() => {
    if (selectedWorkType === "") {
      setFilteredRanks(ranks);
    } else {
      setFilteredRanks(ranks.filter(rank => rank.work_type === selectedWorkType));
    }
  }, [selectedWorkType, ranks]);

  const handleAddRank = () => {
    if (!selectedWorkType) {
      setError("กรุณาเลือกประเภทงานก่อนเพิ่มอันดับใหม่");
      return;
    }

    // Find the highest max_amount for the selected work type
    const workTypeRanks = ranks.filter(rank => rank.work_type === selectedWorkType);
    const highestMax = workTypeRanks.reduce((max, rank) => 
      rank.max_amount > max ? rank.max_amount : max, 0);
    
    const newRank: CommissionRank = {
      work_type: selectedWorkType,
      min_amount: highestMax + 1,
      max_amount: highestMax + 20000,
      percentage: 0
    };
    
    setRanks([...ranks, newRank]);
  };

  // ฟังก์ชันตรวจสอบว่าเป็น default rank หรือไม่
  const isDefaultRank = (rank: CommissionRank) => {
    const defaultRanks = [
      { work_type: 'ALL IN', min_amount: 0, max_amount: 50000 },
      { work_type: 'เคลียร์ฝั่งไทย', min_amount: 0, max_amount: 30000 },
      { work_type: 'เคลียร์ฝั่งจีน', min_amount: 0, max_amount: 35000 },
      { work_type: 'GREEN', min_amount: 0, max_amount: 20000 },
      { work_type: 'FOB', min_amount: 0, max_amount: 25000 },
      { work_type: 'EXW', min_amount: 0, max_amount: 15000 },
      { work_type: 'CIF', min_amount: 0, max_amount: 40000 },
      { work_type: 'CUSTOMER CLEAR', min_amount: 0, max_amount: 20000 },
    ];

    return defaultRanks.some(defaultRank => 
      defaultRank.work_type === rank.work_type &&
      defaultRank.min_amount === rank.min_amount &&
      defaultRank.max_amount === rank.max_amount
    );
  };

  const handleRemoveRank = async (index: number) => {
    const actualRank = filteredRanks[index];
    
    // ตรวจสอบว่าเป็น default rank หรือไม่
    if (isDefaultRank(actualRank)) {
      setError("ไม่สามารถลบอันดับเริ่มต้นได้ สามารถแก้ไขได้เท่านั้น");
      return;
    }

    // ขอให้ผู้ใช้ยืนยันการลบ
    if (!confirm("คุณต้องการลบอันดับนี้หรือไม่?")) {
      return;
    }
    
    // ถ้ารายการมี id แสดงว่าเป็นข้อมูลที่มีอยู่ในฐานข้อมูล ต้องยิง API ลบ
    if (actualRank.id) {
      try {
        setError(null);
        const response = await axios.delete(`/hr/commission-ranks/${actualRank.id}`);
        
        if (response.data.success) {
          setSuccess("ลบอันดับค่าคอมมิชชั่นสำเร็จ");
          // รีเฟรชข้อมูลจากฐานข้อมูล
          fetchRanks();
        } else {
          setError("ไม่สามารถลบอันดับค่าคอมมิชชั่นได้");
        }
      } catch (error) {
        console.error("Error deleting commission rank:", error);
        setError("เกิดข้อผิดพลาดในการลบอันดับค่าคอมมิชชั่น");
      }
    } else {
      // ถ้าไม่มี id แสดงว่าเป็นรายการใหม่ที่ยังไม่ได้บันทึก ลบจาก state ได้เลย
      const actualIndex = ranks.findIndex(rank => rank === actualRank);
      
      if (actualIndex !== -1) {
        const updatedRanks = [...ranks];
        updatedRanks.splice(actualIndex, 1);
        setRanks(updatedRanks);
        setSuccess("ลบรายการใหม่สำเร็จ");
      }
    }
  };

  const handleRankChange = (index: number, field: keyof CommissionRank, value: string) => {
    // หา index จริงใน ranks array
    const actualRank = filteredRanks[index];
    const actualIndex = ranks.findIndex(rank => 
      actualRank.id ? rank.id === actualRank.id : rank === actualRank
    );
    
    if (actualIndex === -1) return;
    
    const updatedRanks = [...ranks];
    
    // Update the field with proper type handling
    if (field === 'work_type' || field === 'id') {
      updatedRanks[actualIndex] = {
        ...updatedRanks[actualIndex],
        [field]: value
      };
    } else {
      updatedRanks[actualIndex] = {
        ...updatedRanks[actualIndex],
        [field]: parseFloat(value)
      };
    }
    
    // Only validate min_amount to ensure it's less than max_amount
    // For max_amount, we allow any value the user enters
    if (field === 'min_amount') {
      const minAmount = parseFloat(value);
      const maxAmount = updatedRanks[actualIndex].max_amount;
      
      if (!isNaN(minAmount) && minAmount >= maxAmount) {
        updatedRanks[actualIndex].max_amount = minAmount + 1;
      }
    }
    
    setRanks(updatedRanks);
  };

  const handleSaveRanks = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Group ranks by work_type for validation
      const ranksByWorkType = ranks.reduce((groups, rank) => {
        if (!groups[rank.work_type]) {
          groups[rank.work_type] = [];
        }
        groups[rank.work_type].push(rank);
        return groups;
      }, {} as Record<string, CommissionRank[]>);

      // Validate ranks by work_type
      for (const workType in ranksByWorkType) {
        const workTypeRanks = ranksByWorkType[workType];
        
        // Sort by min_amount for proper validation
        workTypeRanks.sort((a, b) => a.min_amount - b.min_amount);
        
        for (let i = 0; i < workTypeRanks.length; i++) {
          const rank = workTypeRanks[i];
          
          // Check if min_amount < max_amount
          if (rank.min_amount >= rank.max_amount) {
            setError(`ประเภทงาน "${workType}" อันดับที่ ${i + 1} มีช่วงเงินไม่ถูกต้อง (ค่าต่ำสุดต้องน้อยกว่าค่าสูงสุด)`);
            setSaving(false);
            return;
          }
          
          // Check overlap with previous rank in the same work_type
          if (i > 0 && rank.min_amount <= workTypeRanks[i - 1].max_amount) {
            setError(`ประเภทงาน "${workType}" อันดับที่ ${i + 1} มีช่วงเงินซ้อนทับกับอันดับก่อนหน้า`);
            setSaving(false);
            return;
          }
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
          <div>
            {/* Filter by Work Type */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">กรองตามประเภทงาน:</span>
              </div>
              <FormSelect
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="w-48"
              >
                <option value="">ทุกประเภท</option>
                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="whitespace-nowrap">ลำดับ</Table.Th>
                    <Table.Th className="whitespace-nowrap">ประเภทงาน</Table.Th>
                    <Table.Th className="whitespace-nowrap">ช่วงกำไร (ต่ำสุด)</Table.Th>
                    <Table.Th className="whitespace-nowrap">ช่วงกำไร (สูงสุด)</Table.Th>
                    <Table.Th className="whitespace-nowrap">เปอร์เซ็นต์ (%)</Table.Th>
                    <Table.Th className="whitespace-nowrap">ตัวอย่างการคำนวณ</Table.Th>
                    <Table.Th className="whitespace-nowrap text-right">จัดการ</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRanks.map((rank, index) => {
                  const exampleAmount = (rank.min_amount + rank.max_amount) / 2;
                  const exampleCommission = (exampleAmount * rank.percentage) / 100;
                  
                  return (
                    <Table.Tr key={rank.id || index}>
                      <Table.Td>{index + 1}</Table.Td>
                      <Table.Td>
                        <span className="text-sm font-medium text-gray-700">
                          {rank.work_type}
                        </span>
                      </Table.Td>
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
                        {isDefaultRank(rank) ? (
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              อันดับเริ่มต้น
                            </span>
                          </div>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleRemoveRank(index)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
            </div>
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
