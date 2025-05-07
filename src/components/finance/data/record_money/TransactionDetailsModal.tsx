"use client";

import { Fragment, FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import Button from "@/components/Base/Button";

interface CustomerDeposit {
    amountRMB: number;
    priceDifference: number;
    exchangeRate: number;
    fee: number;
    amount: number;
    vat: number;
    totalWithVat: number;
    transferDate: string;
    receivingAccount: string;
    exchangeRateProfit: number;
    incomePerTransaction: number;
    notes?: string;
    transferSlipUrl?: any;
}

interface Exchange {
    amountRMB: number;
    priceDifference: number;
    exchangeRate: number;
    fee: number;
    amount: number;
    productDetails?: string | null;
    orderStatus?: string;
    topupPlatform?: string | null;
    topupAccount?: string | null;
    transferDate: string;
    incomePerTransaction: number;
    receivingAccount: string;
    notes?: string;
    transferSlipUrl?: string | null;
}

interface Transaction {
    id: string;
    type: 'deposit' | 'order' | 'topup';
    date: string;
    documentNumber: string;
    transferDate: string;
    user: any
    customerId: string;
    salespersonId: string;
    createdAt: string;
    updatedAt: string | null;
    customerDeposit?: CustomerDeposit;
    exchange?: Exchange;
}

interface Props {
    show: boolean;
    onClose: () => void;
    transaction: any;
}

const TransactionDetailsModal: FC<Props> = ({ show, onClose, transaction }) => {
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return '-';
        return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: th });
    };

    const renderDetails = () => {
        return (
            <>
                {transaction?.customerDeposit && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="col-span-2 font-medium text-lg">รายละเอียดการฝากเงิน</div>
                        <div>
                            <div className="font-medium">จำนวนเงิน (RMB)</div>
                            <div>{formatCurrency(transaction.customerDeposit.amountRMB)} RMB</div>
                        </div>
                        <div>
                            <div className="font-medium">วันที่โอน</div>
                            <div>{formatDate(transaction.customerDeposit.transferDate)}</div>
                        </div>
                        <div>
                            <div className="font-medium">อัตราแลกเปลี่ยน</div>
                            <div>{formatCurrency(transaction.customerDeposit.exchangeRate)}</div>
                        </div>
                        <div>
                            <div className="font-medium">ค่าธรรมเนียม</div>
                            <div>{formatCurrency(transaction.customerDeposit.fee)} บาท</div>
                        </div>
                        <div>
                            <div className="font-medium">จำนวนเงิน (THB)</div>
                            <div>{formatCurrency(transaction.customerDeposit.amount)} บาท</div>
                        </div>
                        <div>
                            <div className="font-medium">ภาษีมูลค่าเพิ่ม</div>
                            <div>{formatCurrency(transaction.customerDeposit.vat)} บาท</div>
                        </div>
                        <div>
                            <div className="font-medium">จำนวนรวมภาษีมูลค่าเพิ่ม</div>
                            <div>{formatCurrency(transaction.customerDeposit.totalWithVat)} บาท</div>
                        </div>
                        <div>
                            <div className="font-medium">บัญชีผู้รับเงิน</div>
                            <div>{transaction.customerDeposit.receivingAccount || '-'}</div>
                        </div>
                    </div>
                )}

                <hr></hr>

                <br></br>

                {transaction?.exchange && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 font-medium text-lg">รายละเอียดการแลกเปลี่ยน</div>
                        <div>
                            <div className="font-medium">จำนวนเงิน (RMB)</div>
                            <div>{formatCurrency(transaction.exchange.amountRMB)} RMB</div>
                        </div>
                        <div>
                            <div className="font-medium">ส่วนต่างต่อรองราคา</div>
                            <div>{formatCurrency(transaction.exchange.priceDifference)} RMB</div>
                        </div>
                        <div>
                            <div className="font-medium">อัตราแลกเปลี่ยน</div>
                            <div>{formatCurrency(transaction.exchange.exchangeRate)}</div>
                        </div>
                        <div>
                            <div className="font-medium">ค่าธรรมเนียม</div>
                            <div>{formatCurrency(transaction.exchange.fee)} บาท</div>
                        </div>
                        <div>
                            <div className="font-medium">จำนวนเงิน (THB)</div>
                            <div>{formatCurrency(transaction.exchange.amount)} บาท</div>
                        </div>


                        <div>
                            <div className="font-medium">กำไรอัตราแลกเปลี่ยน</div>
                            <div>{formatCurrency(transaction.exchange.incomePerTransaction)} บาท</div>
                        </div>

                        <div>
                            <div className="font-medium">บัญชีผู้รับเงิน</div>
                            <div>{transaction.exchange.receivingAccount || '-'}</div>
                        </div>

                        <div>
                            <div className="font-medium">บัญชีผู้รับเงิน</div>
                            <div>{transaction.exchange.receivingAccount || '-'}</div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    รายละเอียดธุรกรรม
                                </Dialog.Title>

                                <div className="mt-2">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="font-medium">วันที่ทำรายการ</div>
                                            <div>{formatDate(transaction?.date)}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">เลขที่เอกสาร</div>
                                            <div>{transaction?.documentNumber || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">รหัสลูกค้า</div>
                                            <div>{transaction?.customerId || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">รหัสพนักงานขาย</div>
                                            <div>{transaction?.user?.fullname || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">วันที่โอน</div>
                                            <div>{formatDate(transaction?.transferDate)}</div>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        {renderDetails()}
                                    </div>
                                    {(transaction?.customerDeposit?.notes || transaction?.exchange?.notes) && (
                                        <div className="border-t pt-4 mt-4">
                                            <div className="font-medium">หมายเหตุ</div>
                                            <div>{transaction?.customerDeposit?.notes || transaction?.exchange?.notes}</div>
                                        </div>
                                    )}
                                    {(transaction?.customerDeposit?.transferSlipUrl || transaction?.exchange?.transferSlipUrl) && (
                                        <div className="border-t pt-4 mt-4">
                                            <div className="font-medium mb-2">หลักฐานการโอน</div>
                                            <img
                                                src={ transaction?.customerDeposit?.transferSlipUrl || transaction?.exchange?.transferSlipUrl}
                                                alt="Transfer Slip"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-right">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={onClose}
                                    >
                                        ปิด
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TransactionDetailsModal;
