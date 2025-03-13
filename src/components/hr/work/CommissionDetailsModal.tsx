"use client";

import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import Button from "@/components/Base/Button";
import axios from "../../../../axios";

interface Employee {
  id: string;
  user_id: string;
  fullname: string;
  email: string;
}

interface EmployeeCommission {
  id: string;
  employee_id: string;
  commission_type: string;
  commission_value: number;
  commission_amount: number;
  status: string;
  createdAt: string;
  employee?: {
    fullname: string;
  };
}

interface CsDepartmentCommission {
  id: string;
  commission_amount: number;
  status: string;
  createdAt: string;
}

interface CommissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: string;
  purchaseDetails: {
    book_number: string;
    customer_number?: string;
    d_route?: string;
    d_transport?: string;
    d_origin?: string;
    d_destination?: string;
    profit_loss?: number;
    billing_amount?: number;
  };
}

const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({
  isOpen,
  onClose,
  purchaseId,
  purchaseDetails,
}) => {
  const [employeeCommissions, setEmployeeCommissions] = useState<EmployeeCommission[]>([]);
  const [csCommission, setCsCommission] = useState<CsDepartmentCommission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCommission, setTotalCommission] = useState<number>(0);

  useEffect(() => {
    if (isOpen && purchaseId) {
      fetchCommissionDetails();
    }
  }, [isOpen, purchaseId]);

  const fetchCommissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch employee commissions
      const employeeResponse = await axios.get(`/hr/commission-ranks/employee-commissions/${purchaseId}`);
      
      // Fetch CS department commission
      const csResponse = await axios.get(`/hr/commission-ranks/cs-commission/${purchaseId}`);
      
      if (employeeResponse.data) {
        setEmployeeCommissions(employeeResponse.data);
        
        // Calculate total employee commission
        const total = employeeResponse.data.reduce(
          (sum: number, item: EmployeeCommission) => sum + (item.commission_amount || 0),
          0
        );
        setTotalCommission(total);
      }
      
      if (csResponse.data) {
        setCsCommission(csResponse.data);
      }
    } catch (error) {
      console.error("Error fetching commission details:", error);
      setError("ไม่สามารถดึงข้อมูลค่าคอมมิชชั่นได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">รายละเอียดค่าคอมมิชชั่น</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <span>กำลังโหลดข้อมูล...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-2">ข้อมูลงาน</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">เลขที่บุ๊คกิ้ง</p>
                    <p className="font-medium">{purchaseDetails.book_number}</p>
                  </div>
                  {purchaseDetails.customer_number && (
                    <div>
                      <p className="text-sm text-gray-500">เลขที่ลูกค้า</p>
                      <p className="font-medium">{purchaseDetails.customer_number}</p>
                    </div>
                  )}
                  {purchaseDetails.billing_amount !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">ยอดเรียกเก็บ</p>
                      <p className="font-medium">
                        {formatCurrency(purchaseDetails.billing_amount)}
                      </p>
                    </div>
                  )}
                  {purchaseDetails.profit_loss !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">กำไร/ขาดทุน</p>
                      <p className={`font-medium ${purchaseDetails.profit_loss < 0 ? "text-red-600" : "text-green-600"}`}>
                        {formatCurrency(purchaseDetails.profit_loss)}
                      </p>
                    </div>
                  )}
                  {purchaseDetails.d_route && (
                    <div>
                      <p className="text-sm text-gray-500">เส้นทาง</p>
                      <p className="font-medium">{purchaseDetails.d_route}</p>
                    </div>
                  )}
                  {purchaseDetails.d_transport && (
                    <div>
                      <p className="text-sm text-gray-500">ขนส่ง</p>
                      <p className="font-medium">{purchaseDetails.d_transport}</p>
                    </div>
                  )}
                  {purchaseDetails.d_origin && (
                    <div>
                      <p className="text-sm text-gray-500">ต้นทาง</p>
                      <p className="font-medium">{purchaseDetails.d_origin}</p>
                    </div>
                  )}
                  {purchaseDetails.d_destination && (
                    <div>
                      <p className="text-sm text-gray-500">ปลายทาง</p>
                      <p className="font-medium">{purchaseDetails.d_destination}</p>
                    </div>
                  )}
                </div>
              </div>

              {employeeCommissions.length > 0 && (
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            สถานะ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            วันที่บันทึก
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employeeCommissions.map((commission) => (
                          <tr key={commission.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {commission.employee?.fullname || "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {commission.commission_type === "percentage" ? "เปอร์เซ็นต์ (%)" : "จำนวนเงิน (บาท)"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {commission.commission_type === "percentage" 
                                  ? `${commission.commission_value}%` 
                                  : formatCurrency(commission.commission_value)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatCurrency(commission.commission_amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {commission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(commission.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-right font-semibold">
                            รวมค่าคอมมิชชั่นพนักงานทั้งหมด
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">
                            {formatCurrency(totalCommission)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {csCommission && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-2">ค่าคอมมิชชั่นแผนก CS</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            จำนวนเงิน
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            สถานะ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            วันที่บันทึก
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(csCommission.commission_amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {csCommission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(csCommission.createdAt)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {employeeCommissions.length === 0 && !csCommission && (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
                  ไม่พบข้อมูลค่าคอมมิชชั่นสำหรับงานนี้
                </div>
              )}
            </>
          )}

          <div className="flex justify-end mt-5">
            <Button onClick={onClose}>
              ปิด
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetailsModal;
