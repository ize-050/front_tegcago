import axios from '../../axios';

// Interface สำหรับข้อมูลการฝากชำระ
export interface CustomerDepositData {
  amountRMB?: number | null;
  priceDifference?: number | null;
  exchangeRate?: number | null;
  fee?: number;
  amount?: number;
  vat?: number;
  totalWithVat?: number;
  transferDate?: string;
  receivingAccount?: string;
  exchangeRateProfit?: number;
  incomePerTransaction?: number;
  totalDepositAmount?: number | string; // เพิ่มฟิลด์ใหม่
  includeVat?: boolean;
  notes?: string;
  existingTransferSlip?: string;
  transferSlipUrl?: string; // เพิ่ม property สำหรับเก็บ URL ของรูปภาพ
  formattedAmount?: string;
  formattedExchangeRateProfit?: string;
  formattedIncomePerTransaction?: string;
}

// Interface สำหรับข้อมูลการโอน
export interface ExchangeData {
  amountRMB?: number | null;
  priceDifference?: number | null;
  exchangeRate?: number | null;
  fee?: number;
  amount?: number;
  transferDate?: string;
  receivingAccount?: string;
  exchangeRateProfit?: number;
  incomePerTransaction?: number;
  includeVat?: boolean;
  vatAmount?: number;
  totalWithVat?: number;
  notes?: string;
  existingTransferSlip?: string;
  transferSlipUrl?: string; // เพิ่ม property สำหรับเก็บ URL ของรูปภาพ
  formattedAmount?: string;
  formattedExchangeRateProfit?: string;
  formattedIncomePerTransaction?: string;
}

// Interface สำหรับข้อมูลการบันทึกรายการเงิน
export interface RecordMoneyData {
  date: string;
  salesperson: string;
  documentNumber: string;
  customerId: string;
  type: 'deposit' | 'order' | 'topup';
  deposit_purpose?: string; // เพิ่มฟิลด์สำหรับเก็บข้อมูลว่าฝากเรื่องอะไร
  customerDeposit?: CustomerDepositData;
  exchange?: ExchangeData;
  transferSlipUrl?: string;
}

/**
 * บันทึกข้อมูลรายการเงิน
 * @param formData FormData ที่มีข้อมูลและไฟล์ทั้งหมด
 * @returns Promise ที่ resolve เมื่อบันทึกสำเร็จ
 */
export const createRecordMoney = async (formData: FormData) => {
  try {
    console.log('Sending FormData to API');
    
    // ส่งข้อมูลไปยัง API
    const response = await axios.post('/finance/record-money', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating record money:', error);
    throw error;
  }
};

/**
 * อัปเดตข้อมูลรายการเงิน
 * @param id ID ของรายการเงิน
 * @param formData FormData ที่มีข้อมูลและไฟล์ทั้งหมด
 * @returns Promise ที่ resolve เมื่ออัปเดตสำเร็จ
 */
export const updateRecordMoney = async (id: string, formData: FormData) => {
  try {
    console.log('Sending FormData to API for update, ID:', id);
    
    // ส่งข้อมูลไปยัง API
    const response = await axios.put(`/finance/record-money/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating record money:', error);
    throw error;
  }
};

/**
 * ดึงข้อมูลรายการเงินทั้งหมด
 * @returns Promise ที่ resolve พร้อมข้อมูลรายการเงินทั้งหมด
 */
export const getRecordMoneyList = async () => {
  try {
    const response = await axios.get('/finance/record-money');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงข้อมูลรายการเงินตาม ID
 * @param id ID ของรายการเงิน
 * @returns Promise ที่ resolve พร้อมข้อมูลรายการเงิน
 */
export const getRecordMoneyById = async (id: string) => {
  try {
    console.log(`กำลังดึงข้อมูลรายการเงินด้วย ID: ${id}`);
    // ใช้ endpoint ที่เพิ่งสร้างใหม่
    const response = await axios.get(`/finance/record-money/${id}`);
    console.log('ผลลัพธ์จาก API:', response.data);
    return response.data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรายการเงิน:', error);
    throw error;
  }
};
