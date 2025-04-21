"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { financeData, setModalRecordMoney, setEditRecord } from "@/stores/finance";
import PaymentFormComponent, { PaymentForm } from './PaymentForm';
import ReceiptFormComponent, { ReceiptForm } from './ReceiptForm';
import axios from '../../../../../axios';
import Image from "next/image";
import Lucide from "@/components/Base/Lucide";
import ModalViewmage from '@/components/Content/Prepurchase/upload/ModalPreview';
import UploadImageComponent from "@/components/Uploadimage/UpdateImageComponent";
import Swal from "sweetalert2";

type FormType = 'pay' | 'receive';

const ModalRecordMoneyComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {modalRecordMoney, editRecord} = useAppSelector(financeData);
  const [formType, setFormType] = useState<FormType>('pay');
  const [recordData, setRecordData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [newTransferSlip, setNewTransferSlip] = useState<File | null>(null);

  // Set the form type based on the editRecord type when the modal opens
  useEffect(() => {
    if (modalRecordMoney && editRecord.type) {
      setFormType(editRecord.type === 'PAYMENT' ? 'pay' : 'receive');
    } else if (!modalRecordMoney) {
      // Reset form type when modal closes
      setFormType('pay');
    }
  }, [modalRecordMoney, editRecord]);

  // Function to fetch record details when editing
  const fetchRecordDetails = async () => {
    if (editRecord.id) {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records/${editRecord.id}`);
        
        // Format the data for display
        const recordData = response.data.data;
        
        // Add the full URL for the transfer slip if it exists
        if (recordData.transferSlip) {
          // Ensure the URL is properly formatted with http:// or https://
          if (recordData.transferSlip.startsWith('/')) {
            // If it's a relative path starting with /, add the base URL
            recordData.transferSlip = `${process.env.NEXT_PUBLIC_URL_API}/images/transferSlip/${recordData.transferSlip}`;
          } else if (!recordData.transferSlip.startsWith('http://') && !recordData.transferSlip.startsWith('https://')) {
            // If it doesn't start with http:// or https://, add the base URL with a /
            recordData.transferSlip = `${process.env.NEXT_PUBLIC_URL_API}/images/transferSlip/${recordData.transferSlip}`;
          }
          // If it already starts with http:// or https://, leave it as is
        }
        
        console.log('Transfer slip URL:', recordData.transferSlip);
        setRecordData(recordData);
        return recordData;
      } catch (error) {
        console.error('Error fetching record details:', error);
        return null;
      } finally {
        setLoading(false);
      }
    }
    return null;
  };

  // Handle file upload for transfer slip
  const handleFileUpload = (files: File[]) => {
    if (files && files.length > 0) {
      setNewTransferSlip(files[0]);
    } else {
      setNewTransferSlip(null);
    }
  };

  // Effect to fetch record details when editing
  useEffect(() => {
    if (modalRecordMoney && editRecord.id) {
      fetchRecordDetails();
    } else if (!modalRecordMoney) {
      // Clear record data when modal closes
      setRecordData(null);
    }
  }, [modalRecordMoney, editRecord.id]);

  // Function to close the modal and reset state
  const onClose = () => {
    dispatch(setModalRecordMoney(false));
    dispatch(setEditRecord({ id: null, type: null }));
    setFormType('pay');
    setRecordData(null);
    setNewTransferSlip(null);
  };

  // Function to refresh data after successful submission
  const refreshData = () => {
    // Dispatch an event that TableComponent can listen to for refreshing data
    const event = new CustomEvent('refreshFinancialRecords');
    window.dispatchEvent(event);
  };

  const onSubmitPayment = async (data: PaymentForm) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add all form fields to formData
      formData.append('date', data.date);
      formData.append('title', data.title);
      formData.append('accountOwner', data.account.toUpperCase());
      formData.append('type', 'PAYMENT');
      formData.append('amountRMB', data.amountRMB.toString());
      formData.append('transferDate', data.transferDate);
      formData.append('details', data.details || '');
      formData.append('payTo', data.payTo || '');
      
      // Check if user wants to delete the existing image
      // We need to explicitly send this information to the backend
      if (editRecord.id && recordData?.transferSlip) {
        // If we're editing and there was an existing image
        if (data.existingTransferSlip === null) {
          // If existingTransferSlip is explicitly set to null, it means user clicked delete
          formData.append('deleteTransferSlip', 'true');
          console.log('User wants to delete the existing transfer slip');
        }
      }
      
      // Add file if a new one was uploaded
      if (newTransferSlip) {
        formData.append('transferSlip', newTransferSlip);
      }

      if(data.files && data.files.length > 0) {
        data.files.forEach((file: File) => {
          formData.append('transferSlip', file);
        });
      } 

      // Determine if this is an update or create operation
      const isUpdate = !!editRecord.id;
      const url = isUpdate 
        ? `${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records/${editRecord.id}` 
        : `${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records`;
      
      // Send to API using axios with appropriate method
      const response = isUpdate
        ? await axios.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: isUpdate ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500
      });
      
      onClose();
      refreshData();
    } catch (error) {
      console.error("Error submitting payment form:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReceipt = async (data: ReceiptForm) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add all form fields to formData
      formData.append('date', data.date);
      formData.append('title', data.title);
      formData.append('accountOwner', data.account.toUpperCase());
      formData.append('type', 'RECEIPT');
      formData.append('amountRMB', data.amountRMB.toString());
      formData.append('transferDate', data.transferDate);
      formData.append('details', data.details || '');
      
      // Add receipt-specific fields
      if (data.amountTHB) {
        formData.append('amountTHB', data.amountTHB.toString());
      }
      if (data.exchangeRate) {
        formData.append('exchangeRate', data.exchangeRate);
      }
      
      // Check if user wants to delete the existing image
      // We need to explicitly send this information to the backend
      if (editRecord.id && recordData?.transferSlip) {
        // If we're editing and there was an existing image
        if (data.existingTransferSlip === null) {
          // If existingTransferSlip is explicitly set to null, it means user clicked delete
          formData.append('deleteTransferSlip', 'true');
          console.log('User wants to delete the existing transfer slip');
        }
      }
      
      // Add file if a new one was uploaded
      if (newTransferSlip) {
        formData.append('transferSlip', newTransferSlip);
      }

      if(data.files && data.files.length > 0) {
        data.files.forEach((file: File) => {
          formData.append('transferSlip', file);
        });
      }
      
      // Determine if this is an update or create operation
      const isUpdate = !!editRecord.id;
      const url = isUpdate 
        ? `${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records/${editRecord.id}` 
        : `${process.env.NEXT_PUBLIC_URL_API}/finance/financial-records`;
      
      // Send to API using axios with appropriate method
      const response = isUpdate
        ? await axios.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: isUpdate ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500
      });
      
      onClose();
      refreshData();
    } catch (error) {
      console.error("Error submitting receipt form:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={modalRecordMoney} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        open={modalRecordMoney}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-1 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                        {editRecord.id ? 'แก้ไขข้อมูล' : 'บันทึกข้อมูล'}
                      </Dialog.Title>
                      
                      {/* Loading indicator */}
                      {loading && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                          <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>กำลังบันทึกข้อมูล...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">
                          {editRecord.id 
                            ? `แก้ไขข้อมูลการโอนเงิน (${formType === 'pay' ? 'จ่าย' : 'รับ'})` 
                            : 'บันทึกข้อมูลการโอนเงิน (บันทึกฝั่งจีน)'}
                        </h2>
                      </div>

                      
                      <div className="flex items-center space-x-4 mb-4">
                        <label className={`inline-flex items-center ${editRecord.id ? 'opacity-60' : ''}`}>
                          <input
                            type="radio"
                            className="form-radio text-primary h-4 w-4"
                            checked={formType === 'receive'}
                            onChange={() => setFormType('receive')}
                            disabled={!!editRecord.id}
                          />
                          <span className="ml-2">รับ</span>
                        </label>
                        <label className={`inline-flex items-center ${editRecord.id ? 'opacity-60' : ''}`}>
                          <input
                            type="radio"
                            className="form-radio text-primary h-4 w-4"
                            checked={formType === 'pay'}
                            onChange={() => setFormType('pay')}
                            disabled={!!editRecord.id}
                          />
                          <span className="ml-2">จ่าย</span>
                        </label>
                        {editRecord.id && (
                          <span className="text-sm text-blue-600 ml-2">
                            (กำลังแก้ไขข้อมูล)
                          </span>
                        )}
                      </div>

                      {formType === 'pay' ? (
                        <PaymentFormComponent 
                          onSubmit={onSubmitPayment} 
                          initialData={recordData && editRecord.type === 'PAYMENT' ? {
                            date: recordData.date?.split('T')[0] || '',
                            title: recordData.title || '',
                            account: recordData.accountOwner?.toLowerCase() || '',
                            payTo: recordData.payTo || '',
                            transferDate: recordData.transferDate?.split('T')[0] || '',
                            amountRMB: recordData.amountRMB || 0,
                            details: recordData.details || '',
                            existingTransferSlip: recordData.transferSlip || undefined
                          } : undefined}
                        />
                      ) : (
                        <ReceiptFormComponent 
                          onSubmit={onSubmitReceipt} 
                          initialData={recordData && editRecord.type === 'RECEIPT' ? {
                            date: recordData.date?.split('T')[0] || '',
                            title: recordData.title || '',
                            account: recordData.accountOwner?.toLowerCase() || '',
                            transferDate: recordData.transferDate?.split('T')[0] || '',
                            amountRMB: recordData.amountRMB || 0,
                            amountTHB: recordData.amountTHB || '',
                            exchangeRate: recordData.exchangeRate || '',
                            details: recordData.details || '',
                            existingTransferSlip: recordData.transferSlip || undefined
                          } : undefined}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      
      {/* Image Preview Modal */}
      {showImagePreview && (
        <ModalViewmage
          isOpen={showImagePreview}
          onClose={() => setShowImagePreview(false)}
          images={previewImageUrl}
        />
      )}
    </Transition.Root>
  );
};

export default ModalRecordMoneyComponent;