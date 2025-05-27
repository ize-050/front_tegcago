"use client"
import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { Plus, Trash2, Save, Edit, Search } from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";

interface RoleCommission {
  id?: string;
  role_name: string;
  commission_percentage: number;
  description?: string;
  is_active: boolean;
}

const RoleCommissionSettings: React.FC = () => {
  const [roleCommissions, setRoleCommissions] = useState<RoleCommission[]>([]);
  const [filteredRoleCommissions, setFilteredRoleCommissions] = useState<RoleCommission[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoleCommissions();
  }, []);

  useEffect(() => {
    // กรองข้อมูลตาม searchTerm
    if (searchTerm.trim() === "") {
      setFilteredRoleCommissions(roleCommissions);
    } else {
      const filtered = roleCommissions.filter(role => 
        role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRoleCommissions(filtered);
    }
  }, [searchTerm, roleCommissions]);

  const fetchRoleCommissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hr/commission-roles");
      setRoleCommissions(response.data || []);
      setFilteredRoleCommissions(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching role commissions:", error);
      setError("ไม่สามารถดึงข้อมูลค่าคอมมิชชั่นตามบทบาทได้");
      // แสดงข้อความแจ้งเตือนความผิดพลาด
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoleCommission = () => {
    const newRoleCommission: RoleCommission = {
      role_name: "",
      commission_percentage: 0,
      description: "",
      is_active: true
    };
    
    setRoleCommissions([...roleCommissions, newRoleCommission]);
    setFilteredRoleCommissions([...filteredRoleCommissions, newRoleCommission]);
  };

  const handleRemoveRoleCommission = async (index: number, id?: string) => {
    if (id) {
      try {
        setSaving(true);
        await axios.delete(`/hr/commission-roles/${id}`);
        setSuccess("ลบข้อมูลค่าคอมมิชชั่นตามบทบาทเรียบร้อยแล้ว");
      } catch (error) {
        console.error("Error deleting role commission:", error);
        setError("ไม่สามารถลบข้อมูลค่าคอมมิชชั่นตามบทบาทได้");
        return;
      } finally {
        setSaving(false);
      }
    }

    // หาตำแหน่งที่แท้จริงในอาร์เรย์ roleCommissions
    const actualIndex = id 
      ? roleCommissions.findIndex(role => role.id === id)
      : index;
    
    if (actualIndex !== -1) {
      const updatedRoleCommissions = [...roleCommissions];
      updatedRoleCommissions.splice(actualIndex, 1);
      setRoleCommissions(updatedRoleCommissions);
      
      // อัปเดต filteredRoleCommissions ด้วย
      const filteredIndex = filteredRoleCommissions.findIndex(role => 
        id ? role.id === id : role === roleCommissions[index]
      );
      
      if (filteredIndex !== -1) {
        const updatedFilteredRoleCommissions = [...filteredRoleCommissions];
        updatedFilteredRoleCommissions.splice(filteredIndex, 1);
        setFilteredRoleCommissions(updatedFilteredRoleCommissions);
      }
    }
  };

  const handleInputChange = (index: number, field: keyof RoleCommission, value: string | number | boolean) => {
    // หา role ที่ต้องการแก้ไขจาก filteredRoleCommissions
    const roleToUpdate = filteredRoleCommissions[index];
    
    // อัปเดต roleCommissions
    const roleCommissionsIndex = roleCommissions.findIndex(role => 
      roleToUpdate.id ? role.id === roleToUpdate.id : role === roleToUpdate
    );
    
    if (roleCommissionsIndex !== -1) {
      const updatedRoleCommissions = [...roleCommissions];
      updatedRoleCommissions[roleCommissionsIndex] = {
        ...updatedRoleCommissions[roleCommissionsIndex],
        [field]: value
      };
      setRoleCommissions(updatedRoleCommissions);
    }
    
    // อัปเดต filteredRoleCommissions
    const updatedFilteredRoleCommissions = [...filteredRoleCommissions];
    updatedFilteredRoleCommissions[index] = {
      ...updatedFilteredRoleCommissions[index],
      [field]: value
    };
    setFilteredRoleCommissions(updatedFilteredRoleCommissions);
  };

  const handleSaveRoleCommissions = async () => {
    // Validate inputs
    for (const role of roleCommissions) {
      if (!role.role_name) {
        setError("ชื่อบทบาทไม่สามารถเป็นค่าว่างได้");
        return;
      }
      
      if (role.commission_percentage < 0 || role.commission_percentage > 100) {
        setError("เปอร์เซ็นต์ค่าคอมมิชชั่นต้องอยู่ระหว่าง 0-100");
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Send all role commissions to the server
      const response = await axios.post("/hr/commission-roles/batch", {
        roleCommissions
      });

      setRoleCommissions(response.data || roleCommissions);
      setFilteredRoleCommissions(response.data || roleCommissions);
      setSuccess("บันทึกข้อมูลค่าคอมมิชชั่นตามบทบาทเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error saving role commissions:", error);
      setError("ไม่สามารถบันทึกข้อมูลค่าคอมมิชชั่นตามบทบาทได้");
    } finally {
      setSaving(false);
    }
  };

  const handleEditRoleCommission = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    
    if (status === "all") {
      // ถ้าเลือก "ทั้งหมด" ให้กรองเฉพาะตาม searchTerm
      if (searchTerm.trim() === "") {
        setFilteredRoleCommissions(roleCommissions);
      } else {
        const filtered = roleCommissions.filter(role => 
          role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredRoleCommissions(filtered);
      }
    } else {
      // กรองตามสถานะและ searchTerm
      const isActive = status === "active";
      let filtered = roleCommissions.filter(role => role.is_active === isActive);
      
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(role => 
          role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setFilteredRoleCommissions(filtered);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ตั้งค่าเปอร์เซ็นต์ค่าคอมมิชชั่นตามบทบาท</h2>
        {/*<Button*/}
        {/*  variant="primary"*/}
        {/*  onClick={handleAddRoleCommission}*/}
        {/*  disabled={loading || saving}*/}
        {/*>*/}
        {/*  <Plus className="w-4 h-4 mr-2" />*/}
        {/*  เพิ่มบทบาท*/}
        {/*</Button>*/}
      </div>

      {/* เพิ่มส่วน Filter */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <FormInput
              type="text"
              placeholder="ค้นหาตามชื่อบทบาทหรือคำอธิบาย..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-40">
          <FormSelect onChange={handleStatusFilterChange} defaultValue="all">
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
          </FormSelect>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">#</Table.Th>
                  <Table.Th className="whitespace-nowrap">ชื่อบทบาท</Table.Th>
                  <Table.Th className="whitespace-nowrap">เปอร์เซ็นต์ค่าคอมมิชชั่น (%)</Table.Th>
                  <Table.Th className="whitespace-nowrap">คำอธิบาย</Table.Th>
                  <Table.Th className="whitespace-nowrap">สถานะ</Table.Th>
                  <Table.Th className="whitespace-nowrap">การจัดการ</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredRoleCommissions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} className="text-center">
                      {searchTerm ? "ไม่พบข้อมูลที่ตรงกับการค้นหา" : "ไม่พบข้อมูลค่าคอมมิชชั่นตามบทบาท"}
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredRoleCommissions.map((role, index) => (
                    <Table.Tr key={role.id || `new-${index}`}>
                      <Table.Td>{index + 1}</Table.Td>
                      <Table.Td>
                        <FormInput
                          type="text"
                          value={role.role_name}
                          onChange={(e) => handleInputChange(index, "role_name", e.target.value)}
                          placeholder="ชื่อบทบาท"
                        />
                      </Table.Td>
                      <Table.Td>
                        <FormInput
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={role.commission_percentage}
                          onChange={(e) => handleInputChange(index, "commission_percentage", parseFloat(e.target.value))}
                          placeholder="เปอร์เซ็นต์"
                        />
                      </Table.Td>
                      <Table.Td>
                        <FormInput
                          type="text"
                          value={role.description || ""}
                          onChange={(e) => handleInputChange(index, "description", e.target.value)}
                          placeholder="คำอธิบาย"
                        />
                      </Table.Td>
                      <Table.Td>
                        <FormSelect
                          value={role.is_active ? "active" : "inactive"}
                          onChange={(e) => handleInputChange(index, "is_active", e.target.value === "active")}
                        >
                          <option value="active">ใช้งาน</option>
                          <option value="inactive">ไม่ใช้งาน</option>
                        </FormSelect>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex space-x-2">
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveRoleCommission(index, role.id)}
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              onClick={handleSaveRoleCommissions}
              disabled={saving || roleCommissions.length === 0}
            >
              {saving ? (
                "กำลังบันทึก..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleCommissionSettings;
