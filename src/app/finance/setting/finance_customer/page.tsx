"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../../../../axios';
import Button from '@/components/Base/Button';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Table from '@/components/Base/Table';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface FinanceCustomer {
    id: string;
    finance_name: string;
    createdAt: string;
    updatedAt: string | null;
}

interface FormData {
    finance_name: string;
}

export default function FinanceCustomerPage() {
    const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<FinanceCustomer | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/customer`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลได้',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            if (editingCustomer) {
                await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/finance/customer/${editingCustomer.id}`, data);
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/finance/customer`, data);
            }
            
            await fetchCustomers();
            setIsModalOpen(false);
            reset();
            setEditingCustomer(null);
            
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: editingCustomer ? 'แก้ไขข้อมูลสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
        } catch (error) {
            console.error('Error saving customer:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer: FinanceCustomer) => {
        setEditingCustomer(customer);
        reset({ finance_name: customer.finance_name });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });

            if (result.isConfirmed) {
                await axios.delete(`/finance/customer/${id}`);
                await fetchCustomers();
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลบข้อมูลสำเร็จ',
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบข้อมูลได้',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-medium">ตั้งค่าบัญชี</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingCustomer(null);
                        reset({ finance_name: '' });
                        setIsModalOpen(true);
                    }}
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    เพิ่มบัญชี
                </Button>
            </div>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className="whitespace-nowrap">ลำดับ</Table.Th>
                        <Table.Th className="whitespace-nowrap">ชื่อบัญชี</Table.Th>
                        <Table.Th className="whitespace-nowrap">จัดการ</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {customers.map((customer, index) => (
                        <Table.Tr key={customer.id}>
                            <Table.Td>{index + 1}</Table.Td>
                            <Table.Td>{customer.finance_name}</Table.Td>
                            <Table.Td>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleEdit(customer)}
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="soft-danger"
                                        onClick={() => handleDelete(customer.id)}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {editingCustomer ? 'แก้ไขบัญชี' : 'เพิ่มบัญชี'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ชื่อบัญชี
                                            </label>
                                            <input
                                                type="text"
                                                {...register('finance_name', { required: 'กรุณากรอกชื่อบัญชี' })}
                                                className="form-control"
                                                placeholder="กรอกชื่อบัญชี"
                                            />
                                            {errors.finance_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.finance_name.message}</p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end space-x-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                ยกเลิก
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                // loading={loading}
                                            >
                                                {editingCustomer ? 'แก้ไข' : 'เพิ่ม'}
                                            </Button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
