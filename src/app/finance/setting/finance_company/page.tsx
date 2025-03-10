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

interface FinanceCompany {
    id: string;
    company_name: string;
    bank_name: string;
    bank_account: string;
    createdAt: string;
    updatedAt: string | null;
}

interface FormData {
    company_name: string;
    bank_name: string;
    bank_account: string;
}

export default function FinanceCompanyPage() {
    const [companies, setCompanies] = useState<FinanceCompany[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<FinanceCompany | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/finance/company`);
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลได้',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            if (editingCompany) {
                await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/finance/company/${editingCompany.id}`, data);
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/finance/company`, data);
            }

            await fetchCompanies();
            setIsModalOpen(false);
            reset();
            setEditingCompany(null);

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: editingCompany ? 'แก้ไขข้อมูลสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
        } catch (error) {
            console.error('Error saving company:', error);
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

    const handleEdit = (company: FinanceCompany) => {
        setEditingCompany(company);
        reset({
            company_name: company.company_name,
            bank_name: company.bank_name,
            bank_account: company.bank_account
        });
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
                await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}/finance/company/${id}`);
                await fetchCompanies();
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลบข้อมูลสำเร็จ',
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error('Error deleting company:', error);
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
                <h2 className="text-lg font-medium">ตั้งค่าบัญชีบริษัท</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingCompany(null);
                        reset({ company_name: '', bank_name: '', bank_account: '' });
                        setIsModalOpen(true);
                    }}
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    เพิ่มบัญชีบริษัท
                </Button>
            </div>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className="whitespace-nowrap">ลำดับ</Table.Th>
                        <Table.Th className="whitespace-nowrap">ชื่อบริษัท</Table.Th>
                        <Table.Th className="whitespace-nowrap">ชื่อธนาคาร</Table.Th>
                        <Table.Th className="whitespace-nowrap">เลขบัญชี</Table.Th>
                        <Table.Th className="whitespace-nowrap">จัดการ</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {companies.map((company, index) => (
                        <Table.Tr key={company.id}>
                            <Table.Td>{index + 1}</Table.Td>
                            <Table.Td>{company.company_name}</Table.Td>
                            <Table.Td>{company.bank_name}</Table.Td>
                            <Table.Td>{company.bank_account}</Table.Td>
                            <Table.Td>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleEdit(company)}
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="soft-danger"
                                        onClick={() => handleDelete(company.id)}
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
                                        {editingCompany ? 'แก้ไขบัญชีบริษัท' : 'เพิ่มบัญชีบริษัท'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mt-2 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ชื่อบริษัท
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('company_name', { required: 'กรุณากรอกชื่อบริษัท' })}
                                                    className="form-control"
                                                    placeholder="กรอกชื่อบริษัท"
                                                />
                                                {errors.company_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ชื่อธนาคาร
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('bank_name', { required: 'กรุณากรอกชื่อธนาคาร' })}
                                                    className="form-control"
                                                    placeholder="กรอกชื่อธนาคาร"
                                                />
                                                {errors.bank_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.bank_name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    เลขบัญชี
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('bank_account', { required: 'กรุณากรอกเลขบัญชี' })}
                                                    className="form-control"
                                                    placeholder="กรอกเลขบัญชี"
                                                />
                                                {errors.bank_account && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.bank_account.message}</p>
                                                )}
                                            </div>
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
                                                {editingCompany ? 'แก้ไข' : 'เพิ่ม'}
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