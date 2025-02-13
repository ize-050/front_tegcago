import Table from "@/components/Base/Table";


import { financeData } from "@/stores/finance";
import { Controller } from "react-hook-form";
import { useAppSelector } from "@/stores/hooks";
import { useEffect,useState ,Fragment } from "react";

const FormPaymentComponent = () => {

    const  {
        purchaseFinanceData
    } = useAppSelector(financeData);


    const [PaymentData, SetPaymentData] = useState<any[]>([]);

    useEffect(() => {

        if(purchaseFinanceData){
            SetPaymentData(purchaseFinanceData?.d_purchase_customer_payment)  
        }

        console.log("purchaseFinanceData",purchaseFinanceData)
        
    }, [purchaseFinanceData])

    return (
        <div className="p-0 flex flex-col">
        <div className="flex">
            <div className="flex-1 w-50">
                <h1 className="mb-5  text-xl font-semibold">ยอดชำระเงิน</h1>
            </div>


        </div>
        <Table className="border-b border-gray-100">
            <Table.Thead>
                <Table.Tr
                    style={{
                        background: "#FAFAFA",

                    }}
                    className="text-sm font-bold"
                >
                    <Table.Td
                        className="py-4 font-medium truncate text-center   border-t  border-slate-200/60 text-black">
                        No
                    </Table.Td>
                    <Table.Td className="py-4 font-medium text-center   border-t  border-slate-200/60 text-black">
                        หัวข้อการชำระเงิน
                    </Table.Td>
                    <Table.Td
                        className="py-4 font-medium   text-center  truncate border-t  border-slate-200/60 text-black">
                        ยอดเงิน
                    </Table.Td>

                    <Table.Td
                        className="py-4 font-medium truncate text-center  border-t  border-slate-200/60 text-black">
                        สกุลเงิน
                    </Table.Td>
                </Table.Tr>
            </Table.Thead>


            <Table.Tbody>
                {PaymentData?.length > 0 && PaymentData?.map((item: any, index: number) => (
                    <Fragment key={index}>
                        <Table.Tr>
                            <Table.Td className="text-center">
                                {index + 1}
                            </Table.Td>
                            <Table.Td className="text-center ">
                                {item.payment_name}
                            </Table.Td>
                            <Table.Td className="text-center">
                                {item.payment_price}
                            </Table.Td>
                            <Table.Td className="text-center">
                                {item.payment_type  }
                            </Table.Td>
                        </Table.Tr>
                    </Fragment>

                ))}

            </Table.Tbody>


        </Table>
        
      


    </div>
    );
};


export default FormPaymentComponent;