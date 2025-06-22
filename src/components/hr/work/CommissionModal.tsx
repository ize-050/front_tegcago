"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import axios from "../../../../axios";

interface Employee {
  id: string;
  user_id: string;
  fullname: string;
  email: string;
  role?: string;
  department?: string;
}

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseData: any
  onSave: (commissionData: any) => void;
}

interface EmployeeCommission {
  employee_id: string;
  fullname: string;
  commission_type: "percentage" | "fixed" | "percent";
  commission_value: string;
  commission_amount: string;
}

const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  onClose,
  purchaseData,
  onSave,
}) => {
  const [employeeCommissions, setEmployeeCommissions] = useState<EmployeeCommission[]>([]);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [commissionRank, setCommissionRank] = useState<any>(null);
  const [isLoadingRank, setIsLoadingRank] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  console.log("purchaseData", purchaseData)

  // หาค่า billing_amount และ total_profit_loss จาก purchase_finance ที่มีสถานะ "ชำระครบแล้ว"
  const paidFinance = purchaseData.purchase_finance.find(
    (finance: any) => finance.payment_status === "ชำระครบแล้ว"
  );

  const billingAmount = paidFinance ? parseFloat(paidFinance.billing_amount || "0") : 0;
  
  // แก้ไขการคำนวณ profitLoss ให้รองรับค่าติดลบ
  let profitLoss = 0;
  if (paidFinance && paidFinance.payment_prefix && paidFinance.payment_prefix.profit_loss !== null && paidFinance.payment_prefix.profit_loss !== undefined) {
    const profitLossStr = String(paidFinance.payment_prefix.profit_loss);
    profitLoss = parseFloat(profitLossStr) || 0;
  }
  
  // ใช้ management_fee จากฐานข้อมูลแทนค่าคงที่ 10%
  const managementFee = paidFinance && paidFinance.payment_prefix && paidFinance.payment_prefix.management_fee !== null && paidFinance.payment_prefix.management_fee !== undefined
    ? parseFloat(String(paidFinance.payment_prefix.management_fee)) || 0
    : 0;

  // กำไรสุทธิหลังหักค่าบริหาร
  const netProfit = profitLoss - managementFee;
  
  // Debug log เพื่อตรวจสอบค่า
  console.log("CommissionModal - paidFinance:", paidFinance);
  console.log("CommissionModal - payment_prefix:", paidFinance?.payment_prefix);
  console.log("CommissionModal - profit_loss raw:", paidFinance?.payment_prefix?.profit_loss);
  console.log("CommissionModal - profitLoss calculated:", profitLoss);
  console.log("CommissionModal - management_fee raw:", paidFinance?.payment_prefix?.management_fee);
  console.log("CommissionModal - managementFee calculated:", managementFee);

  // ดึงข้อมูลเปอร์เซ็นต์จาก commission ranks ตามช่วงกำไร
  const fetchCommissionRank = async (profitAmount: number) => {
    try {
      setIsLoadingRank(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/calculate`, {
        profit_amount: profitAmount
      });

      if (response.data && response.data.rank) {
        setCommissionRank(response.data.rank);
        return response.data.rank;
      } else {
        console.warn("No commission rank found for profit amount:", profitAmount);
        setCommissionRank(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching commission rank:", error);
      setCommissionRank(null);
      return null;
    } finally {
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลเปอร์เซ็นต์จาก commission ranks
    const initializeCommissions = async () => {
      // สร้างข้อมูลค่าคอมมิชชั่นเริ่มต้นสำหรับพนักงานแต่ละคน
      if (purchaseData.employees && purchaseData.employees.length > 0) {
        // ดึงข้อมูล rank จาก API
        const rank = await fetchCommissionRank(profitLoss);
        const percentageValue = rank ? rank.percentage.toString() : "5";

        const initialCommissions = purchaseData.employees.map((emp:any) => {
          // ตรวจสอบว่าเป็นพนักงาน CS หรือไม่
          const isCS = emp.role === 'CS' || emp.department === 'CS' || emp.role === 'cs' || emp.department === 'cs';

          return {
            employee_id: emp.user_id,
            fullname: emp.fullname,
            commission_type: isCS ? "fixed" as const : "percentage" as const,
            commission_value: isCS ? "200" : percentageValue,
            commission_amount: isCS
              ? "200.00"
              : calculateCommissionAmount("percentage", percentageValue, profitLoss).toFixed(2),
          };
        });

        setEmployeeCommissions(initialCommissions);

        // คำนวณค่าคอมมิชชั่นรวม
        const total = initialCommissions.reduce(
          (sum: any  , item:any) => sum + parseFloat(item.commission_amount || "0"),
          0
        );
        setTotalCommission(total);
      }
    };

    initializeCommissions();
  }, [purchaseData]);

  // คำนวณค่าคอมมิชชั่นตามประเภทและค่าที่กำหนด
  const calculateCommissionAmount = (
    type: "percentage" | "fixed" | "percent",
    value: string,
    baseAmount: number
  ): number => {
    if (type === "percentage" || type === "percent") {
      const percentage = parseFloat(value || "0");
      return (percentage / 100) * baseAmount;
    } else {
      return parseFloat(value || "0");
    }
  };

  // อัปเดตค่าคอมมิชชั่นเมื่อมีการเปลี่ยนแปลง
  const handleCommissionChange = (
    index: number,
    field: "commission_type" | "commission_value",
    value: string
  ) => {
    const updatedCommissions = [...employeeCommissions];

    if (field === "commission_type") {
      updatedCommissions[index].commission_type = value as "percentage" | "fixed" | "percent";

      // รีเซ็ตค่าเมื่อเปลี่ยนประเภท
      if (value === "percentage") {
        // ใช้ค่าจาก commission ranks ถ้ามี
        updatedCommissions[index].commission_value = commissionRank ? commissionRank.percentage.toString() : "5";
      } else if (value === "percent") {
        // ค่าเริ่มต้นสำหรับกรอกเอง
        updatedCommissions[index].commission_value = "5";
      } else {
        updatedCommissions[index].commission_value = "0"; // ค่าเริ่มต้น 0 บาท
      }
    } else {
      // อนุญาตให้แก้ไขค่า
      if (updatedCommissions[index].commission_type === "fixed" || updatedCommissions[index].commission_type === "percent") {
        updatedCommissions[index].commission_value = value;
      }
    }

    // คำนวณค่าคอมมิชชั่นใหม่
    updatedCommissions[index].commission_amount = calculateCommissionAmount(
      updatedCommissions[index].commission_type,
      updatedCommissions[index].commission_value,
      profitLoss
    ).toFixed(2);

    setEmployeeCommissions(updatedCommissions);

    // คำนวณค่าคอมมิชชั่นรวม
    const total = updatedCommissions.reduce(
      (sum, item) => sum + parseFloat(item.commission_amount || "0"),
      0
    );
    setTotalCommission(total);
  };

  // บันทึกข้อมูลค่าคอมมิชชั่น
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveStatus(null);

      // สร้างข้อมูลสำหรับส่งไปยัง API
      const commissionData = {
        d_purchase_id: purchaseData.id,
        commissions: employeeCommissions.map(comm => ({
          employee_id: comm.employee_id,
          commission_type: comm.commission_type,
          commission_value: parseFloat(comm.commission_value),
          commission_amount: parseFloat(comm.commission_amount),
          status: "saved"
        })),
        total_commission: totalCommission
      };

      // ส่งข้อมูลไปยัง API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/hr/commission-ranks/submit`, commissionData);

      if (response.status === 200) {
        console.log('Commission saved successfully:', response.data);
        setSaveStatus("บันทึกค่าคอมมิชชั่นเรียบร้อยแล้ว");
      } else {
        console.error('Failed to save commission:', response.data);
        setSaveError("เกิดข้อผิดพลาดในการบันทึกค่าคอมมิชชั่น");
      }
    } catch (error) {
      console.error('Error saving commission data:', error);
      setSaveError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => {
      onClose();
    }, 1500);

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">คำนวณค่าคอมมิชชั่น</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">ข้อมูลงาน</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">เลขที่บุ๊คกิ้ง</p>
                <p className="font-medium">{purchaseData.book_number}</p>
              </div>
              {purchaseData.customer_number && (
                <div>
                  <p className="text-sm text-gray-500">เลขที่ลูกค้า</p>
                  <p className="font-medium">{purchaseData.customer_number}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">ยอดเรียกเก็บ</p>
                <p className="font-medium">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(billingAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">กำไร/ขาดทุน</p>
                <p className={`font-medium ${profitLoss < 0 ? "text-red-600" : "text-green-600"}`}>
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(profitLoss)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ค่าบริหาร</p>
                <p className="font-medium">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(managementFee)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">กำไรสุทธิหลังหักค่าบริหาร</p>
                <p className="font-medium">
                  {new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(netProfit)}
                </p>
              </div>
              {purchaseData.salesOwner && (
                <div>
                  <p className="text-sm text-gray-500">Sale เจ้าของงาน</p>
                  <p className="font-medium">{purchaseData.salesOwner}</p>
                </div>
              )}
              {purchaseData.d_term && (
                <div>
                  <p className="text-sm text-gray-500">ประเภทตู้</p>
                  <p className="font-medium">{purchaseData.d_term}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">ค่าคอมมิชชั่นพนักงาน</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      พนักงาน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ค่า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนเงิน
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeCommissions.map((commission, index) => (
                    <tr key={commission.employee_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {commission.fullname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FormSelect
                          className="w-full"
                          value={commission.commission_type}
                          onChange={(e) =>
                            handleCommissionChange(
                              index,
                              "commission_type",
                              e.target.value
                            )
                          }
                        >
                          <option value="percentage">เปอร์เซ็นต์ (%)</option>
                          <option value="fixed">จำนวนเงิน (บาท)</option>
                          <option value="percent">% (กรอกเอง)</option>
                        </FormSelect>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {commission.commission_type === "percentage" ? (
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900 font-medium">
                              {isLoadingRank ? "กำลังคำนวณ..." : `${commission.commission_value}%`}
                            </div>
                            {commissionRank && (
                              <div className="ml-2 text-xs text-gray-500">
                                (กำไร {new Intl.NumberFormat("th-TH").format(profitLoss)} บาท อยู่ในช่วง {new Intl.NumberFormat("th-TH").format(commissionRank.min_amount)} - {new Intl.NumberFormat("th-TH").format(commissionRank.max_amount)} บาท)
                              </div>
                            )}
                          </div>
                        ) : commission.commission_type === "percent" ? (
                          <div className="flex items-center">
                            <FormInput
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={commission.commission_value}
                              onChange={(e) =>
                                handleCommissionChange(
                                  index,
                                  "commission_value",
                                  e.target.value
                                )
                              }
                              className="w-32 mr-2"
                            />
                            <span className="text-sm text-gray-900">%</span>
                          </div>
                        ) : (
                          <FormInput
                            type="number"
                            min="0"
                            step="1"
                            value={commission.commission_value}
                            onChange={(e) =>
                              handleCommissionChange(
                                index,
                                "commission_value",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                          }).format(parseFloat(commission.commission_amount))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-semibold">
                      รวมค่าคอมมิชชั่นทั้งหมด
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                      }).format(totalCommission)}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
              <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
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
  );
};

export default CommissionModal;
